# Diseño técnico: Mapa minimalista con JVM

## Estructura del componente

- Archivo: `MapMinimal.tsx` (ubicado en `src/components/combinations/`)
- Props:
  - `width?: string | number` (por defecto: '100%')
  - `height?: string | number` (por defecto: 500)
  - `visitedCountries?: string[]` (por defecto: ['ES', 'FR', 'TH'])
  - `points?: { lat: number; lon: number; label?: string }[]` (por defecto: Valencia y París)

## Integración JVM

- Instalar JVM con pnpm: `pnpm add jsvectormap`
- Importar el CSS de JVM en el componente o en el entrypoint global.
- Usar el hook `useEffect` para inicializar el mapa sobre un `div` ref.
- Configurar JVM para:
  - Mapamundi (`world`)
  - Resaltar países por código ISO (ES, FR, TH)
  - Añadir marcadores en las coordenadas mock
  - Habilitar zoom nativo (botones, rueda, pinch)
- Limpiar el mapa al desmontar el componente para evitar memory leaks.

## Accesibilidad

- Añadir `role="img"` y `aria-label="Mapa de países visitados"` al contenedor.
- Asegurar que los controles de zoom sean accesibles por teclado y tengan labels.
- Usar colores con contraste suficiente para los países resaltados y los puntos.

## Clean code

- Tipado estricto en TypeScript.
- Separar lógica de inicialización y props.
- Comentar las partes clave (inicialización JVM, props, a11y).
- No incluir lógica de negocio ni dependencias innecesarias.

## Alternativas consideradas

- Otras librerías de mapas (ej: react-simple-maps, Leaflet) descartadas por requerimiento de JVM y minimalismo.
- Renderizado SVG manual descartado por complejidad y falta de zoom nativo.

## Notas

- Documentar en el README del componente cómo instalar JVM y cómo usar el componente.
- Si JVM no soporta algún evento de zoom en ciertos dispositivos, documentar la limitación.

---
