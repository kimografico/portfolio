# Propuesta de cambio: Sección /kimo con subrutas y vistas de libros

## Objetivo

Crear la sección `/kimo` en el frontend, con subrutas para "Historial de lectura" (`/kimo/books`) y "Lugares visitados" (`/kimo/places`). En `/kimo/books`, mostrar la lista de libros con dos vistas alternables: tabla (TanStack Table) y galería de portadas.

## Alcance

- Añadir la sección `/kimo` con navegación interna para subrutas.
- Implementar `/kimo/books` para mostrar los libros de `data/books.json`.
- Añadir un toggle para alternar entre:
  - Vista tabla (TanStack Table): orden y filtros básicos.
  - Vista galería: portadas ordenadas por fecha.
- Usar Tailwind para estilos y cumplir accesibilidad.
- Añadir al menos un test básico para cada vista y el toggle.

## Criterios de aceptación

- Al navegar a `/kimo/books`, se muestran los libros en ambas vistas alternables.
- La tabla permite ordenar y filtrar según lo especificado.
- La galería muestra portadas ordenadas por fecha.
- El diseño es responsive y accesible (WCAG 2.1 AA).
- Hay tests básicos para el renderizado y el toggle.

## No incluido

- Paginación, edición o borrado de libros.
- Filtros avanzados o rutas protegidas.

## Notas técnicas

- Seguir la estructura y convenciones del proyecto.
- Usar imports relativos.
- Documentar el cambio en el diario tras la implementación.

---

Fecha de propuesta: 22/04/2026
Autor: equipo kimografico
