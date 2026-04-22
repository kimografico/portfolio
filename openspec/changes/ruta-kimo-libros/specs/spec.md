# Especificación: Sección /kimo y subrutas

## Objetivo

Implementar la sección `/kimo` con subrutas para "Historial de lectura" y "Lugares visitados". La subruta `/kimo/books` mostrará la lista de libros con dos vistas alternables: tabla (TanStack Table) y galería de portadas.

## Requisitos funcionales

- `/kimo` debe ser una sección con navegación interna (tabs, menú lateral o similar) para acceder a:
  - `/kimo/books`: Historial de lectura (libros)
  - `/kimo/places`: Lugares visitados (viajes)
- Al acceder a `/kimo/books`:
  - Se muestran los libros de `data/books.json`.
  - Debe haber un botón toggle para alternar entre:
    - **Vista tabla**: Usar TanStack Table, permitiendo:
      - Ordenar por nombre, fecha, autor
      - Filtrar por género, autor, series e idioma
    - **Vista galería**: Portadas ordenadas por fecha, usando imágenes de `assets/books/`
  - No se implementa paginación por ahora
  - Accesibilidad: se cumplirán los requisitos WCAG 2.1 AA usando atributos y roles adecuados, sin lógica de navegación por teclado personalizada salvo que se indique lo contrario
  - El diseño debe ser responsive y verse correctamente en desktop y mobile

## Requisitos no funcionales

- Código limpio, siguiendo SOLID y convenciones del repo
- Tests básicos para ambas vistas y el toggle
- Estilos con Tailwind
- Imports relativos
- Mantener el estilo del home, y el proyecto en general

## Exclusiones

- No se implementan filtros avanzados, edición ni paginación
- No se contemplan rutas protegidas ni login

---

Fecha: 22/04/2026
