## README.md

# Portfolio — kimografico

> Portfolio personal de diseño gráfico y desarrollo web, con espacio privado de gestión de contenido.

![Deploy](https://github.com/kimografico/portfolio/actions/workflows/deploy.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6)
![Vite](https://img.shields.io/badge/Vite-8-646cff)

---

## ✨ Características

- Portfolio de **diseño gráfico** con 8 categorías (logotipos, papelería, cartelería, multimedia, packaging, etiquetas, editorial, proyectos especiales)
- Portfolio de **desarrollo web** con 3 categorías (Vanilla JS, WordPress, Frameworks)
- Sección privada `/kimo`: biblioteca de libros, lugares visitados con mapa interactivo, ilustraciones y gestión de CV
- **Modo claro/oscuro** persistido en `localStorage`, sincronizado globalmente sin Context
- **Backend Express** local para CRUD de proyectos y subida de imágenes
- **Storybook** con stories para todos los componentes y addon de accesibilidad
- **CI/CD** automático a GitHub Pages con auditoría de tamaño de imágenes

---

## 🛠️ Stack tecnológico

### Frontend

| Tecnología               | Versión | Propósito                                 |
| ------------------------ | ------- | ----------------------------------------- |
| React                    | 18      | UI y componentes                          |
| TypeScript               | ~6.0    | Tipado estático                           |
| Vite                     | 8       | Bundler y servidor de desarrollo          |
| React Router             | 6       | Navegación SPA                            |
| TanStack Table           | 8       | Tablas ordenables y filtrables            |
| Tailwind CSS             | 3       | Utilidades CSS                            |
| jsvectormap              | 1.7     | Mapa vectorial interactivo                |
| Vitest + Testing Library | 4       | Tests unitarios e integración             |
| Storybook                | 10      | Documentación y desarrollo de componentes |

### Backend

| Tecnología   | Versión | Propósito                                |
| ------------ | ------- | ---------------------------------------- |
| Node.js      | ≥18     | Runtime                                  |
| Express      | 4       | Framework HTTP                           |
| multer       | 2.1     | Subida de imágenes (multipart/form-data) |
| cors         | 2.8     | CORS para desarrollo local con Vite      |
| dotenv       | 16      | Variables de entorno                     |
| nodemon      | 3       | Recarga automática en desarrollo         |
| concurrently | 8       | Frontend + backend en paralelo           |

---

## 📁 Estructura del proyecto

```
portfolio/
├── api/                      # Backend Express (CommonJS)
│   ├── server.cjs            # Punto de entrada del servidor
│   ├── routes/               # projects, upload, recent-works, resume
│   ├── controllers/          # Lógica CRUD e imágenes
│   ├── middleware/           # errorHandler.cjs
│   └── utils/                # fileSystem.cjs, validation.cjs
├── public/
│   ├── images/
│   │   ├── books/            # Portadas de libros (nombre = id del libro)
│   │   ├── illustrations/    # Imágenes de ilustraciones
│   │   ├── portfolio/        # Imágenes de proyectos (design/ y web/)
│   │   └── ui/               # Imágenes de interfaz
│   └── robots.txt            # Excluye /kimo de indexación
├── scripts/
│   ├── check.js              # Pre-push: lint + typecheck + test + images + build
│   ├── check-images.js       # Auditoría de tamaño de imágenes
│   └── generate-thumbs.cjs   # Generador de thumbnails
├── src/
│   ├── api/                  # apiClient.ts — cliente fetch
│   ├── components/
│   │   ├── compositions/     # BaseTable, BookModal, BooksFilter, VisitedWorldMap…
│   │   ├── iconos/           # ~70 iconos SVG como componentes React
│   │   ├── layout/           # MainLayout, MainHeader, MainFooter, HeroSection…
│   │   ├── resume/           # Filas editables del CV (SkillRow, CourseRow…)
│   │   ├── stories/          # Stories de Storybook por categoría
│   │   └── ui/               # UIButton, ProjectCard, CategoryCard…
│   ├── data/
│   │   ├── kimo/             # books.json, places.json, illustrations.json, places_markers.json
│   │   ├── graphic-design/   # 8 JSONs de categorías de diseño
│   │   ├── development/      # 3 JSONs de categorías de desarrollo
│   │   ├── config/           # app.ts, graphicDesignGalleries.tsx, developerGalleries.tsx
│   │   ├── recent-works.json # Proyectos destacados para la landing
│   │   └── resume.json       # Datos del CV
│   ├── hooks/                # useTheme, useTableSorting, useShowHidden
│   ├── interfaces/           # Tipos TypeScript centralizados
│   ├── pages/                # Home, GraphicDesign, Developer, Kimo, ContactMe…
│   ├── styles/               # CSS global y por componente
│   └── types/                # Tipos auxiliares
├── tests/                    # Tests con Vitest + Testing Library
├── .github/
│   ├── workflows/deploy.yml  # CI/CD hacia GitHub Pages
│   ├── agents/               # Agentes Copilot personalizados
│   └── skills/               # Skills de Copilot
├── vite.config.ts
├── vitest.config.ts
└── package.json
```

---

## 🚀 Inicio rápido

### Prerrequisitos

- **Node.js** ≥ 18
- **pnpm** ≥ 9

### Instalación

```sh
# 1. Clona el repositorio
git clone https://github.com/kimografico/portfolio.git
cd portfolio

# 2. Instala dependencias
pnpm install

# 3. Copia las variables de entorno del backend
cp .env.example api/.env

# 4. Inicia frontend + backend en paralelo
pnpm start
```

El frontend estará en `http://localhost:5173/portfolio/`  
El backend en `http://localhost:3001`

Para solo el frontend:

```sh
pnpm dev
```

### Variables de entorno

| Variable                | Propósito                             | Obligatoria | Ejemplo                   |
| ----------------------- | ------------------------------------- | ----------- | ------------------------- |
| `PORT`                  | Puerto del servidor Express           | No          | `3001`                    |
| `VITE_API_URL`          | URL del backend para el cliente fetch | Sí (local)  | `http://localhost:3001`   |
| `VITE_BOOK_COVERS_PATH` | Ruta base para portadas de libros     | Sí          | `/portfolio/images/books` |

---

## 📋 Scripts disponibles

| Script            | Comando                            | Cuándo usarlo                                                |
| ----------------- | ---------------------------------- | ------------------------------------------------------------ |
| `dev`             | `vite`                             | Desarrollo frontend                                          |
| `build`           | `tsc -b && vite build`             | Compilar para producción                                     |
| `preview`         | `vite preview`                     | Previsualizar el build                                       |
| `lint`            | `eslint .`                         | Detectar errores de código                                   |
| `typecheck`       | `tsc --noEmit`                     | Verificar tipos TypeScript                                   |
| `test`            | `vitest --run`                     | Ejecutar tests una vez                                       |
| `test:watch`      | `vitest`                           | Tests en modo watch                                          |
| `check`           | `node scripts/check.js`            | Pipeline completo pre-push (lint + typecheck + test + build) |
| `storybook`       | `storybook dev -p 6006`            | Lanzar Storybook                                             |
| `build-storybook` | `storybook build`                  | Compilar Storybook estático                                  |
| `backend:fixed`   | `node api/server.cjs`              | Iniciar backend                                              |
| `backend`         | `nodemon api/server.cjs`           | Backend con recarga automática                               |
| `start`           | `concurrently "pnpm dev" "..."`    | Frontend + backend en paralelo                               |
| `thumbs`          | `node scripts/generate-thumbs.cjs` | Generar thumbnails de todas las imágenes                     |
| `thumbs:new`      | `... --new`                        | Thumbnails solo de imágenes nuevas                           |

---

## 🎨 Storybook

```sh
pnpm storybook
# → http://localhost:6006
```

Incluye stories para `ui/`, `layout/`, `compositions/`, `resume/` y addon de accesibilidad a11y.

---

## 🧪 Tests

```sh
pnpm test          # Una vez
pnpm test:watch    # Modo watch
```

Los tests están en tests. La cobertura mínima exigida es **80%** en statements, branches, functions y lines.  
Ver TESTS.md para el plan completo.

---

## 🚢 Despliegue

Despliegue automático a **GitHub Pages** al hacer push a `main`.

**Pipeline (deploy.yml):**

1. Checkout del código
2. Setup pnpm v9 + Node.js v20 (con caché)
3. `pnpm install --frozen-lockfile`
4. Lint → Typecheck → Tests → **Auditoría de imágenes** → Build
5. Copia 404.html a dist (para manejo de rutas en GitHub Pages)
6. Sube y despliega artifact en GitHub Pages

---

## 📄 Licencia

Proyecto personal — todos los derechos reservados.
