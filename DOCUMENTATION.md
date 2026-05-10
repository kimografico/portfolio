# Documentación técnica y funcional — kimografico

## Índice

1. Arquitectura general
2. Portfolio de Diseño Gráfico
3. Portfolio de Desarrollo Web
4. Sección privada /kimo
5. Biblioteca de libros
6. Lugares visitados
7. Ilustraciones
8. Galería de iconos
9. CV / Curriculum
10. Contacto
11. Backend API REST
12. Guía de desarrollo
13. CI/CD y pipeline
14. Roadmap y tests pendientes
15. FAQ

---

## 1. Arquitectura general

### Diagrama de capas

```
JSON estáticos (src/data/)
        ↓
Importación directa en componentes de página
        ↓
Custom hooks (useTheme, useTableSorting, useShowHidden)
        ↓
Componentes: ui/ → compositions/ → layout/ → pages/
        ↓
React Router v6 (App.tsx)
        ↓
Vite build → GitHub Pages
```

El backend Express es independiente del flujo de producción. Solo se usa en desarrollo local para operaciones de escritura (CRUD de proyectos, subida de imágenes).

### Flujo de datos

- Los datos del portfolio son **JSON estáticos** en data. Se importan con `import data from './archivo.json'` directamente en los componentes de página o en los archivos de configuración de galerías.
- En producción no hay llamadas a API. Todo el contenido está en el bundle.
- El backend Express (puerto 3001) solo se usa en local para el panel de administración `/kimo/data`, `/kimo/add-project`, `/kimo/edit-project/:id` y `/kimo/recent-works`.

### Sistema de componentes

El proyecto usa una jerarquía estricta de cuatro capas:

| Capa            | Carpeta      | Descripción                                                 |
| --------------- | ------------ | ----------------------------------------------------------- |
| `ui/`           | ui           | Componentes atómicos: UIButton, ProjectCard, CategoryCard   |
| `compositions/` | compositions | Composiciones con lógica: BaseTable, BookModal, BooksFilter |
| `layout/`       | layout       | Estructura de página: MainLayout, MainHeader, HeroSection   |
| `pages/`        | pages        | Páginas completas conectadas al router                      |

**Regla de oro:** una capa solo puede importar de capas inferiores. `ui/` no puede importar de `compositions/`.

### Sistema de estilos

- **Tailwind CSS** para la mayoría de las utilidades de layout y spacing.
- **Variables CSS** centralizadas en variables.css para colores, fuentes y espaciados.
- **Archivos CSS externos** por componente cuando los estilos son complejos (books.css, espacio-personal.css, MainHeader.css…).
- **Modo claro/oscuro** implementado con `data-theme` en el elemento `<html>`, gestionado por el hook `useTheme`.

#### Variables CSS principales

```css
/* Tema claro (defecto) */
:root {
  --color-bg: #f8f7f4;
  --color-surface: #ffffff;
  --color-text: #1a1917;
  --color-muted: #9e9c96;
  --color-accent: #d4542a;
  --color-dev: #225cba;
  --color-design: #ea920e;
  --color-cta: #008d4b;
}

/* Tema oscuro */
[data-theme='dark'] {
  --color-bg: #1e1e1e;
  --color-surface: #2a2a2a;
  --color-text: #e8e8e8;
  /* ... */
}
```

---

## 2. Portfolio de Diseño Gráfico

### ¿Qué hace?

Muestra el trabajo de diseño gráfico organizado en 8 categorías. El visitante puede navegar por las categorías, ver todos los proyectos de una categoría en una galería de tarjetas, y acceder al detalle de cada proyecto con todas sus imágenes.

### ¿Cómo se usa? (usuario)

1. Entra en `/graphic-design` → ve las 8 categorías disponibles.
2. Hace clic en una categoría → ve la galería de proyectos de esa categoría.
3. Hace clic en un proyecto → ve el detalle con imágenes, descripción y cliente.

### Categorías disponibles

| Categoría            | Ruta URL                               | JSON fuente               |
| -------------------- | -------------------------------------- | ------------------------- |
| Logotipos            | `/graphic-design/logotipos`            | logotipos.json            |
| Papelería            | `/graphic-design/papeleria`            | papeleria.json            |
| Cartelería           | `/graphic-design/carteleria`           | carteleria.json           |
| Multimedia           | `/graphic-design/multimedia`           | multimedia.json           |
| Packaging            | `/graphic-design/packaging`            | packaging.json            |
| Proyectos especiales | `/graphic-design/proyectos-especiales` | proyectos-especiales.json |
| Etiquetas            | `/graphic-design/etiquetas`            | etiquetas.json            |
| Editorial            | `/graphic-design/editorial`            | editorial.json            |

### Modelo de datos

```typescript
interface GraphicDesignProject {
  id: number; // ID único del proyecto
  date: string; // Fecha en formato "YYYY-MM-DD HH:mm"
  title: string; // Título del proyecto
  cliente: string; // Nombre del cliente
  descripcion: string; // Descripción del proyecto
  imagenes: {
    image: string; // Nombre del archivo de imagen
    label: string; // Descripción de la imagen
  }[];
  videos?: {
    image: string; // Nombre del archivo de vídeo o thumbnail
    label: string;
  }[];
  extras?: unknown[]; // Datos adicionales variables por proyecto
}
```

### ¿Cómo se añade un proyecto?

1. Sube las imágenes a `public/images/portfolio/design/[categoria]/`.
2. Abre el JSON de la categoría correspondiente (ej: logotipos.json).
3. Añade un nuevo objeto al array con el siguiente formato:
   ```json
   {
     "id": 1234,
     "date": "2025-01-15 10:00",
     "title": "Nombre del proyecto",
     "cliente": "Nombre del cliente",
     "descripcion": "Descripción breve del proyecto.",
     "imagenes": [{ "image": "nombre-archivo.jpg", "label": "Descripción de la imagen" }]
   }
   ```
4. Guarda y verifica en local con `pnpm dev`.

> También puedes usar el panel de administración `/kimo/add-project` con el backend activo.

### Componentes involucrados

| Componente                   | Ruta                           | Responsabilidad                        |
| ---------------------------- | ------------------------------ | -------------------------------------- |
| `GraphicDesignHome`          | GraphicDesignHome.tsx          | Muestra las categorías disponibles     |
| `CategoryGalleryPage`        | CategoryGalleryPage.tsx        | Galería genérica de proyectos          |
| `GraphicDesignProjectDetail` | GraphicDesignProjectDetail.tsx | Detalle de un proyecto                 |
| `CategoryCard`               | CategoryCard.tsx               | Tarjeta de categoría en la home        |
| `ProjectCard`                | ProjectCard.tsx                | Tarjeta de proyecto en la galería      |
| `graphicDesignGalleries`     | graphicDesignGalleries.tsx     | Configuración centralizada de galerías |

---

## 3. Portfolio de Desarrollo Web

### ¿Qué hace?

Muestra proyectos de desarrollo web en 3 categorías. Comparte la misma arquitectura que el portfolio de diseño gráfico (`CategoryGalleryPage` genérico).

### Categorías disponibles

| Categoría  | Ruta URL          | JSON fuente     |
| ---------- | ----------------- | --------------- |
| Vanilla JS | `/dev/vanilla`    | vanilla.json    |
| WordPress  | `/dev/wordpress`  | wordpress.json  |
| Frameworks | `/dev/frameworks` | frameworks.json |

### Componentes involucrados

| Componente               | Ruta                       | Responsabilidad              |
| ------------------------ | -------------------------- | ---------------------------- |
| `DeveloperHome`          | DeveloperHome.tsx          | Muestra las 3 categorías     |
| `CategoryGalleryPage`    | CategoryGalleryPage.tsx    | Galería genérica reutilizada |
| `DeveloperProjectDetail` | DeveloperProjectDetail.tsx | Detalle de un proyecto web   |
| `developerGalleries`     | developerGalleries.tsx     | Configuración centralizada   |

---

## 4. Sección privada /kimo

### ¿Qué hace?

Es el espacio personal del autor. Accesible en `/kimo`, contiene herramientas personales y de gestión de contenido: biblioteca de libros, registro de viajes, ilustraciones, galería de iconos, gestión del CV y panel de administración de proyectos.

### Privacidad

- La ruta `/kimo` **no está protegida con autenticación**. Está simplemente no enlazada desde la navegación pública.
- robots.txt incluye `Disallow: /kimo` para excluirla de la indexación.
- No hay noindex en el HTML (pendiente de revisión).

### Subrutas disponibles

| Ruta                      | Descripción                                 |
| ------------------------- | ------------------------------------------- |
| `/kimo` o `/kimo/books`   | Biblioteca de libros leídos                 |
| `/kimo/places`            | Mapa + tabla de lugares visitados           |
| `/kimo/ilustraciones`     | Galería de ilustraciones personales         |
| `/kimo/ilustraciones/:id` | Detalle de una ilustración                  |
| `/kimo/iconos`            | Galería de todos los iconos del proyecto    |
| `/kimo/resume`            | Gestor del CV                               |
| `/kimo/data`              | Tabla de gestión de todos los proyectos     |
| `/kimo/pendiente`         | Proyectos pendientes de publicar            |
| `/kimo/add-project`       | Formulario para crear un proyecto           |
| `/kimo/edit-project/:id`  | Formulario para editar un proyecto          |
| `/kimo/recent-works`      | Gestor de proyectos recientes de la landing |

### Componente de layout

`KimoLayout` (KimoLayout.tsx) actúa como layout padre con `<Outlet>`. Renderiza la navegación interna con iconos y texto responsivo.

---

## 5. Biblioteca de libros

### ¿Qué hace?

Muestra el historial de libros leídos por el autor. Permite alternar entre **vista galería** (portadas de libros) y **vista tabla**. Incluye filtros y un modal de detalle al hacer clic en una portada.

### ¿Cómo se usa? (usuario)

1. Entra en `/kimo/books`.
2. Alterna entre "Tabla" y "Galería" con los botones de toggle.
3. En la galería, usa los filtros para buscar por género, idioma, etc.
4. Haz clic en una portada para ver el modal con todos los datos del libro.

### Modelo de datos (books.json)

```typescript
interface Book {
  id: string; // ID único, usado también como nombre del archivo de portada
  title: string; // Título del libro
  author: string; // Autor
  language: string; // "Español", "Inglés", etc.
  cover: string; // Nombre del archivo de portada (puede ser vacío)
  dateRead: string; // Fecha de lectura en formato "YYYY-MM" (puede ser vacío)
  genre: string; // Género literario
  isbn: string; // ISBN-13 para fallback con OpenLibrary
  series: string; // Serie a la que pertenece (puede ser vacío)
  synopsis: string; // Sinopsis del libro
}
```

### ¿Cómo se añade un libro?

1. (Opcional) Añade la portada en books con el nombre `{id}.jpg`.
2. Abre books.json.
3. Añade un nuevo objeto al array:
   ```json
   {
     "id": "nombre-del-libro",
     "title": "Nombre del libro",
     "author": "Nombre del autor",
     "language": "Español",
     "cover": "",
     "dateRead": "2025-03",
     "genre": "Aventuras",
     "isbn": "9788467035544",
     "series": "",
     "synopsis": "Sinopsis del libro."
   }
   ```
4. Si no pones portada, se mostrará `_blank.jpg` como fallback.

### Comportamientos especiales

- La galería se ordena por `dateRead` descendente (más reciente primero). Los libros sin fecha van al final.
- Si `cover` está vacío o es solo espacios, se usa `{id}.jpg` como nombre. Si la imagen falla al cargar, se muestra `_blank.jpg`.
- La fecha se formatea como "Mes de YYYY" (ej: "Marzo de 2025") usando las APIs nativas de JavaScript.
- El idioma se representa con bandera emoji: 🇪🇸 (español), 🇬🇧 (inglés).
- Al abrir el modal, se bloquea el scroll del body y se añade padding-right para compensar el scrollbar.

### Componentes involucrados

| Componente     | Ruta             | Responsabilidad                     |
| -------------- | ---------------- | ----------------------------------- |
| `BooksPage`    | BooksPage.tsx    | Contenedor con toggle tabla/galería |
| `BooksGallery` | BooksGallery.tsx | Galería de portadas con modal       |
| `BooksTable`   | BooksTable.tsx   | Tabla ordenable de libros           |
| `BookModal`    | BookModal.tsx    | Modal de detalle del libro          |
| `BooksFilter`  | BooksFilter.tsx  | Filtros de la galería               |

---

## 6. Lugares visitados

### ¿Qué hace?

Muestra un mapa vectorial con los países visitados resaltados y puntos de interés, junto con una tabla con todos los registros de viajes ordenable por columnas.

### Modelo de datos (places.json)

```typescript
interface Place {
  country: string; // Código ISO 2 letras en minúscula (ej: "es", "fr")
  city: string; // Comunidad/región o ciudad principal
  place: string; // Nombre del lugar o evento visitado
  date: string; // Fecha en formato "YYYY / MM" o solo "YYYY"
  people: string; // Con quién se visitó (puede ser vacío)
}
```

### ¿Cómo se añade un lugar?

1. Abre places.json.
2. Añade un nuevo objeto:
   ```json
   {
     "city": "Cataluña",
     "place": "Barcelona",
     "country": "es",
     "date": "2025 / 06",
     "people": "Familia"
   }
   ```
3. Si el país no está en el mapa, añade su código ISO al array de `highlightedCountries` (se extrae automáticamente desde el JSON).
4. Para añadir un marcador en el mapa, añade las coordenadas en places_markers.json.

### Comportamientos especiales

- La tabla se ordena por defecto por fecha descendente (más reciente primero).
- Las ciudades con valor "Valencia" o "Comunidad Valenciana" se muestran en gris claro para distinguirlas visualmente (lugar de residencia).
- Los países sin código en la columna se representan con emoji de bandera.
- España (`es`) no muestra bandera (es el país de residencia, se omite para no saturar).

### Componentes involucrados

| Componente        | Ruta                | Responsabilidad                      |
| ----------------- | ------------------- | ------------------------------------ |
| `PlacesPage`      | PlacesPage.tsx      | Contenedor de mapa + tabla           |
| `PlacesTable`     | PlacesTable.tsx     | Tabla ordenable de lugares           |
| `VisitedWorldMap` | VisitedWorldMap.tsx | Mapa vectorial con países resaltados |

---

## 7. Ilustraciones

### ¿Qué hace?

Galería de ilustraciones personales del autor. Permite navegar entre ilustraciones y ver el detalle de cada una con imágenes extra (mockups, procesos, etc.).

### Modelo de datos (illustrations.json)

```typescript
interface Illustration {
  id: string; // ID único
  nombre: string; // Nombre de la ilustración
  image: string; // Archivo de imagen principal
  fecha?: string; // Fecha en formato "MM/YYYY"
  cliente?: string; // Cliente (opcional)
  descripcion?: string; // Descripción del trabajo
  imagenesExtra?: {
    image: string; // Nombre del archivo extra
    label: string; // Descripción de la imagen extra
  }[];
}
```

### Componentes involucrados

| Componente               | Ruta                       | Responsabilidad            |
| ------------------------ | -------------------------- | -------------------------- |
| `IllustrationsPage`      | IllustrationsPage.tsx      | Galería principal          |
| `IllustrationsGallery`   | IllustrationsGallery.tsx   | Grid de tarjetas           |
| `IllustrationDetailPage` | IllustrationDetailPage.tsx | Detalle con imágenes extra |

---

## 8. Galería de iconos

### ¿Qué hace?

Muestra todos los iconos SVG del proyecto en una cuadrícula. Es una herramienta para desarrolladores, no una sección pública.

### Tipos de iconos

- **Iconos de línea** (prefijo `Icon`): reciben `strokeWidth`, clase `text-primary` y efecto hover con línea blanca.
- **Logos** (prefijo `Logo`): solo reciben clase `fill-primary`. Sin `strokeWidth` ni efectos de línea en hover.

### Comportamiento especial

Los logos se detectan por el nombre del componente (`name.startsWith('Logo')`). El CSS aplica los efectos de hover solo a los SVG que **no** tienen el atributo `data-logo`.

---

## 9. CV / Curriculum

### ¿Qué hace?

El autor tiene dos versiones del CV (diseño gráfico y desarrollo frontend), accesibles en `/resume/design` y `/resume/development`. Son páginas de solo lectura generadas a partir de resume.json.

El panel `/kimo/resume` permite editar el CV inline, con toggles para marcar qué items son relevantes para diseño y cuáles para desarrollo.

---

## 10. Contacto

### ¿Qué hace?

Página simple con enlace a un formulario externo (Google Forms) y accesos directos a los dos CVs del autor.

**No hay formulario de contacto integrado en el backend.** El formulario apunta a un servicio externo.

---

## 11. Backend API REST

### ¿Para qué sirve?

Es un servidor Express local (server.cjs) que expone una API REST para operaciones de escritura sobre los JSONs del portfolio. Solo se usa en desarrollo local desde el panel `/kimo`.

### Endpoints principales

| Método | Ruta                | Descripción                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/api/projects`     | Lista proyectos con filtros  |
| GET    | `/api/projects/:id` | Obtiene un proyecto por ID   |
| POST   | `/api/projects`     | Crea un nuevo proyecto       |
| PUT    | `/api/projects/:id` | Actualiza un proyecto        |
| DELETE | `/api/projects/:id` | Elimina un proyecto          |
| POST   | `/api/upload`       | Sube una imagen al servidor  |
| GET    | `/api/recent-works` | Lista trabajos recientes     |
| PUT    | `/api/recent-works` | Actualiza trabajos recientes |
| GET    | `/api/resume`       | Obtiene el CV                |
| PUT    | `/api/resume`       | Actualiza el CV              |

### Arranque

```sh
# Con recarga automática (desarrollo)
pnpm backend:dev

# O frontend + backend juntos
pnpm start
```

---

## 12. Guía de desarrollo

### Añadir un nuevo componente

1. Crea una carpeta en la capa correspondiente (`ui/`, `compositions/`, `layout/`).
2. Crea el archivo `.tsx` del componente.
3. Si tiene estilos propios, crea un archivo `.css` con el mismo nombre.
4. Crea la story de Storybook en `src/components/stories/[capa]/[Componente].stories.tsx`.
5. Añade el atributo `data-id` al elemento raíz del componente.

### Añadir una nueva página/ruta

1. Crea el componente de página en `src/pages/[Seccion]/`.
2. Importa y añade la ruta en App.tsx.
3. Si requiere navegación, añade el enlace en MainHeader.tsx o en el layout correspondiente.

### Añadir un nuevo tipo de dato (nueva sección de portfolio)

1. Define la interfaz TypeScript en interfaces.
2. Crea el JSON de datos en data.
3. Si es una galería de portfolio, añade la configuración en graphicDesignGalleries.tsx o `developerGalleries.tsx`.
4. Añade la ruta en App.tsx (se generan dinámicamente desde la configuración).

### Convenciones de nombrado

| Elemento            | Convención       | Ejemplo                   |
| ------------------- | ---------------- | ------------------------- |
| Componentes         | PascalCase       | `BookModal.tsx`           |
| Hooks               | camelCase        | useTheme.ts               |
| Utilidades          | camelCase        | `resumeFactories.ts`      |
| Archivos CSS        | mismo nombre     | `BookModal.css`           |
| Interfaces          | PascalCase       | `interface Book {}`       |
| Atributos data-id   | kebab-case       | `data-id="books-gallery"` |
| Constantes globales | UPPER_SNAKE_CASE | `APP_BASENAME`            |

---

## 13. CI/CD y pipeline

### GitHub Actions (`deploy.yml`)

Se dispara en cada push a `main`. Pasos:

1. **Checkout** — descarga el código.
2. **Setup pnpm v9** — instala el gestor de paquetes.
3. **Setup Node.js v20** — con caché de dependencias.
4. **Install** — `pnpm install --frozen-lockfile` (reproducible).
5. **Lint** — `pnpm lint` (falla si hay errores ESLint).
6. **Type check** — `pnpm typecheck` (falla si hay errores TypeScript).
7. **Tests** — `pnpm test` (falla si hay tests que no pasan).
8. **Build** — `pnpm run build`.
9. **Prepara artifact** — copia `404.html` a dist.
10. **Upload + Deploy** — despliega en GitHub Pages.

### Script de pre-push local (check.js)

Ejecuta el mismo flujo en local: lint → typecheck → test → auditoría de imágenes → build.

```sh
pnpm check
```

### Auditoría de imágenes (check-images.js)

Revisa recursivamente images:

- **Warning** si una imagen pesa más de 1MB.
- **Error** (falla el pipeline) si una imagen pesa más de 2.5MB.

### Husky + lint-staged

En cada commit, se ejecutan automáticamente:

- `eslint --fix` + `prettier --write` sobre archivos `.ts` y `.tsx` staged.
- `prettier --write` sobre archivos `.json` staged.

---

## 14. Roadmap y tests pendientes

Ver [TESTS.md](.TESTS.md) para el plan completo de tests. Incluye:

- Hooks: `useTheme`, `useTableSorting`, `useShowHidden`
- Componentes: `BaseTable`, `BookModal`, `BooksFilter`, `UIButton`, `MobileMenu`…
- Páginas públicas: `Home`, `GraphicDesignHome`, `DeveloperHome`, `ContactMe`
- Páginas `/kimo`: `BooksPage`, `PlacesPage`, `IllustrationsPage`
- Cliente API y backend (pendiente de supertest)
- Tests E2E (pendiente)

**Cobertura actual:** ~11% global (solo 3 archivos de test existen actualmente). La configuración ya exige un mínimo del 80% cuando se escriban los tests.

---

## 15. FAQ

**¿Por qué JSON en lugar de una base de datos?**  
Es un portfolio estático desplegado en GitHub Pages, que no permite backend persistente. Los JSON son suficientes para el volumen de datos y simplifican el despliegue.

**¿Por qué GitHub Pages y no Vercel o Netlify?**  
Porque son gratuitos para proyectos públicos y la integración con GitHub Actions es directa. La limitación es que no hay SSR, pero el portfolio es una SPA y no lo necesita.

**¿Cómo funciona el modo oscuro?**  
El hook `useTheme` aplica el atributo `data-theme="dark"` en el `<html>`. Las variables CSS de variables.css cambian automáticamente. Todos los componentes que usan el hook se sincronizan gracias a un store compartido a nivel de módulo (sin Context).

**¿Cómo añado una nueva categoría de portfolio?**  
Crea el JSON en graphic-design (o `development/`), y añade la configuración en graphicDesignGalleries.tsx (o `developerGalleries.tsx`). Las rutas se generan automáticamente en App.tsx.

**¿La sección /kimo tiene autenticación?**  
No. Solo está oculta de la navegación y excluida de los robots. Si alguien conoce la URL, puede acceder. Es un panel de uso personal.

**¿Qué pasa si la portada de un libro no existe?**  
Se muestra `_blank.jpg` como fallback. La lógica está en BooksGallery.tsx con el estado `imgErrors` y el handler `onError` de `<img>`.

**¿Por qué los iconos de línea y los logos tienen estilos distintos?**  
Los logos sólidos (prefijo `Logo`) no deben recibir `strokeWidth` ni efectos de línea porque están diseñados con relleno. Se distinguen por nombre en el render y por el atributo `data-logo` en el CSS.

```

---

## Resumen de lo documentado

**Secciones funcionales encontradas e incluidas:**
- Portfolio de diseño gráfico (8 categorías, galería, detalle)
- Portfolio de desarrollo web (3 categorías, galería, detalle)
- Sección `/kimo` completa: biblioteca de libros, lugares visitados, ilustraciones, galería de iconos, CV, panel de administración
- Página de contacto (enlace a Google Forms + CVs)
- Backend API REST (CRUD de proyectos e imágenes)
- Sistema de temas claro/oscuro
- CI/CD con GitHub Actions
- Scripts de calidad y auditoría de imágenes

## Lo que no pude documentar completamente

- El panel `/kimo/data` (`DataPage.tsx`) y `/kimo/add-project` son complejos (800+ líneas). Solo se documenta su propósito general.
- El gestor de CV (`ResumeManagerPage.tsx`, 661 líneas) no se ha leído en detalle.
- El backend de subida de imágenes (`uploadController.cjs`) no se exploró en profundidad.

## Advertencias detectadas

1. **`src/pages/Home.tsx`** existe como archivo suelto y también hay intentos de leer `src/pages/Home/index.tsx` (que no existe). Conviene revisar si hay consistencia.
2. **La sección `/kimo` no tiene autenticación** — cualquiera con la URL puede acceder al panel de administración.
3. **El script `imagecheck` en `package.json`** apunta a `scripts/imagecheck.cjs` pero el archivo generado se llama `check-images.js`. Revisar si son el mismo script.
4. **`test` en `package.json`** es `vitest --run` (sin `--coverage`), distinto de lo que llama `check.js` internamente con `['test']`. La cobertura podría no ejecutarse siempre.---

## Resumen de lo documentado

**Secciones funcionales encontradas e incluidas:**
- Portfolio de diseño gráfico (8 categorías, galería, detalle)
- Portfolio de desarrollo web (3 categorías, galería, detalle)
- Sección `/kimo` completa: biblioteca de libros, lugares visitados, ilustraciones, galería de iconos, CV, panel de administración
- Página de contacto (enlace a Google Forms + CVs)
- Backend API REST (CRUD de proyectos e imágenes)
- Sistema de temas claro/oscuro
- CI/CD con GitHub Actions
- Scripts de calidad y auditoría de imágenes

## Lo que no pude documentar completamente

- El panel `/kimo/data` (`DataPage.tsx`) y `/kimo/add-project` son complejos (800+ líneas). Solo se documenta su propósito general.
- El gestor de CV (`ResumeManagerPage.tsx`, 661 líneas) no se ha leído en detalle.
- El backend de subida de imágenes (`uploadController.cjs`) no se exploró en profundidad.

## Advertencias detectadas

1. **`src/pages/Home.tsx`** existe como archivo suelto y también hay intentos de leer `src/pages/Home/index.tsx` (que no existe). Conviene revisar si hay consistencia.
2. **La sección `/kimo` no tiene autenticación** — cualquiera con la URL puede acceder al panel de administración.
3. **El script `imagecheck` en `package.json`** apunta a `scripts/imagecheck.cjs` pero el archivo generado se llama `check-images.js`. Revisar si son el mismo script.
4. **`test` en `package.json`** es `vitest --run` (sin `--coverage`), distinto de lo que llama `check.js` internamente con `['test']`. La cobertura podría no ejecutarse siempre.
```
