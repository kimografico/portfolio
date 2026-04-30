# Backend API REST

API simple sin base de datos para gestionar proyectos de diseño gráfico y desarrollo web. Los datos se almacenan en archivos JSON en `/src/data`. Incluye subida de imágenes al sistema de archivos.

## Instalación

Las dependencias están incluidas en `package.json` (raíz del proyecto). Para instalar todo:

```bash
pnpm install
```

Esto instala tanto las dependencias del frontend como las del backend (Express, CORS, dotenv, multer).

## Configuración

### Variables de entorno

Crear un archivo `.env` en `/api` (opcional, hay valores por defecto):

```env
PORT=3001
NODE_ENV=development
DATA_DIR=src/data
```

Para referencia, ver `.env.example`.

## Uso

### Arrancar el backend en desarrollo

```bash
pnpm backend:dev
```

Esto usa **nodemon** para auto-recargar cuando cambies archivos.

El servidor estará en: `http://localhost:3001`

### Arrancar frontend y backend simultáneamente

```bash
pnpm start
```

Esto abre:

- Frontend: `http://localhost:5173` (Vite)
- Backend: `http://localhost:3001` (Express)

### Arrancar solo el backend (producción)

```bash
pnpm backend
```

## API Endpoints

Ver [spec.md](./spec.md) para documentación completa.

**Resumen rápido:**

```
GET    /api/projects              # Listar proyectos (con filtros opcionales)
GET    /api/projects/:id          # Obtener uno por ID
POST   /api/projects              # Crear proyecto
PUT    /api/projects/:id          # Actualizar proyecto
DELETE /api/projects/:id          # Eliminar proyecto
PATCH  /api/projects/visibility   # Cambiar visibilidad en lote
POST   /api/upload                # Subir imágenes al servidor
GET    /api/categories            # Listar categorías válidas
GET    /health                    # Health check
```

### Subida de imágenes — `POST /api/upload`

Endpoint de subida de archivos (multipart/form-data) que guarda las imágenes en la carpeta `public/images/portfolio/`.

**Campos del formulario:**

| Campo      | Tipo   | Descripción                                           |
| ---------- | ------ | ----------------------------------------------------- |
| `type`     | string | `"gd"` (diseño gráfico) o `"dev"` (desarrollo)        |
| `category` | string | Slug de la categoría (ej: `"carteleria"`)             |
| `title`    | string | Título del proyecto (se convierte a slug para nombre) |
| `images`   | file[] | Archivos de imagen (máx. 20)                          |

**Configuración de multer:**

- **Almacenamiento**: en memoria (sin archivos temporales).
- **Máximo por archivo**: 10 MB.
- **Máximo archivos por petición**: 20.
- **Extensiones permitidas**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.avif`.
- **MIME type**: solo `image/*`.

**Nombre y ruta de los archivos:**

El título se convierte a slug y se numera secuencialmente:

```
public/images/portfolio/{design|web}/{categoría}/{slug}{NNN}.{ext}

Ejemplo: public/images/portfolio/design/carteleria/mi-nuevo-cartel001.jpg
         public/images/portfolio/design/carteleria/mi-nuevo-cartel002.png
```

La numeración se calcula buscando el siguiente número disponible en la carpeta destino.

**Ejemplo con curl:**

```bash
curl -X POST http://localhost:3001/api/upload \
  -F "type=gd" \
  -F "category=carteleria" \
  -F "title=Mi nuevo cartel" \
  -F "images=@foto1.jpg" \
  -F "images=@foto2.png"
```

**Respuesta (200):**

```json
{
  "success": true,
  "data": [
    { "ruta": "/images/portfolio/design/carteleria/mi-nuevo-cartel001.jpg", "label": "foto1.jpg" },
    { "ruta": "/images/portfolio/design/carteleria/mi-nuevo-cartel002.png", "label": "foto2.png" }
  ],
  "message": "2 imagen(es) subida(s) correctamente"
}
```

Las rutas devueltas son relativas a `public/`, listas para usar directamente en los campos `imagenes[].ruta` de los proyectos.

## Estructura del código

```
api/
├── server.cjs                 # Punto de entrada, configura Express + middleware + rutas
├── routes/
│   ├── projects.cjs           # Endpoints CRUD de proyectos + categorías
│   └── upload.cjs             # Endpoint de subida de imágenes (multer)
├── controllers/
│   ├── projectController.cjs  # Lógica de negocio para proyectos
│   └── uploadController.cjs   # Lógica de subida: slugify, numeración, escritura en disco
├── utils/
│   ├── fileSystem.cjs         # Lectura/escritura de JSONs
│   └── validation.cjs         # Validaciones de datos
└── middleware/
    └── errorHandler.cjs       # Manejo centralizado de errores
```

**Patrón:** Rutas → Controllers → Utilidades. El middleware captura todos los errores.

### Flujo de subida de imágenes

1. El frontend envía los archivos como `FormData` a `POST /api/upload`.
2. **multer** valida tipo MIME y tamaño, y los mantiene en memoria (buffer).
3. **uploadController** recibe los buffers, genera los slugs y nombres secuenciales, crea los directorios necesarios y escribe los archivos en disco.
4. Devuelve un array con las rutas relativas y labels de cada imagen subida.
5. El frontend usa esas rutas para rellenar el campo `imagenes` del proyecto antes de crearlo o actualizarlo.

## CORS

El backend permite CORS desde:

- `http://localhost:5173` (Vite - desarrollo)
- `http://localhost:3000` (alternativo)
- `http://127.0.0.1:5173` y `http://127.0.0.1:3000`

Para añadir más orígenes, editar `server.cjs`.

## Datos (JSONs)

**Rutas:**

- `src/data/graphic-design/*.json` (8 categorías)
- `src/data/development/*.json` (3 categorías)

**Generación de IDs:** automática (máximo actual + 1)

**Validación:** type, category, campos obligatorios, formatos.

## Debugging

### Ver logs del servidor

El servidor imprime en consola:

- Puerto donde corre
- Directorio de datos
- CORS habilitado para
- Errores con detalles

### Pruebas rápidas (curl)

```bash
# Listar proyectos
curl http://localhost:3001/api/projects

# Obtener proyecto
curl http://localhost:3001/api/projects/3800

# Health check
curl http://localhost:3001/health

# Listar categorías
curl http://localhost:3001/api/categories

# Subir imágenes
curl -X POST http://localhost:3001/api/upload \
  -F "type=gd" -F "category=logotipos" -F "title=Test" \
  -F "images=@imagen.jpg"
```

### Pruebas con Insomnia/Postman

Importar colección (próximamente) o crear manualmente según el spec.

## Notas técnicas

- **Sin base de datos:** Los JSONs son la BD. Cada write recarga el archivo completo.
- **Sin autenticación:** Es un proyecto privado. Si necesitas proteger, añadir validación.
- **CommonJS:** El backend usa `require()` (archivos `.cjs`). El frontend usa ESM (módulos modernos). Se usa `.cjs` porque el `package.json` raíz tiene `"type": "module"`.
- **Sincrónico:** Las operaciones de archivo son sincrónicas (adecuado para pequeños volúmenes).
- **Imágenes subidas**: Se almacenan en `public/images/portfolio/{design|web}/{categoría}/`, organizadas por tipo y categoría del proyecto.

## Próximos pasos

1. Añadir tests para los endpoints (supertest)
2. Exportar a colección Postman para testing manual
3. Añadir autenticación básica si se despliega en red pública
