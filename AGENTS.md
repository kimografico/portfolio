# Portfolio - Guia del Proyecto

Portfolio personal de "Kimo" (kimografico), disenador grafico y desarrollador web. Monorepo con frontend React y backend Express, desplegado en GitHub Pages.

## Comandos Esenciales

| Comando | Uso |
|---------|-----|
| `pnpm dev` | Servidor de desarrollo Vite |
| `pnpm build` | Build de produccion (tsc + vite) |
| `pnpm start` | Frontend + Backend simultaneamente |
| `pnpm backend` | Solo backend con nodemon |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Verificacion de tipos |
| `pnpm test` | Vitest (unit tests) |
| `pnpm test:watch` | Vitest en watch mode |
| `pnpm test:e2e` | Cucumber E2E (headless Playwright) |

## Estructura del Proyecto

```
portfolio/
├── api/                        # Backend Express (CommonJS .cjs)
│   ├── server.cjs              # Entry point, Express + CORS + rutas
│   ├── routes/                 # projects, upload, recent-works, resume, kimo, carousel
│   ├── controllers/            # Logica de negocio por recurso
│   ├── utils/
│   │   ├── fileSystem.cjs      # Lectura/escritura de proyectos (IDs numericos)
│   │   ├── kimoStore.cjs       # Lectura/escritura de colecciones Kimo (IDs string)
│   │   └── validation.cjs      # Validaciones de entrada
│   └── middleware/
│       ├── errorHandler.cjs    # Manejo centralizado de errores
│       └── kimoAuth.cjs        # Auth Bearer token (SHA-256 hash)
├── src/                        # Frontend React (ESM)
│   ├── App.tsx                 # Definicion de rutas (lazy-loaded)
│   ├── main.tsx                # Bootstrap: StrictMode + BrowserRouter
│   ├── api/apiClient.ts        # Cliente API frontend (fetch + auth)
│   ├── components/
│   │   ├── layout/             # MainLayout, MainHeader, MainFooter, HeroSection, KimoAuthGate
│   │   ├── ui/                 # UIButton, ProjectCard, CategoryCard, ImageLightbox, etc.
│   │   ├── compositions/       # CategoryHomeTemplate, ProjectDetailPage, BaseTable, BookModal, etc.
│   │   ├── iconos/             # 70+ iconos SVG customizados
│   │   └── resume/             # Componentes de edicion de CV
│   ├── pages/                  # Paginas por ruta
│   ├── routes/                 # Config de rutas de galeria (GD + Dev)
│   ├── data/                   # JSONs estaticos + configuracion
│   │   ├── config/             # app.ts, categoryCatalog, galleries, imagePathHelper
│   │   ├── graphic-design/     # 8 categorias GD
│   │   ├── development/        # 3 categorias Dev
│   │   └── kimo/               # books, illustrations, places, places_markers
│   ├── interfaces/             # Tipos TypeScript (15 archivos)
│   ├── hooks/                  # useTheme, useCarousel, useProjectDetail, etc.
│   ├── contexts/               # BackendStatusContext (polling /health)
│   ├── utils/                  # slugify, kimoAuth, resume helpers
│   └── styles/                 # CSS + variables.css (temas light/dark)
├── tests/                      # Vitest + Cucumber E2E
├── scripts/                    # generate-thumbs, imagecheck, etc.
└── public/                     # Assets estaticos, imagenes, PWA manifest
```

## Enrutamiento (App.tsx)

Todas las rutas lazy-loaded con React.lazy + Suspense. Basename dinámico: `APP_BASENAME` derivado del `base` de Vite ('' en dominio raíz, `/portfolio` en GitHub Pages).

| Ruta | Pagina | Descripcion |
|------|--------|-------------|
| `/` | Home | Hero, carrusel, proyectos recientes, clientes |
| `/graphic-design` | GraphicDesignHome | Grid de categorias GD |
| `/graphic-design/*` | GraphicDesignGalleryRoutes | Galerias dinamicas por categoria |
| `/graphic-design/:category/:id` | GraphicDesignProjectDetail | Detalle de proyecto GD |
| `/dev` | DeveloperHome | Grid de categorias Dev |
| `/dev/*` | DeveloperGalleryRoutes | Galerias dinamicas por categoria |
| `/dev/:parent/:id` | DeveloperProjectDetail | Detalle de proyecto Dev |
| `/contacto` | ContactMe | Tarjetas de contacto |
| `/resume/design` | ResumeDesignPage | CV de diseno |
| `/resume/development` | ResumeDevPage | CV de desarrollo |
| `/kimo/login` | LoginPage | Login admin (SHA-256) |
| `/kimo` | KimoLayout | Area personal (protegida por KimoAuthGate) |
| `/kimo/books` | BooksPage | Biblioteca (tabla + galeria) |
| `/kimo/places` | PlacesPage | Diario de viajes + mapa |
| `/kimo/ilustraciones` | IllustrationsPage | Galeria de ilustraciones |
| `/kimo/iconos` | IconGallery | Galeria de iconos SVG |
| `/kimo/data` | DataPage | Admin: tabla de todos los proyectos |
| `/kimo/add-project` | AddProjectPage | Crear proyecto |
| `/kimo/add-book` | AddBookPage | Crear libro |
| `/kimo/add-illustration` | AddIllustrationPage | Crear ilustracion |
| `/kimo/add-place` | AddPlacePage | Crear lugar |
| `/kimo/edit-project/:id` | EditProjectPage | Editar proyecto |
| `/kimo/recent-works` | RecentWorksManagerPage | Gestionar obras recientes |
| `/kimo/resume` | ResumeManagerPage | Editar CV |
| `*` | NotFoundPage | 404 |

**Proteccion**: Todas las rutas `/kimo/*` (excepto `/kimo/login`) requieren autenticacion via `KimoAuthGate`.

## Backend API

Servidor Express en `localhost:3001`. Sin base de datos, JSON files como store.

### Endpoints

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/api/projects` | No | Listar proyectos (filtros: type, category, visible) |
| GET | `/api/projects/:id` | No | Obtener proyecto por ID |
| POST | `/api/projects` | Si | Crear proyecto (genera thumbnails async) |
| PUT | `/api/projects/:id` | Si | Actualizar proyecto |
| DELETE | `/api/projects/:id` | Si | Eliminar proyecto |
| PATCH | `/api/projects/visibility` | Si | Cambiar visibilidad en lote |
| GET | `/api/categories` | No | Listar categorias |
| POST | `/api/upload` | Si | Subir imagenes (multipart, max 20, 10MB c/u) |
| GET/PUT | `/api/recent-works` | No/Si | CRUD obras recientes |
| GET/PUT | `/api/resume` | No/Si | CRUD CV |
| GET/PUT | `/api/carousel` | No/No | CRUD carrusel (PUT sin auth!) |
| POST | `/api/kimo/upload` | Si | Subir imagenes Kimo (books/illustrations) |
| POST | `/api/kimo/books` | Si | Crear libro |
| POST | `/api/kimo/illustrations` | Si | Crear ilustracion |
| POST | `/api/kimo/places` | Si | Crear lugar |
| POST | `/api/kimo/places-markers` | Si | Crear marcador de mapa |
| GET | `/health` | No | Health check |

### Patrones del Backend

- **CommonJS** (.cjs): El backend usa `require()` porque `package.json` raiz tiene `"type": "module"`
- **Sincronico**: Todas las operaciones de archivo son `readFileSync`/`writeFileSync`
- **Escritura completa**: Cada update reescribe el JSON completo con `JSON.stringify(data, null, 2)`
- **IDs numericos** (proyectos): Generados con `getMaxIdGlobally() + 1` para evitar colisiones entre categorias
- **IDs string** (Kimo): Slugs (`slugify()`) o prefijo secuencial (`place-007`, `marker-001`)
- **Thumbnails**: Generados como child process detach (`scripts/generate-thumbs.cjs`) tras crear/actualizar proyecto
- **Auth**: Bearer token con SHA-256 hash, configurado via `KIMO_PASSWORD_HASH` en `.env`
- **CORS**: Permite `localhost:5173`, `localhost:3000`, `127.0.0.1:5173`, `127.0.0.1:3000`

## Datos (JSONs)

### Proyectos GD (`src/data/graphic-design/`)

8 archivos: `carteleria.json`, `editorial.json`, `etiquetas.json`, `logotipos.json`, `multimedia.json`, `packaging.json`, `papeleria.json`, `proyectos-especiales.json`

```json
{ "id": 214, "date": "2020-12-31 10:36", "title": "...", "cliente": "...",
  "descripcion": "...", "imagenes": [{ "image": "file.jpg", "label": "" }],
  "videos": [], "extras": [], "visible": true }
```

### Proyectos Dev (`src/data/development/`)

3 archivos: `vanilla.json`, `wordpress.json`, `frameworks.json`

Mismo schema que GD mas `"stack": ["HTML", "CSS", "JS"]`

### Kimo (`src/data/kimo/`)

| Archivo | Schema |
|---------|--------|
| `books.json` | `{ id, title, author, language, cover, dateRead, genre, isbn, series, synopsis }` |
| `illustrations.json` | `{ id, nombre, image, fecha, cliente, descripcion, imagenesExtra: [{ image, label }] }` |
| `places.json` | `{ city, place, country, date, people }` |
| `places_markers.json` | `{ name, country, lat, lon }` |

### Otros JSONs

| Archivo | Contenido |
|---------|-----------|
| `resume.json` | CV completo (basics, skills, experience, education) |
| `recent-works.json` | Obras recientes para landing `[{ num, title, tipo, year, category, href }]` |
| `carousel.json` | Imagenes del carrusel `[{ src, alt }]` |
| `clients.json` | Logos de clientes `[{ name, rate }]` (sin endpoint API) |

## Frontend - Arquitectura

### Componentes Clave

| Componente | Ubicacion | Funcion |
|------------|-----------|---------|
| `CategoryHomeTemplate` | compositions/ | Template generico para home de categorias (GD + Dev) |
| `CategoryGalleryPage<T>` | layout/ | Galeria generica con hero + grid de ProjectCards |
| `ProjectDetailPage` | compositions/ | Detalle con galeria de imagenes, lightbox, nav prev/next |
| `BaseTable` | compositions/ | Tabla generica con TanStack Table (sorting, empty state) |
| `UIButton` | ui/ | Boton poliformo (renderiza `<a>` o `<button>`) |
| `ProjectCard` | ui/ | Tarjeta de proyecto para galerias |
| `ImageLightbox` | ui/ | Lightbox fullscreen con focus trap |
| `KimoAuthGate` | layout/ | Guard de autenticacion para rutas /kimo |
| `HeroSection` | layout/ | Hero reutilizable con texto animado rotativo |
| `BookModal` | compositions/ | Modal de detalle de libro |
| `BooksFilter` | compositions/ | Filtros de biblioteca |
| `DataActionBar` | compositions/ | Barra de acciones en lote (admin) |

### Config-driven Galerias

Las rutas de galeria se generan desde config, no manualmente:

- `src/data/config/graphicDesignGalleries.tsx` - 8 categorias GD
- `src/data/config/developerGalleries.tsx` - 3 categorias Dev
- `src/data/config/categoryCatalog.ts` - Catalogo maestro de categorias

Para agregar una categoria: agregar entrada en `categoryCatalog.ts` + archivo JSON + entrada en el config de galeria correspondiente.

### Interfaces Principales

| Interface | Archivo | Campos clave |
|-----------|---------|--------------|
| `BaseProject` | project.ts | id, date, title, cliente, thumb, imagenes, stack |
| `WebProject` | developer.ts | Extiende BaseProject: descripcion, videos, extras, stack |
| `GraphicDesignProject` | graphicDesign.ts | Extiende BaseProject: descripcion, imagenes, videos, extras |
| `Book` | book.ts | id, title, author, language, cover, dateRead, genre, isbn, series, synopsis |
| `Illustration` | illustration.ts | id, nombre, image, fecha, cliente, descripcion, imagenesExtra |
| `Place` | place.ts | country, city, place, date, people |
| `ResumeData` | resume.ts | basics, skills, software, languages, experience, education |

### Hooks

| Hook | Funcion |
|------|---------|
| `useTheme()` | Toggle light/dark con localStorage + listener cross-component |
| `useCarousel()` | CRUD de imagenes del carrusel via API |
| `useProjectDetail()` | Navegacion prev/next entre proyectos |
| `useShowHidden()` | Toggle para mostrar proyectos ocultos en galerias |
| `useModalAnimation()` | Lifecycle de modal: animaciones, focus trap, escape, scroll lock |
| `useTableSorting()` | Estado de sorting para TanStack Table |

### Estilos

- **Hybrid approach**: Tailwind CSS (utility classes inline) + CSS custom properties + CSS archivos por pagina/componente
- **Temas**: `variables.css` con `data-theme="dark"` selector. Colores via CSS vars: `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-accent`
- **Fuentes**: DM Sans (sans), JetBrains Mono (mono)
- **Animaciones**: `fade-up` (translateY + opacity)

### API Client (`src/api/apiClient.ts`)

Wrapper de `fetch` con:
- JSON content-type automatico
- Bearer token si autenticado
- Manejo de errores con mensajes en espanol
- Deteccion de red offline

Funciones: `getProject`, `createProject`, `updateProject`, `updateVisibilityBatch`, `deleteProjectsBatch`, `uploadImages`, `uploadKimoImages`, `createKimoBook`, `createKimoIllustration`, `createKimoPlace`, `createKimoPlaceMarker`, `getResume`, `updateResume`, `getCarousel`, `updateCarousel`, `getRecentWorks`, `updateRecentWorks`

### Utilidades

| Archivo | Funciones |
|---------|-----------|
| `slugify.ts` | `slugify(text)` - texto a slug URL-safe |
| `kimoAuth.ts` | `hashKimoPassword()`, `checkKimoPassword()`, `isKimoAuthenticated()`, `setKimoAuthenticated()` |
| `renderMultilineText.tsx` | Convierte `\n` a `<br />` JSX |
| `resumeFactories.ts` | Funciones factory para crear entradas vacias de CV |
| `resumeNormalization.ts` | Normaliza datos de CV (IDs, categorias, defaults) |
| `resumeStateHelpers.ts` | Helpers inmutables para estado del editor de CV |

## Convenciones de Codigo

- **data-id**: Todo elemento interactivo/significativo tiene atributo `data-id` para testing
- **TypeScript estricto**: `no-explicit-any: error`, `noUnusedLocals/Parameters`
- **Prettier**: Single quotes, semicolons, trailing commas, 100 chars width
- **Lazy loading**: Todas las paginas con `React.lazy()` para code splitting
- **Spanish**: UI y comentarios en espanol, `lang="es"` en HTML
- **PWA**: Service worker configurado via vite-plugin-pwa
- **Testing**: Vitest para unit tests, Cucumber + Playwright para E2E, Storybook para componentes

## Configuracion

### Variables de Entorno

**Frontend** (`.env` en raiz):
- `VITE_BOOK_COVERS_PATH` - Ruta base para portadas de libros
- `VITE_KIMO_PASSWORD_HASH` - Hash SHA-256 para auth

**Backend** (`api/.env`):
- `PORT` (default: 3001)
- `NODE_ENV` (development/production)
- `DATA_DIR` (default: src/data)
- `KIMO_PASSWORD_HASH` - Hash SHA-256 para auth

### Despliegue

- **Dominio raíz (actual)**: `base: '/'`, PWA paths en raíz, `404.html` a `/index.html`. Switch a GitHub Pages: solo `vite.config.ts` (base + PWA) + `404.html` + baseURL tests E2E. Ver `DOCS/DEPLOY-DOMINIO-RAIZ.md`.
- **SPA fallback**: `404.html` con redirect hack en `index.html`
- **Build**: `tsc -b && vite build`
- **Thumbnails**: Generados via Sharp (`scripts/generate-thumbs.cjs`)

## Ordenacion de Libros

En `BooksGallery.tsx` y `BooksTable.tsx`, los libros se ordenan por `dateRead` descendente (mas nuevo primero). A igualdad de fecha, se usan indices para invertir el orden del JSON (aparecen primero los ultimos del JSON). Esto es intencional: como el JSON esta en orden cronologico y la vista es descendente, la secundaria tambien debe ser inversa.
