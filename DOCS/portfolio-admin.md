# Kimografico — Manual de administración

Documentación funcional del panel de administración (área Kimo autenticada). Describe todas las funcionalidades disponibles para gestionar contenido con el backend servido.

---

## Requisitos previos

Para acceder a las funcionalidades de administración es necesario:

1. **Backend arrancado**: `pnpm backend` (puerto 3001). Sin él, las operaciones de escritura no funcionan.
2. **Contraseña configurada**: variable de entorno `VITE_KIMO_PASSWORD_HASH` con el hash SHA-256 de la contraseña.
3. **Inicio de sesión**: acceder a `/kimo/login` e introducir la contraseña. El sistema la hashea con SHA-256 (Web Crypto API) y compara contra el hash configurado.

Si el backend no está disponible, aparece un banner de alerta («Backend offline») con botón de reintentar.

---

## 1. Panel de datos (DataPage)

Ruta: `/kimo/data`

Panel central de administración de proyectos. Muestra todos los proyectos del portfolio (diseño gráfico y desarrollo web) en una tabla interactiva.

### Funcionalidades

| Función                | Descripción                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **Tabla de proyectos** | Columnas: ID, título, cliente, categoría, tipo, fecha, visibilidad. Ordenable por cualquier columna. |
| **Filtros**            | Por tipo (diseño/desarrollo), categoría, cliente y visibilidad (todos/visibles/ocultos).             |
| **Selección múltiple** | Checkboxes para seleccionar varios proyectos a la vez.                                               |
| **Acciones en lote**   | Marcar como visible, marcar como oculto, eliminar los proyectos seleccionados.                       |
| **Enlace a edición**   | Cada fila enlaza al formulario de edición del proyecto.                                              |

### Gestión de trabajos recientes

Integrado en la misma página, debajo de la tabla principal. Permite elegir qué proyectos aparecen en la sección «Trabajos recientes» de la landing.

- **Dos columnas**: Diseño Gráfico (naranja) y Desarrollo (azul).
- Cada columna lista todos los proyectos del tipo correspondiente con checkboxes.
- El conteo de seleccionados se muestra en tiempo real.
- Botón **Guardar** persiste la selección vía API (`PUT /api/recent-works`).

### Gestión del carrusel

También integrado en DataPage. Permite gestionar las imágenes del carrusel de la home.

- **Añadir imagen**: campo para pegar la ruta relativa de la imagen + texto alternativo.
- **Reordenar**: arrastrar y soltar (drag & drop) para cambiar el orden.
- **Eliminar**: botón de borrado por imagen.
- **Guardar**: persiste vía API (`PUT /api/carousel`).

---

## 2. Añadir proyecto

Ruta: `/kimo/add-project`

Formulario de creación de proyectos nuevos para el portfolio.

### Campos del formulario

| Campo       | Tipo                | Descripción                                                                                                                                           |
| ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tipo        | Selector            | «Diseño gráfico» o «Desarrollo web».                                                                                                                  |
| Categoría   | Selector            | Categoría específica (depende del tipo seleccionado).                                                                                                 |
| Título      | Texto               | Nombre del proyecto.                                                                                                                                  |
| Cliente     | Texto               | Nombre del cliente.                                                                                                                                   |
| Fecha       | Fecha               | Fecha del proyecto.                                                                                                                                   |
| Descripción | Texto multilínea    | Descripción del proyecto.                                                                                                                             |
| Extras      | Lista editable      | Textos descriptivos adicionales (añadir/eliminar dinámicamente).                                                                                      |
| Vídeos      | Lista editable      | URLs de vídeos relacionados.                                                                                                                          |
| Tech Stack  | Tags seleccionables | Solo para proyectos web. Opciones rápidas predefinidas (HTML, CSS, JS, React, Vue, WordPress, etc.) más campo para añadir tecnologías personalizadas. |
| Imágenes    | Zona de arrastre    | Subida múltiple de imágenes (hasta 20 archivos, máx. 10 MB cada uno). La primera imagen es la principal. Drag & drop para reordenar.                  |

### Flujo de guardado

1. Se suben las imágenes al backend (`POST /api/upload`).
2. Se crea el proyecto con las rutas de las imágenes guardadas (`POST /api/projects`).
3. Se generan automáticamente las miniaturas (thumbnails).

---

## 3. Editar proyecto

Ruta: `/kimo/edit-project/:id`

Formulario de edición idéntico al de creación, precargado con los datos del proyecto existente.

### Funcionalidades adicionales

- **Normalización de imágenes**: maneja tanto el formato antiguo (`ruta`) como el actual (`image`) de forma transparente.
- **Subida de nuevas imágenes**: las imágenes nuevas se suben al backend; las existentes se mantienen.
- **Botón de eliminar proyecto**: elimina el proyecto completo previa confirmación.

---

## 4. Añadir libro

Ruta: `/kimo/add-book`

Formulario para registrar un nuevo libro leído.

| Campo            | Tipo        | Descripción                                       |
| ---------------- | ----------- | ------------------------------------------------- |
| Título           | Texto       | Título del libro (obligatorio).                   |
| Autor            | Texto       | Nombre del autor (obligatorio).                   |
| Idioma           | Selector    | Idioma de lectura (es, en, etc.).                 |
| Portada          | Imagen      | Subida de imagen de portada con previsualización. |
| Fecha de lectura | Texto       | Formato YYYY-MM (ej: 2024-08).                    |
| Género           | Texto       | Categoría literaria.                              |
| ISBN             | Texto       | Código ISBN (opcional).                           |
| Serie            | Texto       | Nombre de la saga (opcional).                     |
| Sinopsis         | Texto largo | Resumen del libro (opcional).                     |

Al guardar, se sube la portada (`POST /api/kimo/upload`) y se crea el registro (`POST /api/kimo/books`). El ID se genera automáticamente a partir del título (slug).

---

## 5. Añadir ilustración

Ruta: `/kimo/add-illustration`

Formulario para registrar una nueva ilustración.

| Campo       | Tipo             | Descripción                                                                          |
| ----------- | ---------------- | ------------------------------------------------------------------------------------ |
| Título      | Texto            | Nombre de la ilustración.                                                            |
| Descripción | Texto            | Descripción de la pieza.                                                             |
| Fecha       | Fecha            | Fecha de creación.                                                                   |
| Imágenes    | Zona de arrastre | La primera imagen es la principal. Se pueden añadir imágenes extras para la galería. |

Al guardar se suben las imágenes y se generan miniaturas automáticamente.

---

## 6. Añadir lugar visitado

Ruta: `/kimo/add-place`

Formulario dividido en dos partes:

### Datos del lugar

| Campo        | Tipo     | Descripción                                    |
| ------------ | -------- | ---------------------------------------------- |
| Ciudad       | Texto    | Nombre de la ciudad.                           |
| Lugar        | Texto    | Nombre del sitio concreto.                     |
| País         | Selector | Código de país (es, fr, nl, th, gr, ie, etc.). |
| Fecha        | Fecha    | Fecha de la visita.                            |
| Acompañantes | Texto    | Personas que acompañaron.                      |

### Marcador del mapa (opcional)

| Campo    | Tipo   | Descripción            |
| -------- | ------ | ---------------------- |
| Nombre   | Texto  | Etiqueta del marcador. |
| Latitud  | Número | Coordenada.            |
| Longitud | Número | Coordenada.            |
| Tamaño   | Número | Escala del marcador.   |

Lugar y marcador se crean como registros separados (`POST /api/kimo/places` y `POST /api/kimo/places-markers`), lo que permite tener lugares sin marcador o marcadores compartidos.

---

## 7. Gestión de trabajos recientes

Ruta: `/kimo/recent-works`

Página dedicada a seleccionar qué proyectos aparecen en la sección «Trabajos recientes» de la home.

- Interfaz de dos columnas: Diseño Gráfico y Desarrollo.
- Cada proyecto se puede marcar/desmarcar con checkbox.
- Contador de seleccionados en tiempo real.
- Botón «Guardar» envía la selección al backend.

---

## 8. Editor de currículum

Ruta: `/kimo/resume`

Editor WYSIWYG completo del currículum vitae. Los cambios se reflejan en las páginas públicas del CV (`/resume/design` y `/resume/development`).

### Secciones editables

| Sección             | Campos                                                    | Acciones                                                |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| **Datos básicos**   | Nombre, título, localización, email, teléfono.            | Editar inline.                                          |
| **Área Diseño**     | Título y resumen del perfil de diseño.                    | Editar inline.                                          |
| **Área Desarrollo** | Título y resumen del perfil de desarrollo.                | Editar inline.                                          |
| **Habilidades**     | Nombre, nivel, categoría (diseño/desarrollo).             | Añadir, eliminar, toggle categoría, toggle visibilidad. |
| **Software**        | Nombre, nivel, categoría.                                 | Añadir, eliminar, toggle categoría, toggle visibilidad. |
| **Idiomas**         | Idioma, nivel, categoría.                                 | Añadir, eliminar, toggle categoría, toggle visibilidad. |
| **Experiencia**     | Cargo, empresa, fecha inicio/fin, descripción, categoría. | Añadir, eliminar, toggle categoría, toggle visibilidad. |
| **Formación**       | Título, centro, fecha inicio/fin, categoría.              | Añadir, eliminar, toggle categoría, toggle visibilidad. |
| **Cursos**          | Nombre, entidad, año, categoría.                          | Añadir, eliminar, toggle categoría, toggle visibilidad. |
| **Talleres**        | Nombre, entidad, año, categoría.                          | Añadir, eliminar, toggle categoría, toggle visibilidad. |

### Funcionalidades del editor

- **Toggle de categoría**: cada elemento puede marcarse como «diseño», «desarrollo» o ambos. Según la categoría, aparecerá en uno u otro CV público.
- **Toggle de visibilidad**: permite ocultar elementos sin eliminarlos (útil para datos antiguos o irrelevantes).
- **Guardado**: botón que envía todo el JSON al backend (`PUT /api/resume`).

---

## 9. Proyectos pendientes

Ruta: `/kimo/pendiente`

Vista de solo lectura que muestra proyectos con datos incompletos:

- Proyectos sin imágenes extras.
- Proyectos sin vídeos.
- Proyectos sin descripción.

Cada fila enlaza al formulario de edición para completar los datos faltantes.

---

## 10. Navegación del panel Kimo

El área Kimo tiene su propia barra de navegación con iconos:

| Sección       | Icono | Ruta                  |
| ------------- | ----- | --------------------- |
| Libros        | 📚    | `/kimo/books`         |
| Lugares       | 🗺️    | `/kimo/places`        |
| Ilustraciones | 🎨    | `/kimo/ilustraciones` |
| Iconos        | ⭐    | `/kimo/iconos`        |
| Datos (admin) | ⚙️    | `/kimo/data`          |
| Pendiente     | ⏳    | `/kimo/pendiente`     |

Las secciones de consulta (libros, lugares, ilustraciones, iconos) muestran botones de «Añadir» cuando el usuario está autenticado y el backend está disponible.
