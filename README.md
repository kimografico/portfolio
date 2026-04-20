# Kimográfico — Portfolio

Portfolio personal de Kimo, diseñador gráfico y desarrollador de software.

🌐 **Web actual:** [kimografico.com](https://kimografico.com)
🚧 **Nueva versión:** en desarrollo — [kimografico.github.io/portfolio](https://kimografico.github.io/portfolio)

---

## Secciones

| Ruta | Visibilidad | Descripción |
|---|---|---|
| `/` | Pública | Landing y presentación |
| `/diseno` | Pública | Portfolio de diseño gráfico |
| `/dev` | Pública | Portfolio de desarrollo de software |
| `/cv` | Pública | Curriculum |
| `/contacto` | Pública | Formulario de contacto |
| `/kimo` | Oculta | Espacio personal (no indexado) |
| `/kimo/libros` | Oculta | Libros leídos |
| `/kimo/lugares` | Oculta | Lugares visitados |

> La sección `/kimo` no aparece en ningún menú público y está excluida de la indexación mediante `robots.txt` y meta tags `noindex`.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS |
| Routing | React Router v6 |
| Tablas | TanStack Table v8 |
| Componentes aislados | Storybook 8 |
| Datos | JSON estático en `/data/` |
| Imágenes | `/public/images/` en el repo |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Arrancar en local

```bash
# Clonar el repo
git clone https://github.com/kimografico/portfolio.git
cd portfolio

# Instalar dependencias
cd frontend
npm install

# Servidor de desarrollo
npm run dev

# Storybook (componentes aislados)
npm run storybook
```

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:5173` |
| `npm run build` | Build de producción en `/dist` |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Comprobación de tipos TypeScript |
| `npm run test` | Tests con Vitest |
| `npm run storybook` | Storybook en `localhost:6006` |
| `npm run build-storybook` | Build estático de Storybook |

---

## Gestión del contenido

El contenido de la web se gestiona editando los archivos JSON en `/data/`. No hay base de datos ni CMS externo.

| Archivo | Contenido |
|---|---|
| `data/portfolio-diseno.json` | Proyectos de diseño gráfico |
| `data/portfolio-dev.json` | Proyectos de desarrollo |
| `data/libros.json` | Libros leídos |
| `data/lugares.json` | Lugares visitados |

Para actualizar la web: edita el JSON correspondiente → commit → push a `main` → el pipeline hace el deploy automáticamente.

### Límite de imágenes

El pipeline comprueba el tamaño de las imágenes en cada PR:

- ⚠️ **Aviso** por encima de **700 KB** (el pipeline no se detiene)
- ❌ **Bloqueado** por encima de **1000 KB** (el pipeline falla)

Las imágenes van en `frontend/public/images/`, organizadas por sección:

```
public/images/
├── diseno/      # Portfolio de diseño
├── dev/         # Portfolio de desarrollo
└── personal/    # Libros y viajes
```

---

## Arquitectura de componentes

Los componentes siguen la nomenclatura de BBVA:

| Capa | Carpeta | Contenido |
|---|---|---|
| Basics | `components/basics/` | Átomos sin lógica de negocio: Badge, Button, NavLink... |
| Combinations | `components/combinations/` | Combinaciones de basics: LibroCard, ProyectoCard... |
| Compositions | `components/compositions/` | Organismos completos: LibrosTabla, LibrosGaleria... |
| Layout | `components/layout/` | Header, Footer, Layout, LayoutPersonal |

Cada componente en `basics/`, `combinations/` y `compositions/` tiene su archivo `.stories.tsx` al lado para poder probarlo de forma aislada en Storybook.

> **Decisión técnica:** los componentes de `basics/` y `combinations/` están implementados en TSX. Una vez estabilizado el proyecto, se valorará migrarlos a Lit (Web Components) para alinear con el stack de BBVA.

---

## CI/CD

Dos pipelines en `.github/workflows/`:

**`ci.yml`** — se ejecuta en cada Pull Request:
```
lint → typecheck → tests → check imágenes → build
```

**`deploy.yml`** — se ejecuta en cada push a `main`:
```
build → deploy a GitHub Pages
```

---

## Fases de desarrollo

- ✅ **Fase 0** — Definición del proyecto (`spec.md`)
- 🔄 **Fase 1** — Arquitectura base + sección personal (libros y lugares)
- ⬜ **Fase 2** — Portfolio de diseño gráfico
- ⬜ **Fase 3** — Portfolio de desarrollo
- ⬜ **Fase 4** — Home, CV y contacto
- ⬜ **Fase 5** — Pulido, animaciones, mapa, formulario real, migración de dominio
- ⬜ **Fase 6** — Migración a Lit (opcional)

Para el detalle completo de cada fase, ver [`spec.md`](./spec.md).

---

## Dominio

Durante el desarrollo, la nueva web convive en `kimografico.github.io/portfolio` mientras la web actual sigue activa en `kimografico.com`. La migración del dominio se realizará al completar la Fase 5.

---

*Proyecto en desarrollo activo — documentación en [`spec.md`](./spec.md)*
