# API REST Backend - Especificación

## Resumen ejecutivo

API REST simple para gestionar proyectos de diseño gráfico y desarrollo web. Permite leer, crear, actualizar y eliminar entradas en JSONs. Todo desde el frontend con persistencia en archivos reales.

**Stack:**

- Node.js + Express
- Sin base de datos (los JSONs son la BD)
- Sin autenticación (ambiente privado/desarrollo)
- CORS habilitado para frontend en Vite

---

## Arquitectura

```
api/
├── spec.md (este archivo)
├── server.js (punto de entrada)
├── routes/
│   ├── projects.js (todas las rutas de proyectos)
├── controllers/
│   └── projectController.js (lógica de lectura/escritura)
├── utils/
│   ├── fileSystem.js (helpers para leer/escribir archivos)
│   └── validation.js (validar campos)
└── middleware/
    └── errorHandler.js (manejo de errores centralizado)
```

**Filosofía:** Controllers manejan la lógica, utils hacen el trabajo pesado, middleware captura errores.

---

## Base de datos (Archivos JSON)

### Estructura de carpetas

```
src/data/
├── graphic-design/
│   ├── carteleria.json
│   ├── editorial.json
│   ├── etiquetas.json
│   ├── logotipos.json
│   ├── multimedia.json
│   ├── packaging.json
│   ├── papeleria.json
│   └── proyectos-especiales.json
├── development/
│   ├── vanilla.json
│   ├── wordpress.json
│   └── frameworks.json
└── ...
```

### Esquema de proyecto (genérico)

```json
{
  "id": 3800,
  "date": "2020-12-31 10:36",
  "title": "Rótulo Peluquería",
  "cliente": "Sort Estilistas",
  "descripcion": "...",
  "imagenes": [
    {
      "ruta": "https://...",
      "label": ""
    }
  ],
  "videos": [],
  "extras": [],
  "visible": true,
  "stack": [], // (solo en development)
  "categoria": "carteleria" // (metadato, se añade en runtime)
}
```

**Campos principales:**

- `id`: Identificador único (número)
- `date`: Fecha ISO con hora (string)
- `title`: Nombre del proyecto
- `cliente`: Cliente
- `descripcion`: Descripción
- `imagenes`: Array de objetos con `ruta` y `label`
- `videos`: Array de URLs de video
- `extras`: Array de links adicionales
- `visible`: Boolean (true/false)
- `stack`: (solo desarrollo) Array de tecnologías

---

## Endpoints

### 1. Listar proyectos

**GET** `/api/projects`

Devuelve todos los proyectos de todos los JSONs.

**Query params:**

- `type`: `gd` (graphic-design) o `dev` (development) — filtro opcional
- `category`: Nombre del JSON (ej: `carteleria`, `vanilla`)
- `visible`: `true` | `false` | `all` (por defecto: `all`)

**Ejemplos:**

```
GET /api/projects
GET /api/projects?type=gd&visible=true
GET /api/projects?category=vanilla
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 3800,
      "title": "Rótulo Peluquería",
      "date": "2020-12-31 10:36",
      "type": "gd",
      "category": "carteleria",
      "visible": true,
      ...
    }
  ],
  "count": 42
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Invalid type. Must be 'gd' or 'dev'."
}
```

---

### 2. Obtener proyecto específico

**GET** `/api/projects/:id`

Devuelve un proyecto por ID.

**Params:**

- `id`: ID del proyecto (number)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 3800,
    "title": "...",
    "type": "gd",
    "category": "carteleria",
    ...
  }
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Project not found"
}
```

---

### 3. Crear proyecto

**POST** `/api/projects`

Crea un nuevo proyecto en el JSON especificado.

**Body:**

```json
{
  "type": "gd",
  "category": "carteleria",
  "title": "Mi nuevo proyecto",
  "cliente": "Cliente XYZ",
  "descripcion": "...",
  "imagenes": [{ "ruta": "https://...", "label": "" }],
  "videos": [],
  "extras": [],
  "visible": true
}
```

**Validaciones:**

- `type`: obligatorio, debe ser `gd` o `dev`
- `category`: obligatorio, debe ser válido para ese tipo
- `title`: obligatorio, string no vacío
- `cliente`: obligatorio
- `descripcion`: opcional
- `imagenes`, `videos`, `extras`: arrays (pueden estar vacíos)
- `visible`: boolean (por defecto: true)
- `stack`: (solo para dev) array de strings

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 9999,  // nuevo ID auto-generado
    "title": "Mi nuevo proyecto",
    "type": "gd",
    "category": "carteleria",
    ...
  },
  "message": "Project created successfully"
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Missing required field: title"
}
```

---

### 4. Actualizar proyecto

**PUT** `/api/projects/:id`

Modifica un proyecto existente (parcial).

**Params:**

- `id`: ID del proyecto

**Body (solo los campos a modificar):**

```json
{
  "title": "Nuevo título",
  "visible": false,
  "descripcion": "Nueva descripción"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 3800,
    "title": "Nuevo título",
    ...
  },
  "message": "Project updated successfully"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Project not found"
}
```

---

### 5. Eliminar proyecto

**DELETE** `/api/projects/:id`

Marca un proyecto como eliminado o lo borra completamente (decidir según necesidad).

**Params:**

- `id`: ID del proyecto

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Project not found"
}
```

---

### 6. Cambiar visibilidad en lote

**PATCH** `/api/projects/visibility`

Cambia la visibilidad de múltiples proyectos a la vez.

**Body:**

```json
{
  "ids": [3800, 3801, 3802],
  "visible": false
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Visibility updated for 3 projects"
}
```

---

### 7. Listar categorías disponibles

**GET** `/api/categories`

Devuelve todas las categorías disponibles (nombres de archivos JSON).

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "gd": [
      "carteleria",
      "editorial",
      "etiquetas",
      "logotipos",
      "multimedia",
      "packaging",
      "papeleria",
      "proyectos-especiales"
    ],
    "dev": ["vanilla", "wordpress", "frameworks"]
  }
}
```

---

## Errores globales

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Error reading file: [detalles]"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid JSON payload"
}
```

---

## Consideraciones técnicas

### 1. Generación de IDs

- **Método:** Busca el máximo ID actual en el JSON y suma 1.
- **Ventaja:** Simple y predecible.
- **Desventaja:** Si hay concurrencia, podría haber colisiones (mitigado porque es uso local).

### 2. Persistencia

- Cada write (POST, PUT, DELETE) escribe el JSON completo de nuevo.
- Se guarda con formato legible (indent: 2).

### 3. Validación

- `type` y `category` deben ser válidos.
- `title` y `cliente` no pueden estar vacíos.
- `id` debe ser número único.

### 4. CORS

- Permitir origen local: `http://localhost:5173` (puerto Vite por defecto).
- Si cambias el puerto, actualizar la configuración.

### 5. Seguridad (futuro)

- Actualmente sin autenticación (es un proyecto privado).
- Si quieres proteger, añadir un token simple o API key.

---

## Ciclo de vida esperado

1. **Frontend** hace `GET /api/projects` para cargar datos iniciales.
2. **Usuario** edita, marca, añade o borra entradas en la UI.
3. **Frontend** hace POST/PUT/DELETE con los cambios.
4. **Backend** valida, actualiza el archivo JSON, devuelve respuesta.
5. **Frontend** actualiza la UI y muestra feedback (toast, modal, etc).

---

## Variables de entorno

```env
PORT=3001          # Puerto del servidor
NODE_ENV=development
DATA_DIR=src/data  # Ruta a los JSONs
```

---

## Scripts en package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "backend:fixed": "node api/server.js",
    "backend": "nodemon api/server.js",
    "start": "concurrently \"pnpm dev\" \"pnpm backend\""
  }
}
```

**Explicación:**

- `pnpm dev`: Arrancar Vite (frontend).
- `pnpm backend:fixed`: Arrancar backend (producción).
- `pnpm backend`: Arrancar backend con nodemon (desarrollo, auto-reload).
- `pnpm start`: Arrancar frontend y backend simultáneamente.

---

## Testing recomendado

### Frontend

- Interceptar fetch con `vitest.mock()` o MSW (Mock Service Worker).
- Testear que la UI llama a los endpoints correctos.
- Testear feedback de éxito/error.

### Backend

- Tests con `supertest` para cada endpoint.
- Casos nominales y errores.
- Validación de archivos después de cada write.

---

## Conclusión

Esta API es simple pero robusta:

- ✅ Sin base de datos
- ✅ SIN dependencias externas complejas
- ✅ Fácil de entender y mantener
- ✅ Perfecta para edición desde frontend
- ✅ Archivos JSON persistentes

Próximo paso: Crear los archivos `server.js`, controllers y utilities según este spec.
