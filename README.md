# Portfolio — kimografico

Portfolio personal de diseño gráfico y desarrollo web. Una aplicación React con TypeScript que engloba dos secciones públicas (Diseño Gráfico y Desarrollo Web) y un espacio personal privado con herramientas de gestión de contenido.

---

## Índice

1. [El proyecto](#1-el-proyecto)
2. [Stack técnico](#2-stack-técnico)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Rutas de la aplicación](#4-rutas-de-la-aplicación)
5. [Estructura de datos: JSONs e imágenes](#5-estructura-de-datos-jsons-e-imágenes)
6. [Sección pública: Diseño Gráfico](#6-sección-pública-diseño-gráfico)
7. [Sección pública: Desarrollo Web](#7-sección-pública-desarrollo-web)
8. [Mi espacio personal (`/kimo`)](#8-mi-espacio-personal-kimo)
9. [Backend API REST](#9-backend-api-rest)
10. [Scripts disponibles](#10-scripts-disponibles)
11. [Variables de entorno](#11-variables-de-entorno)
12. [Primeros pasos tras clonar](#12-primeros-pasos-tras-clonar)
13. [Convenciones y arquitectura](#13-convenciones-y-arquitectura)

---

## 1. El proyecto

**kimografico** es un portfolio personal construido como SPA (Single Page Application) con React 18 + TypeScript + Vite. Está pensado para mostrar trabajos de diseño gráfico y desarrollo web de forma pública, y al mismo tiempo sirve como herramienta de gestión de contenido en la sección privada `/kimo`.

El proyecto integra un **backend Express ligero** (en el mismo repositorio) que expone una API REST para crear y editar proyectos directamente desde el espacio personal, sin tocar los archivos JSON a mano.

---

## 2. Stack técnico

### Frontend

| Herramienta              | Versión | Uso                               |
| ------------------------ | ------- | --------------------------------- |
| React                    | 18+     | UI, componentes, lógica de vistas |
| TypeScript               | ~6.0    | Tipado estático                   |
| Vite                     | 8       | Bundler, servidor de desarrollo   |
| React Router             | 6       | Navegación SPA                    |
| TanStack Table           | 8       | Tablas ordenables y filtrables    |
| Tailwind CSS             | 3       | Utilidades CSS                    |
| jsvectormap              | 1.7     | Mapa vectorial interactivo        |
| Vitest + Testing Library | 4       | Tests unitarios y de integración  |

### Backend

| Herramienta  | Versión | Uso                                     |
| ------------ | ------- | --------------------------------------- |
| Node.js      | ≥18     | Runtime del servidor                    |
| Express      | 4       | Framework HTTP                          |
| cors         | 2.8     | Cabeceras CORS para Vite local          |
| dotenv       | 16      | Variables de entorno                    |
| nodemon      | 3       | Recarga automática en desarrollo        |
| concurrently | 8       | Arrancar frontend y backend en paralelo |

### Herramientas de calidad

- **ESLint** (con plugins para React, React Hooks y React Refresh)
- **Prettier** para formato de código
- **Husky + lint-staged** para validación en pre-commit
- **TypeScript** en modo estricto

---

## 3. Estructura de carpetas

```
portfolio/
├── api/                        # Backend Express (CommonJS .cjs)
│   ├── server.cjs              # Punto de entrada del servidor
│   ├── routes/
│   │   └── projects.cjs        # Todas las rutas /api/projects
│   ├── controllers/
│   │   └── projectController.cjs
│   ├── utils/
│   │   ├── fileSystem.cjs      # Lectura/escritura de JSONs
│   │   └── validation.cjs      # Validación de campos
│   ├── middleware/
│   │   └── errorHandler.cjs    # Manejo centralizado de errores
│   ├── .env.example            # Plantilla de variables de entorno
│   └── spec.md                 # Especificación completa de la API
│
├── public/
│   ├── images/
│   │   ├── books/              # Portadas de libros (JPG, nombre = id del libro)
│   │   ├── illustrations/      # Imágenes de ilustraciones
│   │   └── ui/                 # Imágenes de interfaz (mapas, fondos...)
│   └── robots.txt
│
├── src/
│   ├── api/
│   │   └── apiClient.ts        # Cliente fetch para la API backend
│   ├── assets/
│   │   └── images/books/       # Fallback de portadas en build
│   ├── components/
│   │   ├── combinations/       # Componentes que combinan otros (BookModal, WorldMap...)
│   │   ├── compositions/       # Composiciones complejas (BaseTable)
│   │   ├── iconos/             # ~50 iconos SVG como componentes React
│   │   ├── layout/             # Header, Footer, HeroSection, MainLayout...
│   │   └── ui/                 # CategoryCard, CategoryHero, ProjectLine...
│   ├── config/
│   │   ├── graphicDesignGalleries.ts   # Config de galerías de diseño gráfico
│   │   └── developerGalleries.ts       # Config de galerías de desarrollo
│   ├── data/
│   │   ├── books.json          # Libros leídos
│   │   ├── places.json         # Lugares visitados
│   │   ├── places_markers.json # Coordenadas de marcadores del mapa
│   │   ├── illustrations.json  # Ilustraciones personales
│   │   ├── recent-works.json   # Proyectos destacados para la landing
│   │   ├── graphic-design/     # 8 JSONs de categorías de diseño gráfico
│   │   └── development/        # 3 JSONs de categorías de desarrollo
│   ├── hooks/
│   │   ├── useTableSorting.ts  # Hook reutilizable para ordenación de tablas
│   │   └── useShowHidden.ts    # Toggle "mostrar ocultos" persistido en localStorage
│   ├── interfaces/             # Tipos e interfaces TypeScript centralizados
│   ├── pages/
│   │   ├── Home/               # Landing principal
│   │   ├── GraphicDesign/      # Home + detalle de proyectos de diseño
│   │   ├── Developer/          # Home + detalle de proyectos web
│   │   ├── ContactMe/          # Página de contacto
│   │   ├── Kimo/               # Espacio personal (privado)
│   │   └── NotFoundPage.tsx    # Página 404
│   ├── styles/                 # CSS global: buttonStyles.css, table.css
│   └── types/                  # Tipos auxiliares (icons.ts, places.ts...)
│
├── tests/                      # Tests con Vitest
├── scripts/
│   └── check.js                # Script de pre-push (lint + typecheck + test + build)
├── .env                        # Variables de entorno del frontend (no versionado)
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── vitest.config.ts
```

---

## 4. Rutas de la aplicación

| Ruta                             | Componente                   | Descripción                                        |
| -------------------------------- | ---------------------------- | -------------------------------------------------- |
| `/`                              | `Home`                       | Landing con hero, proyectos recientes y "sobre mí" |
| `/graphic-design`                | `GraphicDesignHome`          | Categorías de diseño gráfico                       |
| `/graphic-design/:categoria`     | `CategoryGalleryPage`        | Galería de una categoría                           |
| `/graphic-design/:categoria/:id` | `GraphicDesignProjectDetail` | Detalle de un proyecto                             |
| `/dev`                           | `DeveloperHome`              | Categorías de desarrollo web                       |
| `/dev/:categoria`                | `CategoryGalleryPage`        | Galería de una categoría                           |
| `/dev/:categoria/:id`            | `DeveloperProjectDetail`     | Detalle de un proyecto                             |
| `/contacto`                      | `ContactMe`                  | Formulario y datos de contacto                     |
| `/kimo`                          | `KimoLayout`                 | Espacio personal (layout con subnav)               |
| `/kimo/books`                    | `BooksPage`                  | Historial de lectura (tabla + galería)             |
| `/kimo/places`                   | `PlacesPage`                 | Mapa + tabla de lugares visitados                  |
| `/kimo/ilustraciones`            | `IllustrationsPage`          | Galería de ilustraciones personales                |
| `/kimo/ilustraciones/:id`        | `IllustrationDetailPage`     | Detalle de una ilustración                         |
| `/kimo/iconos`                   | `IconGallery`                | Galería de todos los iconos del proyecto           |
| `/kimo/data`                     | `DataPage`                   | Tabla de gestión de todos los proyectos            |
| `/kimo/add-project`              | `AddProjectPage`             | Formulario para crear un nuevo proyecto            |

---

## 5. Estructura de datos: JSONs e imágenes

Todos los datos del portfolio se almacenan en archivos JSON dentro de `src/data/`. No hay base de datos: los JSONs **son** la base de datos.

### `recent-works.json`

Lista de proyectos destacados que aparecen en la landing:

```json
{
  "num": "01",
  "title": "Montanejos",
  "tipo": "Logotipo",
  "year": "2024",
  "category": "GraphicDesign",
  "href": "/portfolio/graphic-design/montanejos"
}
```

### `graphic-design/*.json` y `development/*.json`

Cada categoría tiene su propio JSON. Todos siguen el mismo esquema:

```json
{
  "id": 3800,
  "date": "2020-12-31 10:36",
  "title": "Rótulo Peluquería",
  "cliente": "Sort Estilistas",
  "descripcion": "...",
  "imagenes": [{ "ruta": "https://...", "label": "" }],
  "videos": [],
  "extras": [],
  "visible": true,
  "stack": [] // solo en development/
}
```

El campo **`visible`** controla si el proyecto aparece en las galerías públicas. Los proyectos con `visible: false` se pueden ver en el espacio personal pero no en las rutas públicas.

Los proyectos de desarrollo añaden **`stack`**: un array de strings con las tecnologías usadas (`["React", "TypeScript", "Vite"]`).

### Categorías disponibles

**Diseño Gráfico** (`src/data/graphic-design/`):

- `carteleria.json` — Posters, flyers, material promocional
- `editorial.json` — Revistas, publicaciones, libros
- `etiquetas.json` — Etiquetas y pegatinas
- `logotipos.json` — Branding e identidad visual
- `multimedia.json` — Digital, vídeo y presentaciones
- `packaging.json` — Envases y diseño de producto
- `papeleria.json` — Material corporativo
- `proyectos-especiales.json` — Proyectos singulares

**Desarrollo Web** (`src/data/development/`):

- `vanilla.json` — HTML, CSS y JavaScript puro
- `wordpress.json` — Proyectos con CMS WordPress
- `frameworks.json` — React, Vue y otros frameworks

### `books.json`

```json
{
  "id": "juego-de-tronos",
  "title": "Juego de tronos",
  "author": "George R. R. Martin",
  "language": "Español",
  "cover": "juego-de-tronos.jpg",
  "dateRead": "2024-03",
  "genre": "Fantasía",
  "isbn": "9788466637619",
  "series": "Canción de hielo y fuego",
  "synopsis": "..."
}
```

Las portadas se guardan en `public/images/books/<id>.jpg`. Si la portada no existe o el campo `cover` está vacío, se muestra un fallback `_blank.jpg`.

### `places.json`

```json
{
  "city": "Aragón",
  "place": "Gea de Albarracín",
  "country": "es",
  "date": "2005",
  "people": ""
}
```

### `illustrations.json`

```json
{
  "id": "004",
  "nombre": "Caballo Equilibrium PTS",
  "ilustracion": "caballo-eq-001.png",
  "fecha": "08/2017",
  "cliente": "Equilibrium Personal Training Studio",
  "descripcion": "...",
  "imagenesExtra": [{ "ruta": "caballo-eq-002.jpg", "label": "Mockup..." }]
}
```

Las imágenes de ilustraciones se sirven desde `public/images/illustrations/`.

---

## 6. Sección pública: Diseño Gráfico

Accesible desde `/graphic-design`. Organizada en 8 categorías:

- **Entrada**: `GraphicDesignHome` muestra categorías como tarjetas con icono, título y descripción.
- **Galería de categoría**: `CategoryGalleryPage` renderiza los proyectos de un JSON filtrando por `visible: true`.
- **Detalle**: `GraphicDesignProjectDetail` muestra título, cliente, descripción, galería de imágenes y vídeos.

Las galerías están configuradas dinámicamente en `src/config/graphicDesignGalleries.ts`, lo que permite añadir nuevas categorías sin tocar `App.tsx`.

---

## 7. Sección pública: Desarrollo Web

Accesible desde `/dev`. Organizada en 3 categorías (WordPress, Vanilla JS, Frameworks):

- Misma arquitectura que Diseño Gráfico.
- El detalle de proyecto mostrará adicionalmente el **stack tecnológico** si está definido en el JSON.
- Configuración dinámica en `src/config/developerGalleries.ts`.

---

## 8. Mi espacio personal (`/kimo`)

Sección privada accesible en `/kimo`. Incluye un layout propio (`KimoLayout`) con navegación interna. No tiene autenticación (es de uso personal en local o en red privada).

### `/kimo/books` — Historial de lectura

Muestra la colección de libros leídos con dos vistas intercambiables:

- **Galería**: Grid de portadas ordenadas por fecha de lectura (más reciente primero). Al hacer clic en una portada se abre un **modal** con la ficha completa del libro: portada grande, título, autor, fecha formateada en español, idioma (con bandera emoji), serie, género y sinopsis.
- **Tabla**: Vista tabular con TanStack Table, columnas ordenables (título, autor, fecha, idioma, género).

### `/kimo/places` — Lugares visitados

Dos componentes en la misma página:

- **Mapa vectorial interactivo**: Renderizado con `jsvectormap`. Colorea los países visitados y muestra marcadores en puntos específicos extraídos de `places_markers.json`.
- **Tabla de lugares**: Columnas de ciudad, lugar (en negrita), país (con bandera emoji), fecha y acompañantes. Ordenable por cualquier columna, ordenada por defecto por fecha descendente.

### `/kimo/ilustraciones` — Galería de ilustraciones

- **Galería**: Grid de ilustraciones propias. Al hacer clic navega al detalle.
- **Detalle** (`/kimo/ilustraciones/:id`): Muestra la ilustración principal, descripción, cliente, fecha e imágenes adicionales.

### `/kimo/iconos` — Galería de iconos

Muestra todos los componentes SVG del proyecto (más de 50 iconos) en un grid visual. Útil como referencia durante el desarrollo para ver todos los iconos disponibles, sus nombres y aspecto.

### `/kimo/data` — Gestión de proyectos

Tabla central con **todos los proyectos** de los 11 JSONs (8 de diseño + 3 de desarrollo). Permite:

- **Filtrar** por tipo, categoría, cliente y visibilidad.
- **Ordenar** por cualquier columna.
- **Seleccionar filas** individualmente o con "seleccionar todo".
- **Cambiar visibilidad en lote**: botones "Marcar como oculto" / "Marcar como visible" que llaman a la API backend y actualizan la UI de forma inmediata (sin recargar).
- Ver **proyectos duplicados** (IDs repetidos) destacados en el filtro.
- Toggle para ver proyectos ocultos o solo los visibles.

> Esta sección requiere el backend arrancado para las operaciones de escritura.

### `/kimo/add-project` — Añadir proyecto

Formulario completo para crear un nuevo proyecto sin editar JSON a mano:

- Selector de **tipo** (Diseño Gráfico / Desarrollo) y **categoría** (se actualiza dinámicamente).
- Campos: título, cliente, descripción, visibilidad.
- **Imágenes**: lista dinámica de pares `ruta + label`, con botones para añadir/eliminar.
- **Vídeos** y **extras**: listas dinámicas de URLs.
- **Stack tecnológico** (solo para proyectos de desarrollo): botones de selección rápida (HTML, CSS, JavaScript, TypeScript, React, Vue, WordPress, PHP, Node.js, Vite, Prestashop) más entrada manual.
- Al enviar, hace `POST /api/projects` y muestra el ID generado automáticamente.

> Esta sección requiere el backend arrancado.

---

## 9. Backend API REST

El backend es un servidor **Express.js** escrito en CommonJS (`.cjs`) que convive en el mismo repositorio. Se ejecuta en el puerto **3001** y expone una API REST para gestionar los archivos JSON de proyectos.

> **¿Por qué `.cjs`?** El `package.json` del proyecto tiene `"type": "module"`, lo que hace que Node.js interprete los `.js` como ESM. Para el backend se eligió CommonJS (más simple para I/O síncrono con `require`/`module.exports`). Renombrando los archivos a `.cjs` se fuerza a Node.js a tratarlos como CommonJS independientemente del `package.json`.

### Arquitectura del backend

```
api/
├── server.cjs              # Express app + middleware + rutas
├── routes/
│   └── projects.cjs        # Definición de endpoints
├── controllers/
│   └── projectController.cjs  # Lógica de negocio
├── utils/
│   ├── fileSystem.cjs      # Lectura y escritura de JSONs
│   └── validation.cjs      # Validación de campos
└── middleware/
    └── errorHandler.cjs    # Manejo de errores centralizado
```

**Flujo de una petición:**
`routes` → `controller` → `utils/fileSystem` (lee/escribe JSON en disco) → responde JSON al frontend.

### Endpoints disponibles

| Método   | Ruta                       | Descripción                              |
| -------- | -------------------------- | ---------------------------------------- |
| `GET`    | `/health`                  | Estado del servidor                      |
| `GET`    | `/api/categories`          | Lista de todas las categorías            |
| `GET`    | `/api/projects`            | Todos los proyectos (filtros opcionales) |
| `GET`    | `/api/projects/:id`        | Un proyecto por ID                       |
| `POST`   | `/api/projects`            | Crear nuevo proyecto                     |
| `PUT`    | `/api/projects/:id`        | Actualizar proyecto (parcial)            |
| `DELETE` | `/api/projects/:id`        | Eliminar proyecto                        |
| `PATCH`  | `/api/projects/visibility` | Cambiar visibilidad en lote              |

#### Filtros en `GET /api/projects`

```
GET /api/projects?type=gd              # Solo diseño gráfico
GET /api/projects?type=dev             # Solo desarrollo
GET /api/projects?category=carteleria  # Solo una categoría
GET /api/projects?visible=false        # Solo proyectos ocultos
```

#### Crear un proyecto nuevo — `POST /api/projects`

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "type": "gd",
    "category": "carteleria",
    "title": "Mi nuevo cartel",
    "cliente": "Cliente XYZ",
    "descripcion": "Descripción del proyecto",
    "imagenes": [{ "ruta": "https://...", "label": "" }],
    "videos": [],
    "extras": [],
    "visible": true
  }'
```

Campos obligatorios: `type`, `category`, `title`, `cliente`.

El ID se genera automáticamente (`max(id) + 1` del JSON de destino).

**Respuesta (201):**Respuesta (201):

```json
{
  "success": true,
  "data": { "id": 9999, "title": "Mi nuevo cartel", ... },
  "message": "Project created successfully"
}
```

#### Cambiar visibilidad en lote — `PATCH /api/projects/visibility`

Esta es la operación que usa la tabla de gestión (`/kimo/data`) al seleccionar filas y pulsar "Marcar como oculto" o "Marcar como visible":

```bash
curl -X PATCH http://localhost:3001/api/projects/visibility \
  -H "Content-Type: application/json" \
  -d '{
    "ids": [3800, 3801, 4087],
    "visible": false
  }'
```

**Respuesta (200):**

```json
{
  "success": true,
  "message": "Visibility updated for 3 projects"
}
```

El backend localiza cada proyecto en su JSON correspondiente, actualiza el campo `visible` y reescribe el archivo en disco.

### Comunicación frontend ↔ backend

El cliente HTTP en `src/api/apiClient.ts` centraliza todas las llamadas:

```typescript
// Crear un proyecto
await createProject({ type: 'gd', category: 'logotipos', title: '...', cliente: '...' });

// Cambiar visibilidad de varios proyectos
await updateVisibilityBatch([3800, 3801], false);
```

CORS está configurado para aceptar peticiones desde `localhost:5173` (Vite) y `localhost:3000`.

### Arrancar el backend

```bash
# Solo el backend (producción)
pnpm backend

# Backend con recarga automática (desarrollo)
pnpm backend:dev

# Frontend + backend simultáneamente (recomendado)
pnpm start
```

Con `pnpm start` se arrancan en paralelo:

- **Vite** en `http://localhost:5173`
- **Express** en `http://localhost:3001`

Para verificar que el backend está activo:

```bash
curl http://localhost:3001/health
# { "success": true, "message": "Backend is running", ... }
```

---

## 10. Scripts disponibles

```bash
pnpm dev            # Servidor de desarrollo Vite (solo frontend)
pnpm build          # Compila TypeScript y genera build de producción
pnpm preview        # Preview del build de producción
pnpm lint           # ESLint
pnpm typecheck      # TypeScript sin emitir archivos
pnpm test           # Tests con Vitest (modo CI)
pnpm test:watch     # Tests en modo watch
pnpm check          # Suite completa: lint + typecheck + tests + build
pnpm backend        # Backend Express (modo producción)
pnpm backend:dev    # Backend Express con nodemon (modo desarrollo)
pnpm start          # Frontend + Backend en paralelo (modo desarrollo)
```

> `pnpm check` es el script de pre-push. Si falla, el commit no puede subirse a GitHub (Husky lo intercepta).

---

## 11. Variables de entorno

### Frontend (`.env` en la raíz)

```env
VITE_BOOK_COVERS_PATH=/images/books
VITE_ILLUSTRATIONS_PATH=/images/illustrations
VITE_UI_IMG_PATH=/images/ui
```

Estas variables configuran las rutas base para las imágenes servidas desde `public/`. Se usan con `import.meta.env.VITE_*` en el código.

### Backend (`api/.env`)

```env
PORT=3001
NODE_ENV=development
DATA_DIR=src/data
```

Copiar `api/.env.example` como `api/.env` antes de arrancar el backend.

> Ningún archivo `.env` se versiona. Los archivos `.env.example` sirven como plantilla.

---

## 12. Primeros pasos tras clonar

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd portfolio

# 2. Instalar dependencias
pnpm install

# 3. Crear archivos de entorno
cp .env.example .env          # o crear .env manualmente
cp api/.env.example api/.env  # necesario para el backend

# 4a. Solo frontend (para ver el portfolio)
pnpm dev

# 4b. Frontend + backend (para usar /kimo/data y /kimo/add-project)
pnpm start
```

---

## 13. Convenciones y arquitectura

### Iconos

Todos los iconos son componentes React SVG en `src/components/iconos/`. Aceptan props `size`, `strokeWidth` y `className`. Se exportan desde `index.ts` y se pueden ver todos en `/kimo/iconos`.

### Atributos `data-id`

Todos los componentes principales llevan `data-id` con un nombre semántico (`data-id="books-page"`, `data-id="places-map"`...). Facilitan los tests E2E y el debugging visual sin acoplarse a clases CSS.

### Estilos

- **Tailwind** para utilidades de uso único.
- **Archivos `.css`** para estilos complejos, multi-propiedad, pseudo-clases o media queries.
- **Variables CSS** para el tema: `--color-ink`, `--color-accent`, `--color-border`, `--color-muted`...

### Interfaces TypeScript

Todos los tipos e interfaces centralizados en `src/interfaces/`. No se declaran tipos inline en componentes salvo que sean locales y triviales.

### Gestión de errores en el backend

El middleware `errorHandler.cjs` captura todos los errores no controlados y devuelve siempre una respuesta JSON con `{ success: false, error: "..." }` y el código HTTP apropiado. Los controladores solo hacen `next(error)` en caso de fallo.
