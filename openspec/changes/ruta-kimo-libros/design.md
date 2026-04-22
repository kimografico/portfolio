# Diseño técnico: Sección /kimo y subrutas

## Estructura de rutas

- `/kimo` (layout o página principal de la sección)
  - `/kimo/books` (historial de lectura)
  - `/kimo/places` (lugares visitados)

## Componentes principales

- `KimoLayout`: layout para la sección, con navegación interna (tabs o menú lateral)
- `BooksPage`: página para `/kimo/books`, gestiona el toggle de vistas
- `BooksTable`: vista tabla (TanStack Table)
- `BooksGallery`: vista galería de portadas
- `PlacesPage`: stub para `/kimo/places` (puede ser solo un placeholder)

## Flujo de datos

- Los datos de libros se cargan desde `data/books.json` usando un loader o hook en `BooksPage`
- Las imágenes de portadas se obtienen de `assets/books/` (nombre de archivo referenciado en el JSON) y tendran un fallback a no-cover.jpg en caso de no estar disponibles

## Librerías y dependencias

- TanStack Table para la vista tabla (orden y filtros)
- Tailwind para estilos
- React Router para subrutas

## Accesibilidad

- Navegación por teclado en tabs/menú y toggle
- Tabla y galería con roles y etiquetas semánticas
- Imágenes con `alt` descriptivo

## Tests

- Renderizado de ambas vistas y el toggle
- Comprobación de orden y filtrado en la tabla
- Accesibilidad básica (foco, roles)

## Notas

- Mantener los componentes simples y bien tipados
- No abstraer en exceso: si la lógica de toggle es simple, mantenerla en `BooksPage`
- Seguir la estructura de carpetas del repo

Se usarán atributos de accesibilidad (roles, aria, alt) en tabs/menú, toggle, tabla y galería.
No se implementará navegación por teclado personalizada salvo que se especifique lo contrario.
Imágenes con `alt` descriptivo.

## Responsive

El diseño debe ser responsive y verse correctamente en desktop y mobile, siguiendo las reglas de layout y breakpoints del proyecto.

## Tests

Renderizado de ambas vistas y el toggle
Comprobación de orden y filtrado en la tabla
Accesibilidad básica (foco, roles)
