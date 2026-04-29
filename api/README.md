# Backend API REST

API simple sin base de datos para gestionar proyectos de diseño gráfico y desarrollo web. Los datos se almacenan en archivos JSON en `/src/data`.

## Instalación

Las dependencias está incluidas en `package.json` (raíz del proyecto). Para instalar todo:

```bash
pnpm install
```

Esto instala tanto las dependencias del frontend como las del backend (Express, CORS, dotenv).

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
GET    /api/projects              # Listar proyectos
GET    /api/projects/:id          # Obtener uno
POST   /api/projects              # Crear
PUT    /api/projects/:id          # Actualizar
DELETE /api/projects/:id          # Eliminar
PATCH  /api/projects/visibility   # Cambiar visibilidad en lote
GET    /api/categories            # Listar categorías
GET    /health                    # Health check
```

## Estructura del código

```
api/
├── spec.md                   # Documentación de la API
├── .env.example              # Ejemplo de variables de entorno
├── server.js                 # Punto de entrada, configura Express
├── routes/
│   └── projects.js           # Define todos los endpoints
├── controllers/
│   └── projectController.js  # Lógica de negocio para cada endpoint
├── utils/
│   ├── fileSystem.js         # Lectura/escritura de JSONs
│   └── validation.js         # Validaciones de datos
└── middleware/
    └── errorHandler.js       # Manejo centralizado de errores
```

**Patrón:** Rutas → Controllers → Utilidades. El middleware captura todos los errores.

## CORS

El backend permite CORS desde:

- `http://localhost:5173` (Vite - desarrollo)
- `http://localhost:3000` (alternativo)
- `http://127.0.0.1:5173` y `http://127.0.0.1:3000`

Para añadir más orígenes, editar `server.js`.

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
```

### Pruebas con Insomnia/Postman

Importar colección (próximamente) o crear manualmente según el spec.

## Notas técnicas

- **Sin base de datos:** Los JSONs son la BD. Cada write recarga el archivo completo.
- **Sin autenticación:** Es un proyecto privado. Si necesitas proteger, añadir validación.
- **CommonJS:** El backend usa `require()`. El frontend usa ESM (módulos modernos).
- **Sincrónico:** Las operaciones de archivo son sincrónicas (adecuado para pequeños volúmenes).

## Próximos pasos

1. Crear frontend para editar proyectos (DataPage + formularios)
2. Integrar fetch en React para consumir la API
3. Añadir tests para los endpoints (supertest)
4. Exportar a colección Postman para testing manual
