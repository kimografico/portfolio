# Kimografico — Frontend: tecnologías, arquitectura y herramientas

---

## Tecnologías principales

| Tecnología         | Versión | Uso                                                                                     |
| ------------------ | ------- | --------------------------------------------------------------------------------------- |
| **React**          | 18.x    | Librería de UI. Componentes funcionales con hooks.                                      |
| **TypeScript**     | 6.x     | Tipado estático en todo el proyecto. Sin `any`. Genéricos en componentes reutilizables. |
| **Vite**           | 8.x     | Bundler y dev server. Hot Module Replacement, lazy imports y build optimizado.          |
| **React Router**   | 6.x     | Enrutamiento SPA con rutas anidadas, rutas dinámicas y lazy loading.                    |
| **Tailwind CSS**   | 3.x     | Framework CSS utility-first. Combinado con archivos CSS externos por componente.        |
| **TanStack Table** | 8.x     | Tablas interactivas con sorting, selección de filas y tipado genérico.                  |
| **jsvectormap**    | 1.x     | Mapa vectorial mundial interactivo para la sección de lugares visitados.                |

### Testing

| Herramienta         | Uso                                                                   |
| ------------------- | --------------------------------------------------------------------- |
| **Vitest**          | 4.x — Test runner compatible con Vite. Tests unitarios e integración. |
| **Testing Library** | Renderizado y consultas de componentes React en tests.                |
| **Playwright**      | 1.x — Motor de navegador para tests E2E.                              |
| **Cucumber.js**     | 12.x — BDD framework para definir escenarios E2E en lenguaje natural. |

### Tooling

| Herramienta      | Uso                                                               |
| ---------------- | ----------------------------------------------------------------- |
| **ESLint**       | 9.x — Linting con reglas de React Hooks, TypeScript y Prettier.   |
| **Prettier**     | 3.x — Formateo automático de código.                              |
| **Storybook**    | 10.x — Catálogo de componentes con addon de accesibilidad (a11y). |
| **Husky**        | Pre-push hooks para ejecutar validación automática.               |
| **lint-staged**  | Ejecuta ESLint y Prettier solo sobre archivos staged.             |
| **pnpm**         | Gestor de paquetes (no npm ni yarn).                              |
| **sharp**        | Generación de thumbnails optimizados.                             |
| **concurrently** | Arranque en paralelo de frontend + backend.                       |

---

## Arquitectura de carpetas

```
src/
├── api/                    # Cliente HTTP para el backend
│   └── apiClient.ts        # Funciones fetch centralizadas (proyectos, kimo, carrusel, etc.)
│
├── components/
│   ├── compositions/       # Componentes complejos reutilizables (tablas, formularios, carrusel)
│   ├── iconos/             # Iconos SVG como componentes React
│   ├── layout/             # Estructura de página (header, footer, layout, auth gate)
│   ├── resume/             # Componentes del editor y visor de currículum
│   ├── stories/            # Stories de Storybook organizadas por categoría
│   └── ui/                 # Componentes atómicos (botones, cards, modales, alertas)
│
├── contexts/
│   └── BackendStatusContext.tsx  # Contexto React para estado de conexión con el backend
│
├── data/                   # Datos estáticos en JSON (importados directamente)
│   ├── config/             # Configuración de la app, catálogo de categorías, helpers de rutas
│   ├── development/        # JSONs de proyectos web (vanilla, wordpress, frameworks)
│   ├── graphic-design/     # JSONs de proyectos de diseño (8 categorías)
│   ├── kimo/               # JSONs del espacio personal (books, illustrations, places)
│   ├── carousel.json       # Imágenes del carrusel de la home
│   ├── clients.json        # Logos de clientes para el carrusel
│   ├── recent-works.json   # Proyectos destacados de la landing
│   └── resume.json         # Datos del currículum
│
├── hooks/                  # Custom hooks reutilizables
├── interfaces/             # Tipos e interfaces TypeScript centralizados
├── pages/                  # Páginas (una por ruta). Organizadas por sección
│   ├── ContactMe/          # Contacto y páginas de CV público
│   ├── Developer/          # Home y detalle de proyectos web
│   ├── GraphicDesign/      # Home y detalle de proyectos de diseño
│   └── Kimo/               # Espacio personal + panel de administración
│       ├── Admin/          # Páginas de administración (data, forms, editor)
│       ├── Books/          # Galería y tabla de libros
│       ├── Ilustraciones/  # Galería y detalle de ilustraciones
│       └── Places/         # Mapa y tabla de lugares
│
├── routes/                 # Factorías de rutas para galerías dinámicas
├── styles/                 # CSS global y por componente
│   └── components/         # CSS extraído de componentes específicos
└── utils/                  # Utilidades puras (auth, slug, helpers del resume)
```

### Carpetas raíz relevantes

```
api/        # Backend Express (ver backend.md)
DOCS/       # Documentación del proyecto
openspec/   # Especificaciones SDD y guías de desarrollo
public/     # Assets estáticos (imágenes, robots.txt, 404.html)
scripts/    # Scripts de mantenimiento (thumbs, checks, clientes)
tests/      # Tests organizados por tipo de entidad y nivel
```

---

## Flujo de datos

El proyecto combina dos estrategias:

1. **Datos estáticos (lectura)**: los archivos JSON en `src/data/` se importan directamente con `import data from './data/file.json'`. Vite los embebe en el bundle en tiempo de build. No necesitan backend.

2. **Datos dinámicos (escritura)**: las operaciones de creación, edición y borrado pasan por el backend (`apiClient.ts` → `localhost:3001`). El backend modifica los mismos JSON de `src/data/`, por lo que Vite detecta el cambio y recarga en desarrollo (HMR).

---

## Sistema de rutas

Las rutas se definen en `App.tsx` con React Router v6:

- **Rutas públicas**: Home, Diseño Gráfico, Desarrollo, Contacto, CV.
- **Rutas Kimo**: protegidas por `KimoAuthGate` (redirige a login si no autenticado).
- **Rutas dinámicas de galerías**: generadas por `GraphicDesignGalleryRoutes` y `DeveloperGalleryRoutes` a partir de arrays de configuración.

Todas las páginas usan `React.lazy()` + `Suspense` para carga diferida.

---

## Herramientas (scripts, utils, helpers)

### Scripts (`scripts/`)

| Script                  | Comando                | Descripción                                                                                                                                                                                                                                                 |
| ----------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **check.js**            | `pnpm check`           | Validación pre-push completa. Ejecuta en cadena: lint → typecheck → tests → E2E → check-images → build. Si falla algún paso, aborta.                                                                                                                        |
| **generate-thumbs.cjs** | `pnpm thumbs`          | Genera miniaturas JPEG (máx. 500px ancho) con sharp. Modos: `--new` (solo faltantes), `--id 023` (proyecto concreto), `--collection illustrations` (para ilustraciones). Salida: `public/images/portfolio/thumbs/` o `public/images/illustrations/thumbs/`. |
| **imagecheck.cjs**      | `pnpm imagecheck`      | Audita imágenes huérfanas. Compara ficheros en `public/images/portfolio/` contra las referencias en los JSON. Flag `--delete` para borrarlas.                                                                                                               |
| **check-images.js**     | (interno de check)     | Valida tamaños de imagen: warning >1 MB, error >2.5 MB. Evita que se suban imágenes excesivamente pesadas.                                                                                                                                                  |
| **refresh-clients.cjs** | `pnpm refresh-clients` | Regenera `src/data/clients.json` a partir de las imágenes en `public/images/clients/`. Preserva el campo `rate` (peso de frecuencia) de entradas existentes.                                                                                                |

### Utilidades frontend (`src/utils/`)

| Archivo                     | Funciones principales                                                                                                                                                       | Descripción                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **kimoAuth.ts**             | `checkKimoPassword()`, `isKimoAuthenticated()`, `setKimoAuthenticated()`, `hashKimoPassword()`, `sanitizeKimoRedirect()`                                                    | Autenticación frontend. Hashea con SHA-256 (Web Crypto API), almacena estado en localStorage. |
| **slugify.ts**              | `slugify()`                                                                                                                                                                 | Convierte texto a slug URL-safe: quita diacríticos, minúsculas, guiones.                      |
| **resumeFactories.ts**      | `createEmptySkill()`, `createEmptySoftware()`, `createEmptyLanguage()`, `createEmptyExperience()`, `createEmptyEducation()`, `createEmptyCourse()`, `createEmptyWorkshop()` | Factorías que crean ítems vacíos con ID único para cada sección del CV.                       |
| **resumeNormalization.ts**  | `normalizeResume()`, `normalizeCategory()`                                                                                                                                  | Normaliza datos del CV al cargar: asegura que todos los ítems tengan ID y categoría válida.   |
| **resumeStateHelpers.ts**   | `updateBasicsField()`, `updateSectionItem()`, `addSectionItem()`, `removeSectionItem()`, `toggleCategory()`, `toggleHide()`                                                 | Helpers inmutables para actualizar el estado anidado del editor de CV.                        |
| **renderMultilineText.tsx** | `renderMultilineText()`                                                                                                                                                     | Convierte texto con `\n` en JSX con `<br />`.                                                 |

### Hooks (`src/hooks/`)

| Hook                  | Descripción                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **useTheme**          | Toggle claro/oscuro con persistencia en localStorage y sincronización entre pestañas.                                            |
| **useCarousel**       | Gestión del carrusel admin: carga desde API, conversión de formatos (API ↔ UI), guardado. Acepta `initialImages` para Storybook. |
| **useProjectDetail**  | Navegación entre proyectos de una categoría (prev/next/back).                                                                    |
| **useModalAnimation** | Fade-in/out de modales con timing configurable.                                                                                  |
| **useShowHidden**     | Toggle de filtro de visibilidad (mostrar/ocultar proyectos ocultos).                                                             |
| **useTableSorting**   | Estado de ordenación de columnas para tablas.                                                                                    |

### Configuración (`src/data/config/`)

| Archivo                        | Descripción                                                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **app.ts**                     | Constantes globales: `APP_BASENAME`, rutas base de imágenes, mapeos categoría→carpeta.                                  |
| **categoryCatalog.ts**         | Catálogo centralizado de todas las categorías (8 de diseño, 3 de desarrollo) con slug, título, icono y etiquetas admin. |
| **imagePathHelper.ts**         | Construcción de rutas de imagen. Maneja compatibilidad con rutas antiguas (`/portfolio/`) y nuevas.                     |
| **developerGalleries.tsx**     | Configuración de galerías de desarrollo: slug, props de `CategoryGalleryPage`, iconos de stack.                         |
| **graphicDesignGalleries.tsx** | Configuración de galerías de diseño: slug, props de `CategoryGalleryPage`, helpers de ruta de imagen.                   |

### Cliente API (`src/api/apiClient.ts`)

Centraliza todas las llamadas HTTP al backend:

- `apiFetch<T>(path, options)` — Wrapper de fetch con manejo de errores y token auth.
- Funciones por dominio: `getProject()`, `createProject()`, `updateProject()`, `uploadImages()`, `createKimoBook()`, `getCarousel()`, `updateCarousel()`, `getRecentWorks()`, `updateRecentWorks()`, `getResume()`, `updateResume()`, etc.
- Base URL: `http://localhost:3001`.
- En caso de error de red, sugiere ejecutar `pnpm backend`.

---

## Estilos

El proyecto combina **Tailwind CSS** (clases utilitarias inline) con **archivos CSS externos** organizados en `src/styles/`:

```
src/styles/
├── variables.css               # Custom properties (colores, tipografía, espaciado)
├── index.css                   # Resets y estilos base globales
├── App.css                     # Estilos de la app shell
├── home.css                    # Estilos de la página de inicio
├── books.css                   # Estilos de la sección de libros
├── resume.css                  # Estilos del CV público
├── resumeForm.css              # Estilos del editor de CV (admin)
├── Developer.css               # Estilos de la sección de desarrollo
├── GraphicDesign.css           # Estilos de la sección de diseño
├── IllustrationDetailPage.css  # Estilos del detalle de ilustración
├── espacio-personal.css        # Estilos del área Kimo
└── components/                 # CSS extraído de componentes específicos
    ├── buttonStyles.css
    ├── table.css
    ├── BookModal.css
    ├── CategoryCard.css
    ├── CategoryHero.css
    ├── ImageLightbox.css
    ├── MainHeader.css
    ├── iconos.css
    ├── projectCarousel.css
    └── ...
```

**Convención**: cuando un componente tiene estilos complejos, se extraen a un archivo CSS con el mismo nombre en `styles/components/`. Los estilos simples se mantienen como clases de Tailwind inline.
