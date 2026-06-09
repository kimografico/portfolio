# Kimografico — Análisis técnico del backend

Análisis de capacidades, endpoints, tecnología y arquitectura del servidor API REST.

---

## Tecnología

| Componente           | Tecnología                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| Runtime              | Node.js                                                                  |
| Framework            | Express 4.x                                                              |
| Formato de módulos   | CommonJS (`.cjs`)                                                        |
| Almacenamiento       | Ficheros JSON en disco (`src/data/`)                                     |
| Subida de archivos   | Multer (memory storage)                                                  |
| CORS                 | Paquete `cors` — orígenes permitidos: `localhost:5173`, `localhost:3000` |
| Variables de entorno | `dotenv` — archivo `.env` en la carpeta `api/`                           |
| Hot reload           | Nodemon (desarrollo)                                                     |
| Puerto               | 3001 (configurable vía `PORT`)                                           |

### Arranque

```bash
pnpm backend          # con hot-reload (nodemon)
pnpm backend:fixed    # sin hot-reload (node directo)
pnpm start            # arranca frontend (Vite) + backend en paralelo
```

---

## Arquitectura

```
api/
├── server.cjs              # Punto de entrada: middleware, rutas, error handler
├── controllers/            # Lógica de negocio por dominio
│   ├── projectController.cjs
│   ├── kimoController.cjs
│   ├── uploadController.cjs
│   ├── recentWorksController.cjs
│   ├── resumeController.cjs
│   └── carouselController.cjs
├── routes/                 # Definición de rutas Express
│   ├── projects.cjs
│   ├── kimo.cjs
│   ├── upload.cjs
│   ├── recent-works.cjs
│   ├── resume.cjs
│   └── carousel.cjs
├── middleware/
│   ├── kimoAuth.cjs        # Autenticación por Bearer token (SHA-256)
│   └── errorHandler.cjs    # Manejador centralizado de errores
└── utils/
    ├── fileSystem.cjs      # I/O de proyectos (JSON en disco)
    ├── kimoStore.cjs       # I/O de datos Kimo (libros, lugares, etc.)
    └── validation.cjs      # Validación de datos y categorías
```

---

## Autenticación

**Middleware**: `kimoAuth.cjs`

- Lee la variable de entorno `KIMO_PASSWORD_HASH` (o `VITE_KIMO_PASSWORD_HASH`).
- Comprueba la cabecera `Authorization: Bearer {hash}` en cada petición protegida.
- Si el hash coincide, la petición pasa. Si no, responde `401 Unauthorized`.
- Si no hay hash configurado, permite el paso (modo desarrollo sin contraseña).

Todos los endpoints de escritura (POST, PUT, PATCH, DELETE) están protegidos con este middleware.

---

## Endpoints

### Health check

| Método | Ruta      | Auth | Descripción                                                                          |
| ------ | --------- | ---- | ------------------------------------------------------------------------------------ |
| GET    | `/health` | No   | Comprueba que el backend está levantado. Devuelve `{ success, message, timestamp }`. |

---

### Proyectos (`/api/projects`)

Gestión CRUD de proyectos del portfolio (diseño gráfico y desarrollo web).

| Método | Ruta                       | Auth | Descripción                                                                                                                     |
| ------ | -------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/projects`            | No   | Lista proyectos. Admite query params: `type` (gd/dev), `category`, `visible` (true/false/all). Ordenados por fecha descendente. |
| GET    | `/api/projects/:id`        | No   | Obtiene un proyecto por su ID numérico.                                                                                         |
| POST   | `/api/projects`            | Sí   | Crea un proyecto nuevo. Valida tipo, categoría y campos obligatorios. Asigna ID secuencial único global.                        |
| PUT    | `/api/projects/:id`        | Sí   | Actualiza un proyecto existente.                                                                                                |
| DELETE | `/api/projects/:id`        | Sí   | Elimina un proyecto.                                                                                                            |
| PATCH  | `/api/projects/visibility` | Sí   | Actualiza visibilidad en lote. Body: `{ ids: number[], visible: boolean }`.                                                     |

**Almacenamiento**: cada categoría tiene su propio JSON en `src/data/graphic-design/` o `src/data/development/` (ej: `editorial.json`, `wordpress.json`).

**Validación** (`validation.cjs`):

- Tipos válidos: `gd`, `dev`.
- Categorías de diseño: `logotipos`, `editorial`, `etiquetas`, `papeleria`, `carteleria`, `packaging`, `proyectos-especiales`, `multimedia`.
- Categorías de desarrollo: `vanilla`, `wordpress`, `frameworks`.
- Campos obligatorios en creación: `title`, `type`, `category`.

---

### Subida de imágenes (`/api/upload`)

| Método | Ruta          | Auth | Descripción                                                                                   |
| ------ | ------------- | ---- | --------------------------------------------------------------------------------------------- |
| POST   | `/api/upload` | Sí   | Sube imágenes de proyecto. Form-data con campo `images` (array), `type`, `category`, `title`. |

**Configuración de Multer**:

- Almacenamiento en memoria (buffer).
- Máximo 20 archivos por petición.
- Tamaño máximo: 10 MB por archivo.
- Solo acepta MIME types `image/*`.

**Procesamiento**:

1. Se genera un slug a partir del título (`slugify()`).
2. Se calcula el siguiente número secuencial para evitar sobreescrituras.
3. Se guarda en la ruta: `public/images/portfolio/{design|web}/{categoría}/{slug}{NNN}.{ext}`.
4. Devuelve un array con las rutas de las imágenes guardadas.

---

### Kimo — Datos personales (`/api/kimo`)

Creación de contenido del espacio personal.

| Método | Ruta                       | Auth | Descripción                                                                                                      |
| ------ | -------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/kimo/books`          | Sí   | Crea un nuevo libro. Genera ID único por slug del título.                                                        |
| POST   | `/api/kimo/illustrations`  | Sí   | Crea una nueva ilustración. Acepta imagen principal + extras.                                                    |
| POST   | `/api/kimo/places`         | Sí   | Crea un registro de lugar visitado.                                                                              |
| POST   | `/api/kimo/places-markers` | Sí   | Crea un marcador en el mapa (coordenadas lat/lng).                                                               |
| POST   | `/api/kimo/upload`         | Sí   | Sube imágenes del espacio Kimo (portadas de libros, ilustraciones). Misma configuración que upload de proyectos. |

**Almacenamiento**: ficheros JSON en `src/data/kimo/` (`books.json`, `illustrations.json`, `places.json`, `places_markers.json`).

**Generación de IDs** (`kimoStore.cjs`):

- `createUniqueSlugId()`: genera un slug a partir del título; si hay colisión, añade sufijo numérico.
- `generatePrefixedSequentialId()`: genera IDs secuenciales tipo `prefix-001`.
- `ensureUniqueStringId()`: valida unicidad y lanza 409 en caso de duplicado.

---

### Trabajos recientes (`/api/recent-works`)

| Método | Ruta                | Auth | Descripción                                             |
| ------ | ------------------- | ---- | ------------------------------------------------------- |
| GET    | `/api/recent-works` | No   | Devuelve el JSON de trabajos recientes para la landing. |
| PUT    | `/api/recent-works` | Sí   | Sobreescribe el JSON completo con la nueva selección.   |

**Estructura de datos**: array de `{ num, title, tipo, year, category, href }`.

**Almacenamiento**: `src/data/recent-works.json`.

---

### Currículum (`/api/resume`)

| Método | Ruta          | Auth | Descripción                                           |
| ------ | ------------- | ---- | ----------------------------------------------------- |
| GET    | `/api/resume` | No   | Devuelve el JSON completo del currículum.             |
| PUT    | `/api/resume` | Sí   | Sobreescribe el JSON completo con los datos editados. |

**Almacenamiento**: `src/data/resume.json`.

---

### Carrusel (`/api/carousel`)

| Método | Ruta            | Auth | Descripción                                            |
| ------ | --------------- | ---- | ------------------------------------------------------ |
| GET    | `/api/carousel` | No   | Devuelve el array de imágenes del carrusel de la home. |
| PUT    | `/api/carousel` | No\* | Actualiza el array de imágenes del carrusel.           |

\*Nota: actualmente el PUT del carrusel no tiene middleware de autenticación. Esto es intencional para simplificar el desarrollo.

**Estructura**: array de `{ src: string, alt: string }`.

**Almacenamiento**: `src/data/carousel.json`.

---

### Categorías (`/api/categories`)

| Método | Ruta              | Auth | Descripción                                                                 |
| ------ | ----------------- | ---- | --------------------------------------------------------------------------- |
| GET    | `/api/categories` | No   | Devuelve las categorías disponibles agrupadas por tipo (diseño/desarrollo). |

---

## Utilidades del backend

### fileSystem.cjs

Abstrae la lectura/escritura de ficheros JSON para proyectos.

| Función                                      | Descripción                                                           |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `getFilePath(type, category)`                | Construye la ruta al JSON de una categoría.                           |
| `readJsonFile(path)`                         | Lee y parsea un JSON.                                                 |
| `writeJsonFile(path, data)`                  | Serializa y escribe un JSON.                                          |
| `loadProjectsByType(type)`                   | Carga todos los proyectos de un tipo (gd/dev).                        |
| `loadAllProjects()`                          | Carga todos los proyectos (diseño + desarrollo).                      |
| `findProjectById(id)`                        | Busca un proyecto por ID en todos los JSONs.                          |
| `addProject(type, category, data)`           | Añade un proyecto al JSON correspondiente.                            |
| `updateProject(type, category, id, updates)` | Actualiza campos de un proyecto existente.                            |
| `deleteProject(type, category, id)`          | Elimina un proyecto de su JSON.                                       |
| `getMaxIdGlobally()`                         | Obtiene el ID más alto de todos los proyectos para evitar duplicados. |

### kimoStore.cjs

Equivalente a fileSystem pero para datos Kimo (libros, ilustraciones, lugares).

| Función                                       | Descripción                                       |
| --------------------------------------------- | ------------------------------------------------- |
| `getKimoFilePath(fileName)`                   | Ruta al JSON dentro de `src/data/kimo/`.          |
| `loadCollection(fileName)`                    | Lee un JSON Kimo.                                 |
| `saveCollection(fileName, data)`              | Escribe un JSON Kimo.                             |
| `slugify(text)`                               | Genera slug URL-safe.                             |
| `ensureUniqueStringId(items, id, label)`      | Valida unicidad (409 si existe).                  |
| `generatePrefixedSequentialId(items, prefix)` | Genera ID secuencial (ej: `ilu-001`).             |
| `createUniqueSlugId(items, seed, fallback)`   | Genera ID tipo slug con resolución de colisiones. |

### validation.cjs

Validación de datos para proyectos.

| Función                            | Descripción                                                      |
| ---------------------------------- | ---------------------------------------------------------------- |
| `validateType(type)`               | Valida que sea `gd` o `dev`.                                     |
| `validateCategory(type, category)` | Valida que la categoría sea válida para el tipo.                 |
| `validateProject(data, isUpdate)`  | Validación completa de un proyecto (campos obligatorios, tipos). |
| `validateId(id)`                   | Valida que el ID sea numérico.                                   |
| `validateVisibility(visible)`      | Valida el valor de visibilidad.                                  |

---

## Manejo de errores

**Middleware**: `errorHandler.cjs`

Captura todos los errores no manejados y devuelve una respuesta JSON consistente:

```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

Los controladores devuelven HTTP status codes apropiados:

- `200` — Éxito.
- `201` — Recurso creado.
- `400` — Validación fallida (datos incorrectos).
- `401` — No autenticado.
- `404` — Recurso no encontrado.
- `409` — Conflicto (ID duplicado).
- `500` — Error interno del servidor.

---

## Formato de respuesta estándar

Todas las respuestas siguen el formato:

```json
{
  "success": true,
  "data": { ... },
  "count": 42,
  "message": "Mensaje opcional"
}
```

En caso de error:

```json
{
  "success": false,
  "error": "Descripción del error"
}
```
