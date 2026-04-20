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
│  │  /frontend   │        │   lint → test → build  │ │
│  │  /data       │        └────────────┬───────────┘ │
│  │  /public     │                     │ deploy       │
│  └──────────────┘        ┌────────────▼───────────┐ │
│                          │     GitHub Pages        │ │
│                          │  kimografico.com        │ │
│                          └────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Stack:**

| Capa                 | Tecnología                     |
| -------------------- | ------------------------------ |
| Frontend             | React 18 + TypeScript + Vite   |
| Estilos              | Tailwind CSS                   |
| Routing              | React Router v6                |
| Tablas               | TanStack Table v8              |
| Componentes aislados | Storybook 8                    |
| Datos                | JSON estático en `/data/`      |
| Imágenes             | `/public/images/` en el repo   |
| Hosting              | GitHub Pages                   |
| CI/CD                | GitHub Actions                 |
| Formulario (MVP)     | `mailto:`                      |
| Formulario (futuro)  | Node.js + Express + Nodemailer |

**Decisión técnica — migración progresiva a Lit:**
Los componentes de `basics/` y `combinations/` se implementarán inicialmente en TSX. Una vez estabilizada la lógica de negocio del proyecto, se valorará migrarlos a Lit (Web Components) como ejercicio de aprendizaje y para alinear con el stack de BBVA (Ember + Lit). La refactorización estará acotada a esas dos capas sin afectar páginas, rutas ni lógica de negocio.

---

## 3. Estructura de carpetas

```
kimografico/
│
├── .github/
│   └── workflows/
│       ├── ci.yml           # Lint + tests en cada PR
│       └── deploy.yml       # Build + deploy a GitHub Pages en push a main
│
├── frontend/
│   ├── .storybook/
│   │   ├── main.ts              # Configuración de Storybook (Vite builder)
│   │   └── preview.ts           # Decoradores globales, importación de Tailwind
│   ├── public/
│   │   ├── favicon.ico          # Favicon principal
│   │   ├── favicon-32.png       # Variante PNG 32×32
│   │   ├── favicon-180.png      # Apple touch icon 180×180
│   │   ├── robots.txt           # Disallow: /kimo
│   │   ├── 404.html             # Workaround React Router + GitHub Pages
│   │   └── images/
│   │       ├── og-image.jpg     # Imagen Open Graph para previews sociales
│   │       ├── diseno/          # Imágenes del portfolio de diseño
│   │       ├── dev/             # Imágenes del portfolio de desarrollo
│   │       └── personal/        # Imágenes de viajes y uso personal
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── basics/          # Átomos: Badge, Button, NavLink, ToggleVista...
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Badge.stories.tsx
│   │   │   │   └── ...
│   │   │   │                    # (→ candidatos a migrar a Lit en el futuro)
│   │   │   ├── combinations/    # Moléculas: LibroCard, ProyectoCard, CabeceraOrdenable...
│   │   │   │   ├── LibroCard.tsx
│   │   │   │   ├── LibroCard.stories.tsx
│   │   │   │   └── ...
│   │   │   │                    # (→ candidatos a migrar a Lit en el futuro)
│   │   │   ├── compositions/    # Organismos: LibrosGaleria, LibrosTabla, LugaresTabla...
│   │   │   │   ├── LibrosTabla.tsx
│   │   │   │   ├── LibrosTabla.stories.tsx
│   │   │   │   └── ...
│   │   │   └── layout/          # Header, Footer, Layout, LayoutPersonal
│   │   │       ├── Header.tsx
│   │   │       ├── Header.stories.tsx
│   │   │       └── ...
│   │   │
│   │   ├── pages/               # Una carpeta por sección principal
│   │   │   ├── Home/
│   │   │   ├── Diseno/
│   │   │   ├── Dev/
│   │   │   └── Personal/
│   │   │       ├── Libros/      # PaginaLibros.tsx — orquesta, sin lógica visual
│   │   │       └── Lugares/     # PaginaLugares.tsx — orquesta, sin lógica visual
│   │   │
│   │   ├── types/               # Interfaces TypeScript de los modelos
│   │   │   └── index.ts
│   │   │
│   │   ├── data/                # Funciones para leer los JSON
│   │   │   └── loaders.ts
│   │   │
│   │   ├── App.tsx              # Definición de rutas
│   │   └── main.tsx             # Entry point
│   │
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── data/                    # Contenido de la web en JSON
│   ├── portfolio-diseno.json
│   ├── portfolio-dev.json
│   ├── libros.json
│   └── lugares.json
│
└── spec.md                  # Este documento
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
  | "logotipos"
  | "web"
  | "editorial"
  | "papeleria"
  | "carteleria"
  | "multimedia"
  | "ilustracion"
  | "packaging"
  | "3d"
  | "otros";
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

type CategoriaDev = "web" | "mobile" | "cli" | "libreria" | "otros";
```

### 4.3 Libro

```typescript
interface Libro {
  id: string;
  titulo: string;
  autor: string;
  idioma: string; // ej: "Español", "Inglés", "Francés"
  caratula: string; // ruta relativa: "/images/personal/libros/nombre-libro.jpg"
  fechaFinLectura: string; // formato "YYYY-MM"
  genero: string; // ej: "Fantasía", "Ensayo", "Novela negra"
  recomendadoPor?: string; // nombre de quien lo recomendó (opcional)
  isbn?: string; // ISBN-13 sin guiones, ej: "9788490705834" — usado para fallback de portada via OpenLibrary
}
```

**Ejemplo JSON:**

```json
[
  {
    "id": "el-nombre-del-viento",
    "titulo": "El nombre del viento",
    "autor": "Patrick Rothfuss",
    "idioma": "Español",
    "caratula": "/images/books/el-nombre-del-viento.jpg",
    "fechaLectura": "2023-04",
    "genero": "Fantasía",
    "isbn": "9788401352836",
    "synopsis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
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
- Columnas: Título · Autor · Idioma · Género · Fecha de lectura · Recomendado por
- Cualquier columna es ordenable (click en cabecera, segundo click invierte el orden)
- Ordenada por `fechaLectura` descendente por defecto

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

interface Visita {
  id: string;
  pais: string;
  codigoPais: string; // ISO 3166-1 alpha-2, ej: "JP", "FR" (necesario para el mapa futuro)
  fechaVisita: string; // formato "YYYY-MM"
  lugares: LugarEspecifico[]; // lugares concretos visitados dentro del país
  acompañantes?: string[]; // nombres (opcional)
  notas?: string;
}
```

**Ejemplo JSON:**

```json
[
  {
    "id": "japon-2022",
    "pais": "Japón",
    "codigoPais": "JP",
    "fechaVisita": "2022-09",
    "lugares": [
      { "nombre": "Tokio", "coordenadas": { "lat": 35.6762, "lng": 139.6503 } },
      { "nombre": "Kioto", "coordenadas": { "lat": 35.0116, "lng": 135.7681 } },
      { "nombre": "Osaka", "coordenadas": { "lat": 34.6937, "lng": 135.5023 } }
    ],
    "acompañantes": ["Laura"],
    "notas": "Viaje de tres semanas, época de los momiji."
  }
]
```

**Vista tabla — comportamiento:**

- Columnas: Fecha · País · Lugares visitados · Acompañantes · Notas
- La columna "Lugares visitados" muestra los nombres separados por coma: "Tokio, Kioto, Osaka"
- Ordenable por: Fecha, País
- Ordenada por `fechaVisita` descendente por defecto

**Nota sobre el mapa (fase posterior):**
El campo `codigoPais` (ISO 3166-1 alpha-2) se añade ahora en el JSON para no tener que rellenar todos los registros cuando se implemente el mapa. El mapa usará este código para colorear los países visitados, y las `coordenadas` de cada `LugarEspecifico` para añadir marcadores. La librería candidata es `react-simple-maps` (SVG puro, sin dependencias de Google Maps, sin coste).

---

## 5. Rutas

| Ruta            | Componente              | Notas                        |
| --------------- | ----------------------- | ---------------------------- |
| `/`             | `Home`                  | Landing pública              |
| `/diseno`       | `PortfolioDiseno`       | Grid filtrable por categoría |
| `/diseno/:id`   | `ProyectoDisenoDetalle` | Detalle de un proyecto       |
| `/dev`          | `PortfolioDev`          | Grid filtrable por categoría |
| `/dev/:id`      | `ProyectoDevDetalle`    | Detalle de un proyecto       |
| `/cv`           | `Curriculum`            | CV interactivo               |
| `/contacto`     | `Contacto`              | Formulario / mailto:         |
| `/kimo`         | `Personal`              | Sección oculta, no indexada  |
| `/kimo/libros`  | `Libros`                | Lista de libros leídos       |
| `/kimo/lugares` | `Lugares`               | Lista de lugares visitados   |

**Notas sobre la sección personal:**

- La ruta `/kimo` no aparece en ningún menú público
- Cada página bajo `/kimo` incluye `<meta name="robots" content="noindex, nofollow">`
- No hay autenticación en el MVP (seguridad por oscuridad)
- Autenticación simple (PIN o contraseña) se puede añadir en una fase posterior si se desea

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
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: frontend

      - name: Lint
        run: npm run lint
        working-directory: frontend

      - name: Type check
        run: npm run typecheck
        working-directory: frontend

      - name: Tests
        run: npm run test
        working-directory: frontend

      - name: Check image sizes
        run: |
          WARN_BYTES=716800      # 700 KB — aviso, pero no bloquea
          BLOCK_BYTES=1024000    # 1000 KB — bloquea el pipeline
          FAILED=0
          find frontend/public/images -type f \
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
        run: npm run build
        working-directory: frontend
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
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: frontend

      - name: Build
        run: npm run build
        working-directory: frontend

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: frontend/dist
```

---

## 7. Fases de desarrollo

---

### Fase 1 — Arquitectura base + sección personal

**Objetivo:** Tener el proyecto funcionando end-to-end con deploy real, aunque el contenido sea mock.

#### 1.1 Setup del proyecto

- [ ] Crear repo en GitHub
- [ ] Inicializar proyecto con Vite + React + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar ESLint + Prettier
- [ ] Configurar Vitest (testing)
- [ ] Instalar TanStack Table v8 (`@tanstack/react-table`)
- [ ] Instalar y configurar Storybook 8 (`npx storybook@latest init`)
- [ ] Verificar que Storybook arranca con `npm run storybook` y lee los estilos de Tailwind
- [ ] Añadir scripts en `package.json`: `dev`, `build`, `lint`, `typecheck`, `test`, `storybook`, `build-storybook`
- [ ] Configurar `vite.config.ts` para GitHub Pages (`base: '/kimografico'` o dominio propio)
- [ ] Añadir `favicon.ico` y variantes PNG en `/public/`
- [ ] Crear `robots.txt` en `/public/` con `Disallow: /kimo`
- [ ] Crear `404.html` en `/public/` con script de redirección para React Router (ver nota)
- [ ] Configurar meta tags Open Graph en `index.html`: título, descripción, imagen de preview, URL canónica

> **Nota sobre el 404 y GitHub Pages:** cuando alguien accede directamente a una URL como `/diseno/colordmar`, GitHub Pages devuelve su propia 404 porque no encuentra ese archivo estático. La solución estándar es añadir un `404.html` que redirige silenciosamente a `index.html` pasando la ruta como parámetro, y un pequeño script en `index.html` que la restaura antes de que React Router tome el control. Es un workaround conocido, no elegante, pero funciona perfectamente.

#### 1.2 CI/CD

- [ ] Crear `ci.yml` (lint + typecheck + tests + check imágenes + build)
- [ ] Crear `deploy.yml` (build + deploy a GitHub Pages)
- [ ] Verificar que el pipeline funciona con un push vacío

#### 1.3 Estructura base

- [ ] Definir interfaces TypeScript en `src/types/index.ts`
- [ ] Crear `Header` y `Footer` básicos
- [ ] Configurar React Router con todas las rutas definidas en §5
- [ ] Crear páginas vacías (placeholder) para todas las rutas
- [ ] Crear la primera story (`Badge.stories.tsx`) como prueba de que Storybook funciona con Tailwind

> **Convención de stories:** cada componente en `basics/`, `combinations/` y `compositions/` tendrá su archivo `.stories.tsx` al lado. Las stories documentan los estados relevantes del componente (default, variantes, casos límite). No es obligatorio cubrir el 100% desde el principio, pero sí crear la story en el mismo momento que el componente.

#### 1.4 Datos mock

- [ ] `data/libros.json` con 3 libros de ejemplo
- [ ] `data/lugares.json` con 3 lugares de ejemplo
- [ ] `data/portfolio-diseno.json` con 2 proyectos de ejemplo
- [ ] `data/portfolio-dev.json` con 1 proyecto de ejemplo

#### 1.5 Sección personal — Libros (`/kimo/libros`)

- [ ] Añadir `<meta name="robots" content="noindex, nofollow">` en páginas `/kimo`
- [ ] Componente `LibroCard` con carátula, título y autor visibles; género, idioma y "Rec. por" en hover
- [ ] Componente `LibrosTabla` con columnas: Título · Autor · Idioma · Género · Fecha · Recomendado por
- [ ] Ordenación en tabla: click en cabecera ordena por esa columna, segundo click invierte
- [ ] Toggle galería / tabla con persistencia en `localStorage`
- [ ] Ambas vistas ordenadas por `fechaFinLectura` descendente por defecto

#### 1.6 Sección personal — Lugares (`/kimo/lugares`)

- [ ] Componente `LugaresTabla` con columnas: Fecha · País · Lugares visitados · Acompañantes · Notas
- [ ] Columna "Lugares visitados" muestra los nombres del array `lugares` separados por coma
- [ ] Ordenable por Fecha y País (click en cabecera)
- [ ] Ordenada por `fechaVisita` descendente por defecto

#### Tests de la Fase 1

- [ ] Test unitario: `LibroCard` renderiza título y autor correctamente
- [ ] Test unitario: `LibroCard` muestra "Rec. por X" solo cuando el campo existe
- [ ] Test unitario: `LibrosTabla` ordena correctamente por autor al hacer click en la cabecera
- [ ] Test unitario: `LibrosTabla` invierte el orden al hacer segundo click en la misma cabecera
- [ ] Test unitario: `LugaresTabla` concatena los nombres de `lugares` correctamente
- [ ] Test unitario: los datos mock cumplen las interfaces TypeScript (tipos bien formados)
- [ ] Test de integración: la ruta `/kimo/libros` carga, renderiza las cards y el toggle funciona
- [ ] Test de integración: la ruta `/kimo/lugares` carga y muestra la tabla con los datos mock

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

**Condición para abordarla:** el proyecto debe estar estable y la lógica de cada componente bien conocida. Refactorizar sin ese conocimiento previo añade riesgo innecesario.

- [ ] Configurar soporte de Web Components en el proyecto (Vite ya lo soporta nativamente)
- [ ] Definir el contrato de cada componente (props → atributos/propiedades, eventos)
- [ ] Migrar `basics/` a Lit uno a uno, verificando que el comportamiento visual no cambia
- [ ] Migrar `combinations/` a Lit uno a uno
- [ ] Ajustar el tipado TypeScript para consumir los Web Components desde React
- [ ] Verificar que los tests existentes siguen pasando

---

_Última actualización: Fase 1 en definición — dominio pendiente hasta Fase 5_
