# Propuesta de cambio: Mapa minimalista interactivo con JVM

## Nombre del cambio

mapa-minimalista

## Objetivo

Implementar un componente de mapa vectorial minimalista en React (TypeScript) usando la librería JavaScript Vector Maps (JVM) para visualizar países visitados y ubicaciones clave en la sección PlacesPage del portfolio.

## Motivación

- Mejorar la visualización de los viajes y lugares visitados de forma visual e interactiva.
- Permitir al usuario explorar el mapamundi con zoom y ver de un vistazo los países y ciudades visitadas.
- Mantener la estética minimalista y la accesibilidad del portfolio.

## Alcance

- Componente React (TSX) independiente, importable en PlacesPage.
- Uso de JVM para renderizar el mapamundi vectorial.
- Resaltado de países visitados (mock: España, Francia, Tailandia).
- Puntos en ubicaciones clave (mock: Valencia y París).
- Zoom nativo habilitado (botones, rueda, pinch, según soporte JVM).
- Instrucciones de instalación de JVM con pnpm.
- Consideraciones de accesibilidad y clean code.
- Criterios de aceptación y edge cases documentados.

## Exclusiones

- No se requiere integración con datos reales (se usará mock).
- No se requiere animación avanzada ni clustering de puntos.
- No se requiere modo oscuro en esta iteración.

---
