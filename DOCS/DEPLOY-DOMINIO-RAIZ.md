# Despliegue en dominio raiz (kimografico.com)

Documento que explica el cambio de base path realizado para desplegar el portfolio en un
dominio propio **sin subcarpeta** (`https://kimografico.com/` en vez de
`https://kimografico.github.io/portfolio/`).

---

## Estado actual

Toda la aplicacion se construye y sirve desde la **raiz del dominio** (`/`):

- `vite.config.ts` → `base: '/'`
- `APP_BASENAME` (React Router) → `''` (rutas relativas a la raiz)
- Imagenes, portadas, ilustraciones y recursos UI → `/images/...`
- PWA manifest → `id`, `scope` y `start_url` en `/`
- Service worker → `navigateFallback: '/index.html'`
- SPA fallback (`404.html`) → redirige a `/index.html`

> El workflow de GitHub Actions (`deploy.yml`) **no necesita cambios**: sube el contenido
> de `dist/` sin prefijo. El path lo decide el `base` de Vite.

---

## Archivos modificados

| Archivo | Antes (GitHub Pages) | Ahora (dominio raiz) |
|---------|----------------------|----------------------|
| `vite.config.ts` | `base: '/portfolio/'` | `base: '/'` |
| `vite.config.ts` | PWA `id`/`scope`/`start_url: '/portfolio/'` | `'/'` |
| `vite.config.ts` | URL protocol handler `/portfolio/?url=%s` | `/?url=%s` |
| `vite.config.ts` | `navigateFallback: '/portfolio/index.html'` | `'/index.html'` |
| `vite.config.ts` | `urlPattern: /\/portfolio\/images\/.*/i` | `/\/images\/.*/i` |
| `src/data/config/app.ts` | `APP_BASENAME = '/portfolio'` | `APP_BASENAME = ''` |
| `.env` | `VITE_BOOK_COVERS_PATH=/portfolio/images/books` | `/images/books` |
| `.env` | `VITE_ILLUSTRATIONS_PATH=/portfolio/images/illustrations` | `/images/illustrations` |
| `.env` | `VITE_UI_IMG_PATH=/portfolio/images/ui` | `/images/ui` |
| `public/404.html` | `/portfolio/index.html?redirect=...` | `/index.html?redirect=...` |
| `scripts/generate-thumbs.cjs` | `APP_BASENAME = '/portfolio'` | `''` |
| `src/components/ui/ProjectCard.tsx` | `/portfolio/images/portfolio/thumbs/...` | `/images/portfolio/thumbs/...` |
| `src/components/ui/ProjectCard.tsx` | `/portfolio/images/portfolio/no-cover.jpg` | `/images/portfolio/no-cover.jpg` |
| `src/components/compositions/MyClients.tsx` | `/portfolio/images/clients` | `/images/clients` |
| `src/pages/Kimo/Admin/EditProjectPage.tsx` | `/portfolio/images/portfolio/...` | `/images/portfolio/...` |
| `src/data/carousel.json` | `/portfolio/images/portfolio/...` | `/images/portfolio/...` |
| `tests/e2e/support/world.ts` | `baseURL: 'http://localhost:5173/portfolio/'` | `'http://localhost:5173/'` |
| `tests/e2e/page-objects/PortfolioShell.ts` | `APP_BASENAME = '/portfolio'` | `''` |
| `tests/e2e/page-objects/KimoContentPages.ts` | `APP_BASENAME = '/portfolio'` | `''` |
| `tests/utils/unit/imagePathHelper.test.ts` | rutas `/portfolio/...` | rutas `/...` |
| `tests/components/unit/books.test.tsx` | `/portfolio/images/portfolio/no-cover.jpg` | `/images/portfolio/no-cover.jpg` |

---

## Como volver a GitHub Pages

Si en algun momento se vuelve a desplegar en GitHub Pages
(`https://kimografico.github.io/portfolio/`), hay que restaurar **todos** los valores
de la tabla anterior. Checklist paso a paso:

### 1. `vite.config.ts`

```ts
base: '/portfolio/',                  // antes: '/'
id: '/portfolio/',                    // antes: '/'
scope: '/portfolio/',                 // antes: '/'
start_url: '/portfolio/',             // antes: '/'
url: '/portfolio/?url=%s',            // antes: '/?url=%s'
navigateFallback: '/portfolio/index.html',  // antes: '/index.html'
urlPattern: /\/portfolio\/images\/.*/i,     // antes: /\/images\/.*/i
```

### 2. `src/data/config/app.ts`

```ts
export const APP_BASENAME = '/portfolio';  // antes: ''
```

Con esto, React Router (`main.tsx`) y los builds de rutas (`${APP_BASENAME}/...`) se
ajustan solos.

### 3. `.env` (variables del frontend)

```
VITE_BOOK_COVERS_PATH=/portfolio/images/books
VITE_ILLUSTRATIONS_PATH=/portfolio/images/illustrations
VITE_UI_IMG_PATH=/portfolio/images/ui
```

### 4. `public/404.html`

```js
'/portfolio/index.html?redirect=' + encodeURIComponent(path + searchParams),
```

### 5. `scripts/generate-thumbs.cjs`

```js
const APP_BASENAME = '/portfolio';  // antes: ''
```

### 6. Rutas hardcodeadas en `src`

- `src/components/ui/ProjectCard.tsx`
  - `/portfolio/images/portfolio/thumbs/${project.id}.jpg`
  - `/portfolio/images/portfolio/no-cover.jpg`
- `src/components/compositions/MyClients.tsx`
  - `CLIENTS_BASE = '/portfolio/images/clients'`
- `src/pages/Kimo/Admin/EditProjectPage.tsx`
  - `/portfolio/images/portfolio/${tipoFolder}/${f.category}/${img.image}`
  - `/portfolio/images/portfolio/${img.image}`

### 7. `src/data/carousel.json`

Prependir `/portfolio` a los 4 `src`:

```
/portfolio/images/portfolio/design/etiquetas/rediseno002.jpg
/portfolio/images/portfolio/design/proyectos-especiales/tirador-de-hidromiel-de-madera001.jpg
/portfolio/images/portfolio/design/proyectos-especiales/baraja-lbg002.jpg
/portfolio/images/portfolio/design/editorial/manual-de-marca001.jpg
```

### 8. Tests E2E

- `tests/e2e/support/world.ts`:
  `baseURL: 'http://localhost:5173/portfolio/'`
- `tests/e2e/page-objects/PortfolioShell.ts`: `APP_BASENAME = '/portfolio'`
- `tests/e2e/page-objects/KimoContentPages.ts`: `APP_BASENAME = '/portfolio'`

### 9. Tests unitarios

- `tests/utils/unit/imagePathHelper.test.ts`: espera rutas `/portfolio/...` como salida
  del helper.
- `tests/components/unit/books.test.tsx`: espera
  `/portfolio/images/portfolio/no-cover.jpg`.

### 10. Verificacion

```sh
pnpm typecheck
pnpm lint
pnpm test
```

---

## Puntos a no olvidar

- **`.github/workflows/deploy.yml`**: no se toca. El workflow sube `dist/` tal cual; el
  path lo define `base` de Vite.
- **SPA fallback**: en GitHub Pages el hack del `404.html` es imprescindible; en un
  hosting propio que soporte SPA (Cloudflare Pages, Netlify) se usa
  `public/_redirects` con `/* /index.html 200` y el `404.html` se puede obviar.
- **`index.html`**: no tiene rutas `/portfolio` hardcodeadas, no requiere cambios en
  ningun escenario.
- **JSON de proyectos** (GD/Dev/Kimo): no guardan el prefijo `/portfolio`, solo nombres
  de archivo o rutas `/images/portfolio/...` sin prefijo. La compatibilidad con JSON
  antiguos la mantiene `imagePathHelper.ts`, que reemplaza `/portfolio/` por `APP_BASENAME`.