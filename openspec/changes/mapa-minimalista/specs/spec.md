# Especificación: Mapa minimalista interactivo (JVM)

## Requisitos funcionales

1. El componente debe ser un archivo TSX independiente, importable en PlacesPage.
2. Debe renderizar un mapamundi vectorial usando la librería JavaScript Vector Maps (JVM).
3. El mapa debe ocupar el 100% del ancho del contenedor y 500px de alto (ajustable por props).
4. Debe resaltar visualmente los países visitados (mock: España, Francia, Tailandia).
5. Debe mostrar puntos (marcadores) en las ubicaciones de Valencia y París (mock: lat/lon).
6. El zoom nativo de JVM debe estar habilitado (botones, rueda del ratón, pinch en móvil, etc.).
7. El componente debe ser minimalista: sin leyendas, sin controles extra, solo el mapa y el zoom.
8. Debe incluir instrucciones claras para instalar JVM con pnpm.

## Requisitos no funcionales

- El componente debe estar tipado en TypeScript.
- Debe seguir las convenciones de clean code y accesibilidad (a11y):
  - El mapa debe tener un role="img" y un aria-label descriptivo.
  - Los controles de zoom deben ser accesibles por teclado y tener labels.
  - Los colores de resaltado deben tener contraste suficiente.
- El código debe estar comentado donde sea relevante para la comprensión didáctica.

## Criterios de aceptación

- [ ] El componente se puede importar y renderizar en PlacesPage sin errores.
- [ ] El mapa muestra correctamente los países resaltados y los puntos en las ubicaciones mock.
- [ ] El zoom funciona con botones, rueda y pinch (según soporte JVM).
- [ ] El componente es responsivo y mantiene el aspecto minimalista.
- [ ] El código cumple con las reglas de lint y clean code del proyecto.
- [ ] Se incluyen instrucciones de instalación de JVM con pnpm en el README del componente.
- [ ] Se consideran y documentan edge cases relevantes.

## Edge cases

- ¿Qué ocurre si JVM no carga correctamente? (fallback visual o mensaje de error)
- ¿Qué ocurre si el contenedor es más pequeño que 500px de alto? (el mapa debe adaptarse)
- ¿Qué ocurre si se pasa una lista vacía de países o puntos? (el mapa se muestra sin resaltados)
- ¿Qué ocurre si JVM no soporta algún evento de zoom en ciertos dispositivos? (debe documentarse)

---
