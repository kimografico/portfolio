# spec.md — kimografico (nueva web)

---

## Índice

1. [Visión general](#1-visión-general)
2. [Arquitectura](#2-arquitectura)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Modelos de datos](#4-modelos-de-datos)
5. [Rutas](#5-rutas)
6. [CI/CD](#6-cicd)
7. [Fases de desarrollo](#7-fases-de-desarrollo)

---

## 1. Visión general

Portfolio personal y espacio privado de Kimo (diseñador gráfico y desarrollador de software). La web tiene tres secciones con propósitos distintos:

| Sección                     | Visibilidad          | Propósito                                     |
| --------------------------- | -------------------- | --------------------------------------------- |
| Portfolio de diseño gráfico | Pública              | Mostrar trabajos de diseño a clientes         |
| Portfolio de desarrollo     | Pública              | Mostrar proyectos de software                 |
| Espacio personal            | Oculta (no indexada) | Libros leídos, lugares visitados, uso privado |

**Gestor de paquetes:**

- Se usará **pnpm** como gestor de paquetes principal en todo el proyecto (en vez de npm o yarn).

**Principios de diseño del sistema:**

- Sin servicios externos salvo GitHub
- Contenido gestionado mediante archivos JSON en el repo
- Imágenes almacenadas en el repo (`/public/images/`)
- Sin base de datos
- Deploy automático al hacer push a `main`
- El formulario de contacto empieza con `mailto:` y se migra a Node.js en una fase posterior

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                     GitHub                          │
│                                                     │
│  ┌──────────────┐        ┌────────────────────────┐ │
│  │   Repo       │──push──▶   GitHub Actions (CI)  │ │
│  │  /src        │        │   lint → test → build  │ │
│  │  /data       │        └────────────┬───────────┘ │
│  │  /public     │                     │ deploy       │
│  └──────────────┘        ┌────────────▼───────────┐ │
│                          │     GitHub Pages        │ │
│                          │ kimografico.github.io   │ │
│                          │     /portfolio          │ │
│                          └────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Stack:**

| Capa                | Tecnología                     |
| ------------------- | ------------------------------ |
| Frontend            | React 18 + TypeScript + Vite   |
| Estilos             | Tailwind CSS                   |
| Routing             | React Router v6                |
| Tablas              | TanStack Table v8              |
| Datos               | JSON estático en `/src/data/`  |
| Imágenes            | `/public/images/` en el repo   |
| Hosting             | GitHub Pages                   |
| CI/CD               | GitHub Actions                 |
| Formulario (MVP)    | `mailto:`                      |
| Formulario (futuro) | Node.js + Express + Nodemailer |

**Migración a Lit (Fase 6 — opcional):**
Una vez estabilizado el proyecto, se valorará migrar los componentes de `basics/` y `combinations/` a Lit (Web Components) como ejercicio de aprendizaje y para alinear con el stack de BBVA (Ember + Lit). La refactorización estará acotada a esas dos capas sin afectar páginas, rutas ni lógica de negocio.

---

## 3. Estructura de carpetas

```
kimografico/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # Lint + tests en cada PR
│   │   └── deploy.yml       # Build + deploy a GitHub Pages en push a main
│   ├── skills/              # Skills para automatización y workflows
│   └── copilot-instructions.md
│
├── public/
│   ├── favicon.ico          # Favicon principal
│   ├── favicon-32.png       # Variante PNG 32×32
│   ├── favicon-180.png      # Apple touch icon 180×180
│   ├── robots.txt           # Disallow: /kimo
│   ├── 404.html             # Workaround React Router + GitHub Pages
│   └── images/
│       ├── og-image.jpg     # Imagen Open Graph para previews sociales
│       ├── books/           # Portadas de libros
│       ├── diseno/          # Imágenes del portfolio de diseño
│       ├── dev/             # Imágenes del portfolio de desarrollo
│       └── places/          # Imágenes de viajes y lugares
│
├── src/
│   ├── components/
│   │   ├── basics/          # Átomos: Badge, Button, NavLink, ToggleVista...
│   │   │   ├── Badge.tsx
│   │   │   └── ...
│   │   ├── combinations/    # Moléculas: LibroCard, ProyectoCard, CabeceraOrdenable...
│   │   │   ├── LibroCard.tsx
│   │   │   └── ...
│   │   ├── compositions/    # Organismos: BooksGallery, BooksTable, PlacesTable...
│   │   │   ├── BooksGallery.tsx
│   │   │   ├── BooksTable.tsx
│   │   │   ├── PlacesTable.tsx
│   │   │   └── ...
│   │   ├── layout/          # Header, Footer, Layout, MainLayout
│   │   │   ├── MainLayout.tsx
│   │   │   ├── MainHeader.tsx
│   │   │   └── ...
│   │   ├── iconos/          # Iconos SVG reutilizables como componentes React
│   │   │   ├── IconMail.tsx
│   │   │   ├── IconUser.tsx
│   │   │   ├── index.ts
│   │   │   └── iconos.css
│   │   └── ui/              # Componentes de UI reciclables
│   │       └── UIButton.tsx
│   │
│   ├── pages/               # Una carpeta por sección principal
│   │   ├── Home/
│   │   ├── GraphicDesign/
│   │   ├── Dev/
│   │   ├── ContactMe/
│   │   ├── Kimo/
│   │   │   ├── KimoLayout.tsx     # Layout para sección personal
│   │   │   ├── BooksPage.tsx      # Galería y tabla de libros
│   │   │   ├── BooksGallery.tsx   # Componente galería de libros
│   │   │   ├── BooksTable.tsx     # Componente tabla de libros
│   │   │   ├── PlacesPage.tsx     # Tabla de lugares visitados
│   │   │   ├── PlacesTable.tsx    # Componente tabla de lugares
│   │   │   ├── IconGallery.tsx    # Galería de iconos del proyecto
│   │   │   └── espacio-personal.css
│   │   └── NotFoundPage.tsx
│   │
│   ├── data/                # Datos JSON y funciones para leerlos
│   │   ├── books.json
│   │   ├── places.json
│   │   ├── recent-works.json
│   │   └── loaders.ts
│   │
│   ├── interfaces/          # Interfaces y tipos centralizados
│   │   └── ui.ts
│   │
│   ├── styles/              # Estilos globales y compartidos
│   │   └── tableStyles.ts
│   │
│   ├── App.tsx              # Definición de rutas
│   ├── App.test.tsx
│   ├── main.tsx             # Entry point
│   ├── index.css
│   ├── App.css
│   ├── variables.css
│   ├── setupTests.ts
│   └── types/
│       └── index.ts
│
├── tests/                   # Tests de integración y unitarios
│   └── NotFoundPage.test.tsx
│
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── postcss.config.js
├── package.json             # Scripts: dev, build, lint, typecheck, test
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── README.md
└── .github/specifications.md  # Este documento
```

---

## 4. Modelos de datos

### 4.1 Proyecto de diseño

```typescript
interface ProyectoDiseno {
  id: string; // slug único, ej: "colordmar"
  titulo: string;
  categoria: CategoriaDiseno;
  tags: string[];
  imagen: string; // ruta relativa: "/images/diseno/logotipos/colordmar.jpg"
  imagenes?: string[]; // galería adicional (opcional)
  descripcion: string;
  cliente?: string;
  año: number;
  destacado: boolean; // aparece en home si true
}

type CategoriaDiseno =
  | 'logotipos'
  | 'web'
  | 'editorial'
  | 'papeleria'
  | 'carteleria'
  | 'multimedia'
  | 'ilustracion'
  | 'packaging'
  | '3d'
  | 'otros';
```

### 4.2 Proyecto de desarrollo

```typescript
interface ProyectoDev {
  id: string;
  titulo: string;
  categoria: CategoriaDev;
  tags: string[];
  imagen: string;
  descripcion: string;
  tecnologias: string[];
  url?: string; // URL del proyecto en producción (opcional)
  repo?: string; // URL del repositorio (opcional)
  año: number;
  destacado: boolean;
}

type CategoriaDev = 'web' | 'mobile' | 'cli' | 'libreria' | 'otros';
```

### 4.3 Libro

```typescript
interface Libro {
  id: string; // slug único, coincide con nombre de portada
  titulo: string; // título del libro
  autor: string; // nombre del autor
  portada: string; // ruta relativa: "/images/books/nombre-libro.jpg"
  fecha: string; // formato "YYYY-MM-DD" (siempre completa, día 01 si falta)
  idioma: string; // código ISO 639-1: "es", "en", "fr", etc. (por defecto "es")
  genero: string; // ej: "Ficción", "Ensayo", "Novela Gráfica" (buscado automáticamente si falta)
  sinopsis: string; // breve descripción del libro (buscada automáticamente si falta)
  serie?: string; // nombre de la serie si aplica (opcional, buscada automáticamente si falta)
  isbn?: string; // ISBN-13 sin guiones, ej: "9788490705834" (opcional)
}
```

**Ejemplo JSON:**

```json
[
  {
    "id": "el-nombre-del-viento",
    "titulo": "El nombre del viento",
    "autor": "Patrick Rothfuss",
    "portada": "/images/books/el-nombre-del-viento.jpg",
    "fecha": "2023-04-15",
    "idioma": "es",
    "genero": "Fantasía",
    "sinopsis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    "serie": "The Kingkiller Chronicle",
    "isbn": "9788401352836"
  }
]
```

**Vista galería — comportamiento:**

- Grid de cards, cada card muestra la carátula ocupando la mayor parte del espacio
- Al pie de la card: título y autor
- Al hacer hover: se superpone el género, el idioma y "Rec. por X" si aplica
- Ordenadas por `fechaLectura` descendente por defecto

**Vista tabla — comportamiento:**

- Sin carátula
- Columnas: Título · Autor · Idioma · Género · Fecha · Serie
- Cualquier columna es ordenable (click en cabecera, segundo click invierte el orden)
- Ordenada por `fecha` descendente por defecto (más reciente primero)

**Controles de la página:**

- Toggle visible para cambiar entre vista galería y vista tabla
- El estado del toggle se guarda en `localStorage` para recordar la preferencia

---

### 4.4 Lugar

La entidad principal es una **visita a un país** en una fecha concreta. Dentro de esa visita puede haber varios lugares específicos con sus coordenadas.

```typescript
interface LugarEspecifico {
  nombre: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
}

interface Lugar {
  id: string;
  pais: string; // nombre del país visitado
  codigoPais: string; // ISO 3166-1 alpha-2, ej: "JP", "FR" (para mapa futuro)
  date: string; // formato "YYYY-MM-DD"
  city: string; // ciudad principal o entrada
  place: string; // lugar específico visitado
  people?: string; // personas que acompañaron (opcional)
}
```

**Ejemplo JSON:**

```json
[
  {
    "id": "japon-2022-tokyo",
    "pais": "Japón",
    "codigoPais": "JP",
    "date": "2022-09-15",
    "city": "Tokio",
    "place": "Templo Senso-ji",
    "people": "Laura, María"
  },
  {
    "id": "japon-2022-kyoto",
    "pais": "Japón",
    "codigoPais": "JP",
    "date": "2022-09-20",
    "city": "Kioto",
    "place": "Bosque de bambú de Arashiyama"
  }
]
```

**Vista tabla — comportamiento:**

- Columnas: Fecha · País · Ciudad · Lugar · Personas
- Ordenable por: Fecha, País, Ciudad, Lugar
- Ordenada por `date` descendente por defecto (más reciente primero)

**Nota sobre el mapa (fase posterior):**
El campo `codigoPais` (ISO 3166-1 alpha-2) se añade ahora en el JSON para no tener que rellenar todos los registros cuando se implemente el mapa. El mapa usará este código para colorear los países visitados, y las `coordenadas` de cada `LugarEspecifico` para añadir marcadores. La librería candidata es `react-simple-maps` (SVG puro, sin dependencias de Google Maps, sin coste).

---

## 5. Rutas

| Ruta              | Componente          | Notas                       |
| ----------------- | ------------------- | --------------------------- |
| `/`               | `Home`              | Landing pública             |
| `/graphic-design` | `GraphicDesignHome` | Portfolio de diseño gráfico |
| `/dev`            | `PortfolioDev`      | Portfolio de desarrollo     |
| `/contacto`       | `ContactMe`         | Formulario / mailto:        |
| `/kimo`           | `KimoLayout`        | Sección oculta, no indexada |
| `/kimo/books`     | `BooksPage`         | Galería y tabla de libros   |
| `/kimo/places`    | `PlacesPage`        | Tabla de lugares visitados  |

**Notas sobre la sección personal (/kimo):**

- La ruta `/kimo` no aparece en ningún menú público
- Cada página bajo `/kimo` incluye `<meta name="robots" content="noindex, nofollow">` (no indexada por buscadores)
- No hay autenticación en el MVP (seguridad por oscuridad)
- Autenticación simple (PIN o contraseña) se puede añadir en una fase posterior si se desea
- URL raíz: https://kimografico.github.io/portfolio/kimo

---

## 6. CI/CD

### `ci.yml` — Se ejecuta en cada Pull Request

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Type check
        run: pnpm run check

      - name: Tests
        run: pnpm run test

      - name: Check image sizes
        run: |
          WARN_BYTES=716800      # 700 KB — aviso, pero no bloquea
          BLOCK_BYTES=1024000    # 1000 KB — bloquea el pipeline
          FAILED=0
          find public/images -type f \
            \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | \
          while read img; do
            size=$(stat -c%s "$img")
            kb=$(($size/1024))
            if [ $size -gt $BLOCK_BYTES ]; then
              echo "❌ BLOQUEADO: $img (${kb}KB) — supera el límite de 1000KB"
              FAILED=1
            elif [ $size -gt $WARN_BYTES ]; then
              echo "⚠️  AVISO:    $img (${kb}KB) — supera los 700KB recomendados"
            fi
          done
          if [ $FAILED -eq 1 ]; then exit 1; fi
          echo "✅ Todas las imágenes dentro del límite"

      - name: Build
        run: pnpm run build
```

### `deploy.yml` — Se ejecuta en cada push a `main`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: dist
```

---

## 7. Fases de desarrollo

---

### Fase 1 — Arquitectura base + sección personal

**Objetivo:** Tener el proyecto funcionando end-to-end con deploy real, aunque el contenido sea mock.

#### 1.1 Setup del proyecto

- [x] Crear repo en GitHub
- [x] Inicializar proyecto con Vite + React + TypeScript
- [x] Configurar Tailwind CSS
- [x] Configurar ESLint + Prettier
- [x] Configurar Vitest (testing)
- [x] Instalar TanStack Table v8 (`@tanstack/react-table`)
- [x] Añadir scripts en `package.json`: `dev`, `build`, `lint`, `check`, `test`
- [x] Configurar `vite.config.ts` para GitHub Pages (`base: '/portfolio'`)
- [x] Añadir `favicon.ico` y variantes PNG en `/public/`
- [x] Crear `robots.txt` en `/public/` con `Disallow: /kimo`
- [x] Crear `404.html` en `/public/` con script de redirección para React Router
- [x] Configurar meta tags Open Graph en `index.html`

> **Nota sobre el 404 y GitHub Pages:** cuando alguien accede directamente a una URL como `/diseno/colordmar`, GitHub Pages devuelve su propia 404 porque no encuentra ese archivo estático. La solución estándar es añadir un `404.html` que redirige silenciosamente a `index.html` pasando la ruta como parámetro, y un pequeño script en `index.html` que la restaura antes de que React Router tome el control. Es un workaround conocido, no elegante, pero funciona perfectamente.

#### 1.2 CI/CD

- [ ] Crear `ci.yml` (lint + typecheck + tests + check imágenes + build)
- [ ] Crear `deploy.yml` (build + deploy a GitHub Pages)
- [ ] Verificar que el pipeline funciona con un push vacío

#### 1.3 Estructura base

- [x] Definir interfaces TypeScript en `src/types/index.ts`
- [x] Crear `Header` y `Footer` básicos
- [x] Configurar React Router con todas las rutas definidas en §5
- [x] Crear páginas vacías (placeholder) para todas las rutas

> **Convención de componentes:** cada componente en `basics/`, `combinations/` y `compositions/` se implementará con su lógica clara y autoexplicativa. Se valorará el uso de Storybook en una fase posterior para documentar visualmente los componentes.

#### 1.4 Datos mock

- [x] `src/data/books.json` con libros de ejemplo
- [x] `src/data/places.json` con lugares de ejemplo
- [ ] `src/data/portfolio-diseno.json` con proyectos de diseño de ejemplo
- [ ] `src/data/portfolio-dev.json` con proyectos de desarrollo de ejemplo
- [x] `src/data/recent-works.json` con trabajos recientes

#### 1.5 Sección personal — Libros (`/kimo/books`)

- [x] Añadir `<meta name="robots" content="noindex, nofollow">` en páginas `/kimo`
- [x] Componente `BooksGallery` con portada, título y autor; modal con ficha completa
- [x] Componente `BooksTable` con columnas: Título · Autor · Idioma · Género · Fecha · Serie
- [x] Ordenación en tabla: click en cabecera ordena por esa columna, segundo click invierte
- [x] Toggle galería / tabla con persistencia en `localStorage`
- [x] Ambas vistas ordenadas por `fecha` descendente por defecto (más reciente primero)

#### 1.6 Sección personal — Lugares (`/kimo/places`)

- [x] Componente `PlacesTable` con columnas: Fecha · País · Ciudad · Lugar · Personas
- [x] Ordenable por cualquier columna (click en cabecera)
- [x] Ordenada por `date` descendente por defecto (más reciente primero)
- [x] Icono de bandera para el país (emoji o componente)

#### 1.7 Sección personal — Galería de iconos (`/kimo/iconos`)

- [x] Componente `IconGallery` que renderiza automáticamente todos los iconos exportados
- [x] Grid de iconos con hover interactivo (icono más grande, blanco, fondo accent)
- [x] Sin necesidad de modificar el componente al añadir nuevos iconos (se añaden automáticamente)

#### Tests de la Fase 1

- [x] Test unitario: `BooksGallery` renderiza la galería con portadas correctamente
- [x] Test unitario: `BooksTable` ordena correctamente al hacer click en la cabecera
- [x] Test unitario: `PlacesTable` renderiza los datos con formato correcto
- [x] Test unitario: los datos mock cumplen las interfaces TypeScript (tipos bien formados)
- [ ] Test de integración: la ruta `/kimo/books` carga, renderiza galería y tabla con toggle
- [ ] Test de integración: la ruta `/kimo/places` carga y muestra la tabla con los datos

---

### Fase 2 — Portfolio de diseño gráfico

**Objetivo:** Sección de diseño completa con grid filtrable y páginas de detalle.

- [ ] Grid de proyectos con filtro por categoría
- [ ] Página de detalle de proyecto con galería de imágenes
- [ ] Migrar proyectos reales desde kimografico.com
- [ ] Sección "destacados" en la home

---

### Fase 3 — Portfolio de desarrollo

**Objetivo:** Sección de desarrollo con los primeros proyectos reales.

- [ ] Grid de proyectos de software
- [ ] Página de detalle con enlace a repo y demo
- [ ] Añadir el propio kimografico como primer proyecto

---

### Fase 4 — Home, CV y Contacto

**Objetivo:** Web pública completa y presentable.

- [ ] Home con presentación, servicios y proyectos destacados
- [ ] Página de CV
- [ ] Página de Contacto (mailto: en esta fase)
- [ ] Carrusel de logos de clientes

---

### Fase 5 — Pulido y extras

**Objetivo:** Detalles que elevan la calidad percibida.

- [ ] Animaciones con Framer Motion
- [ ] Formulario de contacto real (Node.js + Nodemailer)
- [ ] Modo oscuro
- [ ] Optimización de rendimiento (lazy loading de imágenes)
- [ ] Autenticación simple para la sección personal (si se desea)
- [ ] Mapa interactivo en `/kimo/lugares` con `react-simple-maps`:
  - Países visitados coloreados (usando `codigoPais` ISO 3166-1 alpha-2)
  - Marcador en las coordenadas de cada `LugarEspecifico`
  - Tooltip al hacer hover sobre un marcador con el nombre del lugar
- [ ] Migración de dominio `kimografico.com` → GitHub Pages:
  - Añadir archivo `CNAME` al repo con el dominio
  - Configurar DNS del hosting actual apuntando a GitHub Pages
  - Tener en cuenta propagación de hasta 48h
  - Hasta este punto, la nueva web convive en `usuario.github.io/kimografico` y la antigua en `kimografico.com`

**Idea para valorar (Fase 5 o posterior):** automatización de carátulas de libros mediante la API pública de **OpenLibrary** (`openlibrary.org/api/books?bibkeys=ISBN:...`). Antes de implementarlo habría que comprobar: qué porcentaje de los libros del JSON tienen carátula disponible, cómo se comporta el componente si la API no devuelve imagen (fallback a una carátula genérica local), y si la calidad de las imágenes es suficiente. Útil sobre todo para añadir libros nuevos sin buscar la imagen manualmente.

---

### Fase 6 — Migración a Lit (opcional)

**Objetivo:** Refactorizar los componentes de UI a Web Components con Lit, alineando el stack con el de BBVA (Ember + Lit) y profundizando en el conocimiento de Lit.

**Alcance:** únicamente las capas `basics/` y `combinations/`. Las `compositions/`, páginas, rutas y lógica de negocio no se tocan.

**Condición para abordarla:** el proyecto debe estar estable (Fase 4 completada) y la lógica de cada componente bien conocida. Refactorizar sin ese conocimiento previo añade riesgo innecesario.

- [ ] Crear un agente y las skills pertinentes para abordar las migraciones a Lit
- [ ] Configurar soporte de Web Components en el proyecto (Vite ya lo soporta nativamente)
- [ ] Definir el contrato de cada componente (props → atributos/propiedades, eventos)
- [ ] Migrar `basics/` a Lit uno a uno, verificando que el comportamiento visual no cambia
- [ ] Migrar `combinations/` a Lit uno a uno
- [ ] Ajustar el tipado TypeScript para consumir los Web Components desde React
- [ ] Verificar que los tests existentes siguen pasando

---
