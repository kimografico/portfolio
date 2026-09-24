# Despliegue en dominio raiz (kimografico.com)

Documento que explica como esta configurado el base path del portfolio para poder
desplegarlo en un dominio propio **sin subcarpeta** (`https://kimografico.com/`) o en
GitHub Pages (`https://kimografico.github.io/portfolio/`) cambiando lo minimo posible.

---

## Arquitectura: un solo interruptor

El prefijo de ruta (`base`) se define en **un unico sitio**: la propiedad `base` de
`vite.config.ts`. De ahi se deriva todo automaticamente:

```
vite.config.ts `base`
   └─> import.meta.env.BASE_URL  (inyectado por Vite en build/dev)
        └─> APP_BASENAME          (src/data/config/app.ts, sin barra final)
             ├─> Bases de assets  (PORTFOLIO_IMAGES_BASE, CLIENTS_BASE, THUMBS_BASE, ...)
             ├─> resolveAssetPath (normaliza CUALQUIER ruta al contexto actual)
             └─> React Router basename (main.tsx)
```

Reglas que sigue el proyecto para que esto funcione:

- **Los JSON guardan SOLO nombres de archivo** (proyectos, ilustraciones) o **rutas
  relativas a la raiz del sitio** (`/images/...`, carrusel). Nunca llevan el prefijo.
- **El codigo construye la URL completa** con las constantes de `app.ts`.
- **`resolveAssetPath()`** resuelve en render las rutas almacenadas al contexto actual:
  en la raiz las deja igual (`/images/...`) y en una subcarpeta les antepone el basename
  (`/portfolio/images/...`). Tambien limpia el prefijo `/portfolio/` legacy de JSON
  antiguos (via `processImagePath` en `imagePathHelper.ts`).
- **Los paths PWA** (manifest `id`/`scope`/`start_url`, `navigateFallback`, handler de
  protocolo, `urlPattern` del SW) viven en `vite.config.ts` y SI hay que ajustarlos a
  mano, pero estan todos en el mismo archivo.

---

## Estado actual: dominio raiz

- `vite.config.ts` → `base: '/'`, PWA con `id`/`scope`/`start_url: '/'`,
  `navigateFallback: '/index.html'`, protocol handler `/?url=%s`, `urlPattern: /\/images\/.*/i`.
- `.env` → `VITE_BOOK_COVERS_PATH=/images/books`, `VITE_ILLUSTRATIONS_PATH=/images/illustrations`,
  `VITE_UI_IMG_PATH=/images/ui`. El codigo antepone `APP_BASENAME` a estas rutas.
- `public/404.html` → redirige a `/index.html`.
- `scripts/generate-thumbs.cjs` → reconstruye rutas basename-free (`/images/portfolio/...`).

---

## Como volver a GitHub Pages

Son **dos archivos de configuracion** + el SPA fallback + los tests E2E. No se toca
ningun dato (JSONs), ni componentes, ni `.env`:

### 1. `vite.config.ts` (unico archivo de rutas)

```ts
base: '/portfolio/',
// PWA manifest
id: '/portfolio/',
scope: '/portfolio/',
start_url: '/portfolio/',
// protocol handler
url: '/portfolio/?url=%s',
// service worker
navigateFallback: '/portfolio/index.html',
urlPattern: /\/portfolio\/images\/.*/i,   // cache de imagenes
```

> `APP_BASENAME` en `app.ts` se adapta SOLA porque deriva de `BASE_URL`.

### 2. `public/404.html`

```js
'/portfolio/index.html?redirect=' + encodeURIComponent(path + searchParams),
```

(necesario en GitHub Pages; en hosting con SPA fallback se usa `public/_redirects`
con `/* /index.html 200`)

### 3. Tests E2E

- `tests/e2e/support/world.ts` → `baseURL: 'http://localhost:5173/portfolio/'`
- `tests/e2e/page-objects/PortfolioShell.ts` → `APP_BASENAME = '/portfolio'`
- `tests/e2e/page-objects/KimoContentPages.ts` → `APP_BASENAME = '/portfolio'`

### 4. Verificacion

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build   # comprobar que dist/index.html referencia /portfolio/assets/*
```

---

## Por que NO hay que tocar el resto

| Elemento | Por que no se toca |
|----------|--------------------|
| JSONs de proyectos (GD/Dev/Kimo) | Solo guardan nombres de archivo |
| `src/data/carousel.json` | Guarda rutas raiz-relative (`/images/...`); `resolveAssetPath` las resuelve en render |
| `.env` + portadas/ilustraciones | El codigo antepone `APP_BASENAME` a las rutas de env |
| `scripts/generate-thumbs.cjs` | Reconstruye rutas basename-free y las resuelve contra el filesystem |
| `src/data/config/app.ts` | Deriva `APP_BASENAME` de `BASE_URL` |
| `index.html` | No tiene rutas hardcodeadas |
| `.github/workflows/deploy.yml` | Sube `dist/` tal cual; el path lo pone `base` de Vite |

Los datos almacenados desde el admin (`/kimo`) tambien se normalizan: las subidas
devuelven rutas raiz-relative y `CarouselManager` elimina el basename activo al
guardar, de modo que los JSONs permanecen agnosticos al contexto.

---

## Puntos a no olvidar

- **`import.meta.env.BASE_URL`** refleja el `base` de Vite tanto en `vite dev` como en
  `vite build`. En tests de Vitest vale `'/'`.
- **Nunca hardcodear** un prefijo (`/portfolio` o `/images`) en un componente o JSON
  nuevo: usar las constantes de `app.ts` o `resolveAssetPath`.
- El cache del **service worker** en navegadores ya instalados puede quedarse con las
  rutas antiguas; borrar cache/manifest manualmente tras un cambio de base.
- Si se cambia `base`, conviene regenerar PWA (el manifest incrustado en el build se
  actualiza solo, pero `navigateFallback` y `urlPattern` son manuales).