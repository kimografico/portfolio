# Migracion a Cloudflare: Frontend + Backend

Guia paso a paso para migrar el portfolio completo (React SPA + Express API + JSONs) a Cloudflare Pages + Workers + D1 + R2.

---

## Fase 0: Registro y configuracion inicial en Cloudflare

### 0.1 Crear cuenta

1. Ir a https://dash.cloudflare.com/sign-up
2. Registrar con email (gratuito, no pide tarjeta)
3. Verificar email

### 0.2 Instalar Wrangler CLI

Wrangler es la CLI oficial de Cloudflare para gestionar Workers, D1, R2, etc.

```bash
npm install -g wrangler
# o
pnpm add -g wrangler
```

### 0.3 Autenticar Wrangler

```bash
wrangler login
```

Abre el navegador, autoriza. Verificar con:

```bash
wrangler whoami
```

### 0.4 Elegir un dominio

Opciones:
- **Dominio propio**: Anadir el dominio a Cloudflare (cambiar nameservers en el registrar)
- **Subdomonio de `pages.dev`**: Cloudflare Pages genera automaticamente `tu-proyecto.pages.dev`
- **`workers.dev`**: Workers genera `tu-worker.workers.dev`

Para un portfolio, lo mas simple es usar `tu-proyecto.pages.dev` (automatico).

---

## Fase 1: Migrar el Frontend a Cloudflare Pages

### 1.1 Preparar el build

El frontend ya funciona con Vite. Solo necesitamos asegurar que el `base` en `vite.config.ts` apunte al path correcto.

**`vite.config.ts`** - Verificar/ajustar:

```ts
export default defineConfig({
  base: '/',  // Cloudflare Pages sirve desde la raiz
  // ...
})
```

> Nota: En GitHub Pages se usa `/portfolio/`. En Pages propio es `/`.

### 1.2 Desplegar desde el repositorio

**Opcion A: Deploy automatico (recomendado)**

1. Subir el codigo a GitHub/GitLab/Bitbucket
2. En Cloudflare Dashboard: Workers & Pages > Create > Pages > Connect to Git
3. Seleccionar el repositorio
4. Configurar:
   - **Build command**: `pnpm install && pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (o donde este el package.json)
5. Deploy

**Opcion B: Deploy manual con Wrangler**

```bash
# Desde la raiz del proyecto
pnpm build
wrangler pages deploy dist --project-name=portfolio
```

### 1.3 Variables de entorno

En el Dashboard de Cloudflare Pages:
1. Ir a Pages > tu-proyecto > Settings > Environment variables
2. Anadir las variables `VITE_*` necesarias:
   - `VITE_BOOK_COVERS_PATH`
   - `VITE_KIMO_PASSWORD_HASH`
   - `VITE_API_BASE_URL` (nueva, apuntara al Worker API)

### 1.4 Configurar SPA fallback

Cloudflare Pages maneja esto automaticamente con `_redirects` o `not_found_page`. Crear `public/_redirects`:

```
/*    /index.html   200
```

O en Pages Dashboard: Pages > Settings > Functions > Routing > SPA mode.

---

## Fase 2: Preparar la Base de Datos D1

D1 es SQLite en el edge. Migraremos los JSONs a tablas D1.

### 2.1 Crear la base de datos

```bash
wrangler d1 create portfolio-db
```

Esto genera un `database_id` en la salida. Guardarlo.

### 2.2 Crear esquema SQL

Crear `api/d1-schema.sql`:

```sql
-- Proyectos de diseno grafico
CREATE TABLE IF NOT EXISTS projects_gd (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  cliente TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  imagenes TEXT NOT NULL DEFAULT '[]',   -- JSON array
  videos TEXT NOT NULL DEFAULT '[]',
  extras TEXT NOT NULL DEFAULT '[]',
  visible INTEGER NOT NULL DEFAULT 1,     -- boolean (0/1)
  category TEXT NOT NULL DEFAULT ''
);

-- Proyectos de desarrollo
CREATE TABLE IF NOT EXISTS projects_dev (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  cliente TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  imagenes TEXT NOT NULL DEFAULT '[]',
  videos TEXT NOT NULL DEFAULT '[]',
  extras TEXT NOT NULL DEFAULT '[]',
  visible INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL DEFAULT '',
  stack TEXT NOT NULL DEFAULT '[]'
);

-- Libros
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  cover TEXT NOT NULL DEFAULT '',
  dateRead TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL DEFAULT '',
  isbn TEXT NOT NULL DEFAULT '',
  series TEXT NOT NULL DEFAULT '',
  synopsis TEXT NOT NULL DEFAULT ''
);

-- Ilustraciones
CREATE TABLE IF NOT EXISTS illustrations (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  fecha TEXT NOT NULL DEFAULT '',
  cliente TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  imagenesExtra TEXT NOT NULL DEFAULT '[]'
);

-- Lugares
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL DEFAULT '',
  place TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  people TEXT NOT NULL DEFAULT ''
);

-- Marcadores de mapa
CREATE TABLE IF NOT EXISTS places_markers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  lat REAL NOT NULL DEFAULT 0,
  lon REAL NOT NULL DEFAULT 0
);

-- CV / Resume (almacenado como objeto completo)
CREATE TABLE IF NOT EXISTS resume (
  id INTEGER PRIMARY KEY CHECK (id = 1),  -- solo una fila
  data TEXT NOT NULL DEFAULT '{}'           -- JSON completo
);

-- Obras recientes
CREATE TABLE IF NOT EXISTS recent_works (
  num INTEGER PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  tipo TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL DEFAULT ''
);

-- Carrusel
CREATE TABLE IF NOT EXISTS carousel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  src TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT ''
);
```

### 2.3 Aplicar esquema

```bash
wrangler d1 execute portfolio-db --file=api/d1-schema.sql
```

### 2.4 Script de migracion de datos

Crear `api/migrate-data.mjs`:

```js
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Ajustar rutas segun tu estructura
const DATA_DIR = resolve(process.cwd(), 'src/data');

function loadJson(relativePath) {
  return JSON.parse(readFileSync(resolve(DATA_DIR, relativePath), 'utf-8'));
}

function escapeJson(obj) {
  return JSON.stringify(obj).replace(/'/g, "''");
}

export default async function migrate(env) {
  const db = env.DB;

  // 1. Migrar proyectos GD
  const gdFiles = [
    'carteleria', 'editorial', 'etiquetas', 'logotipos',
    'multimedia', 'packaging', 'papeleria', 'proyectos-especiales'
  ];

  for (const cat of gdFiles) {
    const projects = loadJson(`graphic-design/${cat}.json`);
    for (const p of projects) {
      await db.prepare(`
        INSERT OR REPLACE INTO projects_gd
        (id, date, title, cliente, descripcion, imagenes, videos, extras, visible, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        p.id,
        p.date || '',
        p.title || '',
        p.cliente || '',
        p.descripcion || '',
        escapeJson(p.imagenes || []),
        escapeJson(p.videos || []),
        escapeJson(p.extras || []),
        p.visible ? 1 : 0,
        cat
      ).run();
    }
  }

  // 2. Migrar proyectos Dev
  const devFiles = ['vanilla', 'wordpress', 'frameworks'];

  for (const cat of devFiles) {
    const projects = loadJson(`development/${cat}.json`);
    for (const p of projects) {
      await db.prepare(`
        INSERT OR REPLACE INTO projects_dev
        (id, date, title, cliente, descripcion, imagenes, videos, extras, visible, category, stack)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        p.id,
        p.date || '',
        p.title || '',
        p.cliente || '',
        p.descripcion || '',
        escapeJson(p.imagenes || []),
        escapeJson(p.videos || []),
        escapeJson(p.extras || []),
        p.visible ? 1 : 0,
        cat,
        escapeJson(p.stack || [])
      ).run();
    }
  }

  // 3. Migrar libros
  const books = loadJson('kimo/books.json');
  for (const b of books) {
    await db.prepare(`
      INSERT OR REPLACE INTO books
      (id, title, author, language, cover, dateRead, genre, isbn, series, synopsis)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      b.id, b.title, b.author, b.language, b.cover,
      b.dateRead, b.genre, b.isbn, b.series, b.synopsis
    ).run();
  }

  // 4. Migrar ilustraciones
  const illustrations = loadJson('kimo/illustrations.json');
  for (const i of illustrations) {
    await db.prepare(`
      INSERT OR REPLACE INTO illustrations
      (id, nombre, image, fecha, cliente, descripcion, imagenesExtra)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      i.id, i.nombre, i.image, i.fecha, i.cliente,
      i.descripcion, escapeJson(i.imagenesExtra || [])
    ).run();
  }

  // 5. Migrar lugares
  const places = loadJson('kimo/places.json');
  for (let idx = 0; idx < places.length; idx++) {
    const p = places[idx];
    await db.prepare(`
      INSERT OR REPLACE INTO places (id, city, place, country, date, people)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      `place-${String(idx + 1).padStart(3, '0')}`,
      p.city, p.place, p.country, p.date, p.people
    ).run();
  }

  // 6. Migrar marcadores
  const markers = loadJson('kimo/places_markers.json');
  for (let idx = 0; idx < markers.length; idx++) {
    const m = markers[idx];
    await db.prepare(`
      INSERT OR REPLACE INTO places_markers (id, name, country, lat, lon)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      `marker-${String(idx + 1).padStart(3, '0')}`,
      m.name, m.country, m.lat, m.lon
    ).run();
  }

  // 7. Migrar resume
  const resume = loadJson('resume.json');
  await db.prepare(`
    INSERT OR REPLACE INTO resume (id, data) VALUES (1, ?)
  `).bind(escapeJson(resume)).run();

  // 8. Migrar recent works
  const recentWorks = loadJson('recent-works.json');
  for (const rw of recentWorks) {
    await db.prepare(`
      INSERT OR REPLACE INTO recent_works (num, title, tipo, year, category, href)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(rw.num, rw.title, rw.tipo, rw.year, rw.category, rw.href).run();
  }

  // 9. Migrar carrusel
  const carousel = loadJson('carousel.json');
  for (const c of carousel) {
    await db.prepare(`
      INSERT INTO carousel (src, alt) VALUES (?, ?)
    `).bind(c.src, c.alt).run();
  }

  return 'Migracion completada';
}
```

Ejecutar migracion (temporalmente, desde un Worker de un solo uso o via wrangler):

```bash
# Opcion 1: Usar wrangler para ejecutar un script
# Primero, subir los datos de forma manual o via un endpoint temporal

# Opcion 2: Ejecutar desde wrangler d1
wrangler d1 execute portfolio-db --file=api/d1-migrations/seed.sql
```

> Para la migracion inicial, lo mas practico es generar un SQL con los datos embebidos o usar un script que suba los datos via la API del Worker.

---

## Fase 3: Migrar Imagenes a R2

R2 es el object storage de Cloudflare (como S3 pero sin egress fees).

### 3.1 Crear bucket

```bash
wrangler r2 bucket create portfolio-images
```

### 3.2 Subir imagenes existentes

```bash
# Subir todas las imagenes de public/images/
wrangler r2 object put portfolio-images/images/ --file=./public/images/ --recursive
```

### 3.3 Configurar acceso publico

Por defecto, los objetos en R2 no son publicos. Para servir imagenes:

**Opcion A: Workers para servir imagenes (recomendado)**

Crear un Worker que sirva las imagenes desde R2:

```ts
// api/src/r2-images.ts
export async function handleImageRequest(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  // url.pathname = /images/portfolio/design/carteleria/mi-proyecto001.jpg
  const key = url.pathname.slice(1); // quitar el /

  const object = await env.IMAGES_BUCKET.get(key);
  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new Response(object.body, { headers });
}
```

**Opcion B: Cloudflare Images (mas simple pero con limite)**

Cloudflare Images tiene 100k imagenes gratis/mes pero es un producto separado.

### 3.4 Subir imagenes nuevas via API

En el Worker API, necesitaremos un endpoint para subir a R2:

```ts
// Endpoint POST /api/upload
// Usar R2Bucket.put() en lugar de fs.writeFileSync()
```

---

## Fase 4: Migrar el Backend de Express a Hono (Workers)

Hono es el framework que reemplaza Express en Workers. Sintaxis muy similar.

### 4.1 Instalar dependencias

```bash
pnpm add hono
pnpm add -D wrangler @cloudflare/workers-types
```

### 4.2 Estructura del Worker

Crear `api/src/index.ts`:

```ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { projectsRouter } from './routes/projects';
import { uploadRouter } from './routes/upload';
import { recentWorksRouter } from './routes/recent-works';
import { resumeRouter } from './routes/resume';
import { kimoRouter } from './routes/kimo';
import { carouselRouter } from './routes/carousel';
import { handleImageRequest } from './r2-images';

type Bindings = {
  DB: D1Database;
  IMAGES_BUCKET: R2Bucket;
  KIMO_PASSWORD_HASH: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://tu-proyecto.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Health check
app.get('/health', (c) => {
  return c.json({ success: true, message: 'Backend running' });
});

// Rutas
app.route('/api/projects', projectsRouter);
app.route('/api/upload', uploadRouter);
app.route('/api/recent-works', recentWorksRouter);
app.route('/api/resume', resumeRouter);
app.route('/api/kimo', kimoRouter);
app.route('/api/carousel', carouselRouter);

// Imagenes desde R2
app.get('/images/*', (c) => handleImageRequest(c.req.raw, c.env));

// 404
app.notFound((c) => {
  return c.json({ success: false, error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ success: false, error: err.message }, 500);
});

export default app;
```

### 4.3 Migrar controllers (ejemplo: projects)

**Original** (`api/controllers/projectController.cjs`):

```js
const fs = require('../utils/fileSystem.cjs');

exports.listProjects = (req, res) => {
  const projects = fs.loadAllProjects();
  // ... filtering, sorting
  res.json({ success: true, data: projects });
};
```

**Migrado** (`api/src/routes/projects.ts`):

```ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  const db = c.env.DB;
  const type = c.req.query('type');

  let results;

  if (type === 'gd') {
    results = await db.prepare('SELECT * FROM projects_gd ORDER BY date DESC').all();
  } else if (type === 'dev') {
    results = await db.prepare('SELECT * FROM projects_dev ORDER BY date DESC').all();
  } else {
    const gd = await db.prepare('SELECT *, "gd" as type FROM projects_gd').all();
    const dev = await db.prepare('SELECT *, "dev" as type FROM projects_dev').all();
    results = [...gd.results, ...dev.results];
  }

  // Parsear JSON fields
  const data = results.results.map((row) => ({
    ...row,
    imagenes: JSON.parse(row.imagenes),
    videos: JSON.parse(row.videos),
    extras: JSON.parse(row.extras),
    stack: row.stack ? JSON.parse(row.stack) : undefined,
    visible: Boolean(row.visible),
  }));

  return c.json({ success: true, data, count: data.length });
});

app.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const db = c.env.DB;

  let project = await db.prepare('SELECT * FROM projects_gd WHERE id = ?').bind(id).first();
  if (!project) {
    project = await db.prepare('SELECT * FROM projects_dev WHERE id = ?').bind(id).first();
  }

  if (!project) {
    return c.json({ success: false, error: 'Proyecto no encontrado' }, 404);
  }

  return c.json({
    success: true,
    data: {
      ...project,
      imagenes: JSON.parse(project.imagenes),
      videos: JSON.parse(project.videos),
      extras: JSON.parse(project.extras),
      stack: project.stack ? JSON.parse(project.stack) : undefined,
      visible: Boolean(project.visible),
    },
  });
});

export { app as projectsRouter };
```

### 4.4 Migrar upload (imagenes a R2)

**Original** (`api/controllers/uploadController.cjs`): Usaba `fs.writeFileSync` a `public/images/`.

**Migrado** (`api/src/routes/upload.ts`):

```ts
import { Hono } from 'hono';
import { stream } from 'hono/streaming';

const app = new Hono();

app.post('/', async (c) => {
  const formData = await c.req.formData();
  const type = formData.get('type') as string;
  const category = formData.get('category') as string;
  const title = formData.get('title') as string;
  const files = formData.getAll('images') as File[];

  if (!files || files.length === 0) {
    return c.json({ success: false, error: 'No images provided' }, 400);
  }

  const bucket = c.env.IMAGES_BUCKET;
  const uploaded = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split('.').pop();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const folder = type === 'gd' ? 'design' : 'web';
    const path = `images/portfolio/${folder}/${category}/${slug}${String(i + 1).padStart(3, '0')}.${ext}`;

    await bucket.put(path, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    uploaded.push({ ruta: `/${path}`, label: file.name });
  }

  return c.json({
    success: true,
    data: uploaded,
    message: `${files.length} imagen(es) subida(s) correctamente`,
  });
});

export { app as uploadRouter };
```

### 4.5 Migrar auth (kimoAuth)

**Original** (`api/middleware/kimoAuth.cjs`): Comparaba Bearer token con hash SHA-256.

**Migrado** (`api/src/middleware/auth.ts`):

```ts
import { createMiddleware } from 'hono/factory';

export const kimoAuth = createMiddleware(async (c, next) => {
  const hash = c.env.KIMO_PASSWORD_HASH;

  // Si no hay hash configurado, permitir (dev mode)
  if (!hash) {
    return next();
  }

  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token || token !== hash) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  return next();
});
```

### 4.6 Wrangler config

Crear `api/wrangler.toml`:

```toml
name = "portfolio-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
KIMO_PASSWORD_HASH = ""

[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "TU_DATABASE_ID"

[[r2_buckets]]
binding = "IMAGES_BUCKET"
bucket_name = "portfolio-images"
```

---

## Fase 5: Configurar el Frontend para Apuntar al Worker API

### 5.1 Actualizar apiClient.ts

**Original** (`src/api/apiClient.ts`): Usaba `http://localhost:3001`.

**Migrado**:

```ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Anadir auth si esta autenticado
  const token = localStorage.getItem('kimo-token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Error en la peticion');
  }

  return response.json();
}
```

### 5.2 Variables de entorno en Pages

En Cloudflare Dashboard > Pages > Settings > Environment variables:

| Variable | Valor (Production) | Valor (Preview/Dev) |
|----------|--------------------|--------------------|
| `VITE_API_BASE_URL` | `https://portfolio-api.tu-trabajador.workers.dev` | `http://localhost:8787` |
| `VITE_BOOK_COVERS_PATH` | `https://portfolio-images.tu-cuenta.r2.cloudflarestorage.com/books` | `http://localhost:8787/images/books` |
| `VITE_KIMO_PASSWORD_HASH` | (tu hash SHA-256) | (igual) |

---

## Fase 6: Desarrollo Local con Wrangler

### 6.1 Ejecutar el Worker localmente

```bash
cd api
wrangler dev
```

Esto arranca el Worker en `http://localhost:8787` con acceso a D1 y R2 locales.

### 6.2 D1 local (para desarrollo)

Wrangler crea automaticamente una base de datos local en `.wrangler/state/`. Para sembrar datos:

```bash
wrangler d1 execute portfolio-db --local --file=d1-schema.sql
```

### 6.3 Flujo de desarrollo completo

Terminal 1 (Frontend):
```bash
pnpm dev
```

Terminal 2 (Backend Worker):
```bash
cd api && wrangler dev
```

El frontend apunta a `localhost:5173` (Vite) y el API a `localhost:8787` (Wrangler).

---

## Fase 7: Deploy Final

### 7.1 Deploy del Worker API

```bash
cd api
wrangler deploy
```

### 7.2 Deploy del Frontend

```bash
pnpm build
wrangler pages deploy dist --project-name=portfolio
```

### 7.3 Verificar

1. Abrir `https://tu-proyecto.pages.dev`
2. Verificar que el frontend carga
3. Verificar que la API responde en `https://tu-api.tu-trabajador.workers.dev/health`
4. Verificar que las imagenes cargan desde R2
5. Probar login en `/kimo/login`
6. Probar CRUD de proyectos, libros, etc.

---

## Fase 8: Dominio Personalizado (Opcional)

1. Comprar dominio (ej: kimografico.com)
2. Anadir a Cloudflare (cambiar nameservers en el registrar)
3. En Pages: Custom domains > Add custom domain
4. En Workers: Routes > Anadir ruta `api.kimografico.com/*`

---

## Usar opencode en VS Code para la Migracion

### Preparacion

1. Instalar opencode extension en VS Code
2. Abrir el proyecto en VS Code
3. Tener `AGENTS.md` configurado (ya creado)

### Flujo de trabajo recomendado

**Paso 1: Migrar un controller a la vez**

Abrir opencode y pedir:

```
Migra el controller de projects de Express (CommonJS) a Hono (TypeScript) para Cloudflare Workers.
Usa D1 en lugar de archivos JSON. Sigue la estructura que hay en api/src/routes/projects.ts
```

opencode:
1. Leera el controller original (`api/controllers/projectController.cjs`)
2. Leera el utilitario de archivos (`api/utils/fileSystem.cjs`)
3. Creara la nueva ruta Hono con consultas D1
4. Actualizara los tipos TypeScript

**Paso 2: Migrar un endpoint a la vez**

```
Migra el endpoint POST /api/projects de Express a Hono con D1.
Incluye la generacion de thumbnails via R2 en lugar de filesystem.
```

**Paso 3: Migrar upload**

```
Migra el controller de upload para usar R2 en lugar de fs.writeFileSync.
El endpoint debe aceptar multipart/form-data y subir a R2.
```

**Paso 4: Testing**

```
Escribe tests para el endpoint GET /api/projects usando vitest y miniflare (D1 local).
```

### Comandos utiles en opencode

| Comando | Uso |
|---------|-----|
| `Migra X de Express a Hono` | Convierte un controller/ruta |
| `Crea el endpoint Y en Hono con D1` | Genera un endpoint nuevo |
| `Actualiza wrangler.toml` | Configura bindings |
| `Escribe tests para X` | Genera tests con vitest + miniflare |
| `Sube las imagenes a R2` | Script de migracion de imagenes |
| `Verifica que la API funcione` | Tests de integracion |

---

## Resumen de Cambios de Architectura

| Aspecto | Antes (Local) | Despues (Cloudflare) |
|---------|---------------|----------------------|
| Frontend | GitHub Pages | Cloudflare Pages |
| Backend | Express en Node.js | Hono en Workers (V8 isolates) |
| Base de datos | JSON files en disco | D1 (SQLite edge) |
| Almacenamiento imagenes | `public/images/` en disco | R2 (object storage) |
| Auth | SHA-256 hash en `.env` | SHA-256 hash en Secrets |
| Thumbnails | Sharp + child process | Cloudflare Images Transform oSharp via WASM |
| Puerto | 3001 | 8787 (local), automatico (produccion) |
| CORS | Configurado manualmente | `hono/cors` middleware |
| Deploy | `pnpm build` + manual | Git push automatico o `wrangler deploy` |

---

## Limitaciones y Consideraciones

1. **Workers tiene 128MB de memoria** por invocacion. Para thumbnails pesados, considerar Cloudflare Images Transform.

2. **D1 es SQLite**: No soporta operaciones concurrentes de escritura intensiva. Para un portfolio personal es mas que suficiente.

3. **R2 no tiene CDN integrado** como S3+CloudFront. Para imagenes, el Worker las sirve con cache headers.

4. **Wrangler dev** no es identico a produccion. Siempre testear en Pages/Workers real antes de marcar como completado.

5. **Los JSONs originales quedan como backup** en el repositorio. No borrar hasta verificar que D1 funciona correctamente.

6. **Coste estimado**: $0/mes dentro del free tier (100K requests/dia es mas que suficiente para un portfolio).
