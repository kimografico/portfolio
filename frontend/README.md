# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
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

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
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
```

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
```

### Consideraciones

- El mapa es minimalista y no muestra detalles urbanos.
- El zoom es sobre el SVG completo, útil para distinguir puntos cercanos a nivel país/ciudad.
- Si JVM no carga, el componente no rompe la página.
- Los mocks pueden sustituirse por datos reales.
