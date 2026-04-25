# Portfolio — kimografico

Portfolio personal de diseño gráfico y desarrollo web, con secciones para galería de libros leídos, lugares visitados y proyectos recientes.

## Tecnología

- **React 18+** con TypeScript
- **Vite** para desarrollo y build
- **Tailwind CSS** + CSS modules personalizados
- **React Router** para navegación
- **Vitest + Testing Library** para testing

## Estructura del Proyecto hasta ahora

```
portfolio/
├── src/
│   ├── components/
│   │   ├── iconos/          # Componentes SVG reutilizables
│   │   ├── ui/              # Componentes reutilizables (Logo, UIButton, etc.)
│   │   ├── layout/          # Layout components (Header, Footer, Sections)
│   │   ├── basics/          # Componentes básicos
│   │   ├── combinations/    # Combinaciones de componentes
│   │   └── compositions/    # Composiciones complejas
│   ├── pages/               # Páginas de la aplicación
│   ├── data/                # Archivos JSON de datos
│   │   ├── books.json       # Galería de libros leídos
│   │   ├── places.json      # Lugares visitados
│   │   └── recent-works.json # Proyectos recientes
│   ├── interfaces/          # Tipos e interfaces centralizados
│   ├── styles/              # Estilos globales y configuración
│   └── types/               # Tipos de TypeScript
├── public/
│   └── images/
│       ├── books/           # Portadas de libros
│       └── ...              # Otras imágenes estáticas
├── tests/                   # Tests de componentes
├── .github/
│   ├── copilot-instructions.md  # Instrucciones para Copilot
│   └── skills/              # Skills personalizados
├── package.json             # Dependencias y scripts
└── vite.config.ts          # Configuración de Vite
```

## Scripts

```bash
pnpm run dev      # Inicia servidor de desarrollo
pnpm run build    # Genera build optimizado
pnpm run lint     # Ejecuta ESLint
pnpm run test     # Ejecuta tests con Vitest
pnpm run preview  # Preview del build
pnpm run check    # Pasa el pre-deploy (si esto no pasa, github actions falla)
```

## Datos JSON

### books.json

Lista de libros leídos con:

- ID único (coincide con nombre de portada)
- Título y autor
- Fecha de lectura (`YYYY-MM` o `YYYY-MM-DD`)
- Idioma (`es`, `en`, etc.)
- Género
- Sinopsis
- Portada en `/public/images/books/<id>.jpg`

### places.json

Lugares visitados con:

- Nombre del lugar
- Ciudad y país
- Coordenadas geográficas
- Fecha de visita
- Personas acompañantes (opcional)

### recent-works.json

Proyectos recientes para la sección landing:

- ID único
- Título, tipo, año
- URL del proyecto

## Componentes Reutilizables

### Iconos (`/src/components/iconos`)

Todos los iconos son componentes React SVG con props:

- `size`: Tamaño en píxeles (defecto: 24)
- `strokeWidth`: Grosor del trazo (defecto: 1.5)
- `className`: Clases CSS adicionales

Exportados en `iconos/index.ts` y mostrados en la página de Contacto.

### Componentes UI (`/src/components/ui`)

- `Logo`: Logotipo de la marca
- `UIButton`: Botón reutilizable con flecha opcional
- `ProjectLine`: Línea de proyecto con información y animación
- `MobileMenu`: Menú hamburguesa responsive con animación

## Convenciones

### Arquitectura de Evolutivos

1. **Monolítico**: Todo el código nuevo en un único archivo.
2. **Plan**: Markdown temporal con posibilidades de componentización (decidido por el usuario).
3. **Modularización**: Extracción manual de componentes según el plan.
4. **Estilos**: CSS extraído a archivos `.css` con el mismo nombre.

### Estilos

- Tailwind para utilidades.
- Archivos `.css` para estilos complejos (multi-atributo, media queries, pseudo-clases).
- Variables CSS para tema: `--color-ink`, `--color-accent`, `--color-border`, etc.

### Componentes

- Nombres en PascalCase.
- Props tipadas con interfaces.
- Comentarios explicativos en lógica compleja.
- Test básico obligatorio para componentes nuevos.

### Data

- JSON centralizado en `/src/data/`.
- IDs únicos por objeto.
- Validación en agregar nuevos datos.

## Desarrollo

### Crear un nuevo icono

1. Crear archivo `/src/components/iconos/IconNombreDelIcono.tsx`
2. Exportar en `iconos/index.ts`
3. Añadir a galería en `ContactMe.tsx`

Ver [Icon Creation Skill](./.github/skills/icon-creation/SKILL.md) para más detalles.

### Extraer CSS

1. Identificar className con multi-atributo.
2. Crear archivo `.css` junto al componente.
3. Extraer estilos y simplificar className a clases personalizadas.

Ver [CSS Extraction Skill](./.github/skills/css-extraction/SKILL.md) para más detalles.

### Añadir libros

1. Subir portada a `/public/images/books/<id>.jpg`
2. Proporcionar datos del libro (title, author, fecha, idioma, etc.)
3. Será validado, normalizado y añadido a `books.json`

Ver [Book Management Skill](./.github/skills/book-management/SKILL.md) para más detalles.

## Instrucciones para Copilot

Ver [Copilot Instructions](./.github/copilot-instructions.md) para convenciones, flujo de trabajo y verificación de tareas.

      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },

},
]);

```

## Mapa de países visitados (PlacesPage)

Este proyecto utiliza [jsvectormap](https://jvm-docs.vercel.app/) para mostrar un mapamundi vectorial minimalista en la sección de lugares visitados.

### Instalación

La librería se instala automáticamente con:

```

pnpm add jsvectormap

````

### Uso

- El componente `VisitedWorldMap` se encuentra en `src/components/combinations/VisitedWorldMap.tsx`.
- Se integra en `PlacesPage` y recibe como props:
  - `highlightedCountries`: array de códigos ISO de países visitados (ej: `["ES", "FR", "TH"]`).
  - `points`: array de objetos `{ name, lat, lon }` para marcar lugares concretos.
  - `height`: alto del mapa en px (opcional, por defecto 500).
- El mapa soporta zoom nativo (botones, rueda, pinch en móvil).
- Accesibilidad: role="img", aria-label, contraste suficiente.

### Ejemplo de integración

```tsx
import VisitedWorldMap from '../../components/combinations/VisitedWorldMap';
import { MOCK_COUNTRIES, MOCK_POINTS } from '../../components/combinations/visitedWorldMap.mocks';

<VisitedWorldMap highlightedCountries={MOCK_COUNTRIES} points={MOCK_POINTS} height={500} />;
````

### Consideraciones

- El mapa es minimalista y no muestra detalles urbanos.
- El zoom es sobre el SVG completo, útil para distinguir puntos cercanos a nivel país/ciudad.
- Si JVM no carga, el componente no rompe la página.
- Los mocks pueden sustituirse por datos reales.
