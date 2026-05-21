# Kimografico — Manual de usuario (público)

Documentación funcional del portfolio público. Describe todas las secciones y funcionalidades accesibles sin necesidad de autenticación.

---

## 1. Página de inicio (Home)

La página principal presenta al autor como diseñador gráfico y desarrollador de software.

### Secciones visibles

| Sección                   | Descripción                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**                  | Titular grande con nombre y descripción breve. Dos botones de acción: «Ver trabajos de diseño» y «Ver desarrollos web».                        |
| **Sobre**                 | Breve introducción sobre la trayectoria profesional: diseño gráfico de formación, desarrollo de software por convicción.                       |
| **Carrusel de proyectos** | Slideshow automático a ancho completo que rota imágenes de proyectos destacados cada 4,5 segundos con transición animada.                      |
| **Trabajos recientes**    | Lista numerada de proyectos recientes. Cada entrada muestra número, título, tipo (Web, Editorial, etc.) y año. Enlaza al detalle del proyecto. |
| **Clientes**              | Carrusel horizontal infinito con logos de clientes. Se desliza de forma continua y se pausa al pasar el cursor.                                |

---

## 2. Diseño Gráfico

Ruta: `/graphic-design`

### Home de Diseño Gráfico

Página principal de la sección con:

- **Hero visual** con imagen y descripción del perfil como diseñador gráfico.
- **Rejilla de categorías**: tarjetas clicables que enlazan a cada subcategoría.

### Categorías disponibles

| Categoría            | Ruta                                   | Descripción                                           |
| -------------------- | -------------------------------------- | ----------------------------------------------------- |
| Logotipos            | `/graphic-design/logotipos`            | Identidades visuales y marcas.                        |
| Editorial            | `/graphic-design/editorial`            | Revistas, catálogos y publicaciones.                  |
| Etiquetas            | `/graphic-design/etiquetas`            | Diseño de etiquetado para productos.                  |
| Papelería            | `/graphic-design/papeleria`            | Tarjetas, sobres y papelería corporativa.             |
| Cartelería           | `/graphic-design/carteleria`           | Carteles publicitarios y de eventos.                  |
| Packaging            | `/graphic-design/packaging`            | Diseño de envases y embalajes.                        |
| Proyectos especiales | `/graphic-design/proyectos-especiales` | Trabajos singulares fuera de las categorías estándar. |
| Multimedia           | `/graphic-design/multimedia`           | Piezas audiovisuales y digitales.                     |

### Galería de categoría

Cada categoría muestra:

- **Hero de categoría** con título, descripción e icono representativo.
- **Rejilla de proyectos** con miniaturas (thumbnails) generadas automáticamente. Cada tarjeta muestra título y cliente.
- **Estado vacío**: si no hay proyectos, aparece un mensaje «Próximamente» con emoji 🚧.

### Detalle de proyecto

Ruta: `/graphic-design/:categoría/:id`

Muestra la ficha completa del proyecto:

- **Imagen principal** ampliable en lightbox.
- **Galería de imágenes** adicionales con navegación.
- **Metadatos**: título, cliente, fecha, descripción.
- **Navegación prev/next** entre proyectos de la misma categoría.
- **Enlace «Volver»** a la galería de la categoría.

---

## 3. Desarrollo Web

Ruta: `/dev`

### Home de Desarrollo

Estructura idéntica a Diseño Gráfico:

- **Hero visual** con descripción del perfil como desarrollador frontend & backend.
- **Rejilla de categorías** (3 categorías, disposición en fila única en desktop).

### Categorías disponibles

| Categoría  | Ruta              | Descripción                                  |
| ---------- | ----------------- | -------------------------------------------- |
| Vanilla    | `/dev/vanilla`    | Proyectos con JavaScript/TypeScript puro.    |
| WordPress  | `/dev/wordpress`  | Desarrollos sobre WordPress.                 |
| Frameworks | `/dev/frameworks` | Proyectos con React, Vue y otros frameworks. |

### Galería y detalle

Funcionan igual que en Diseño Gráfico. Los proyectos web muestran además:

- **Barra de tecnologías** (tech stack) con iconos de las herramientas utilizadas (React, WordPress, JS, HTML, etc.).
- **Proporción widescreen** (16:9) en las miniaturas para capturar mejor las interfaces web.

Ruta de detalle: `/dev/:categoría/:id`

---

## 4. Contacto

Ruta: `/contacto`

Página con:

- **Formulario externo**: enlace a Google Forms para enviar mensajes o propuestas de colaboración.
- **Currículum Vitae**: dos versiones descargables/consultables.

### Versiones del CV

| Versión                | Ruta                  | Contenido                                                                              |
| ---------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| Diseñador Gráfico      | `/resume/design`      | Experiencia, formación, software y habilidades filtradas por el perfil de diseño.      |
| Desarrollador Frontend | `/resume/development` | Experiencia, formación, lenguajes y habilidades filtradas por el perfil de desarrollo. |

Cada CV se genera a partir de los mismos datos base, filtrados por categoría (diseño o desarrollo). Incluye:

- **Datos personales**: nombre, título, localización, contacto.
- **Experiencia profesional**: puestos con fechas (los activos muestran «HOY»).
- **Formación académica**: titulaciones y centros.
- **Habilidades**: listado con nivel.
- **Software/tecnologías**: herramientas dominadas.
- **Idiomas**: nivel en cada lengua.
- **Cursos y talleres**: formación complementaria.

---

## 5. Espacio personal (Kimo)

El espacio personal es un área de consulta con contenido personal del autor.

### 5.1 Libros

Ruta: `/kimo/books`

Colección de libros leídos con dos modos de vista:

- **Galería**: rejilla de portadas. Al hacer clic en una portada se abre un modal con la ficha completa del libro.
- **Tabla**: vista tabular con columnas ordenables (título, autor, género, fecha de lectura, idioma).

Ficha del libro (modal):

| Campo            | Descripción                                          |
| ---------------- | ---------------------------------------------------- |
| Portada          | Imagen de la cubierta (fallback si no existe).       |
| Título y autor   | Datos principales.                                   |
| Fecha de lectura | Formateada como «Mes de Año» (ej: «Agosto de 2024»). |
| Idioma           | Representado con bandera (🇪🇸 español, 🇬🇧 inglés).    |
| Serie            | Nombre de la saga, si pertenece a una.               |
| Género           | Categoría literaria.                                 |
| Sinopsis         | Resumen del libro.                                   |

Filtros disponibles: por autor (agrupados por frecuencia), serie y género.

### 5.2 Lugares visitados

Ruta: `/kimo/places`

- **Mapa mundial interactivo**: mapa vectorial que resalta en color los países visitados. Incluye marcadores (pins) en ubicaciones concretas.
- **Tabla de lugares**: vista tabular con columnas ordenables (ciudad, lugar, país con bandera, fecha, acompañantes).

### 5.3 Ilustraciones

Ruta: `/kimo/ilustraciones`

Galería de ilustraciones personales con tarjetas de proyecto (título, miniatura).

#### Detalle de ilustración

Ruta: `/kimo/ilustraciones/:id`

- Imagen principal a gran tamaño.
- Galería de imágenes extras.
- Navegación prev/next entre ilustraciones.
- Lightbox para ver imágenes ampliadas.

### 5.4 Galería de iconos

Ruta: `/kimo/iconos`

Muestra todos los iconos SVG del proyecto en una rejilla visual. Cada icono aparece con su nombre y variante (trazo o relleno). Sirve como referencia visual del sistema de iconografía.

---

## 6. Navegación general

### Cabecera

- **Logo** con enlace a la home.
- **Menú de navegación** con enlaces a Diseño Gráfico, Desarrollo Web y Contacto.
- **Botón de tema**: alterna entre modo claro y oscuro. La preferencia se guarda en localStorage y se sincroniza entre pestañas.
- **Menú móvil**: en pantallas pequeñas, la navegación se despliega como menú hamburguesa animado con overlay.

### Pie de página

- Copyright con el año actual.
- Enlace al espacio personal (Kimo).
- Navegación secundaria.

### Página 404

Si el usuario accede a una ruta inexistente, se muestra una página de error con botón para volver a la home.

---

## 7. Características generales

| Característica        | Detalle                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| **Tema claro/oscuro** | Toggling persistente. Se aplica en toda la aplicación.                  |
| **Responsive**        | Diseño adaptado a móvil, tablet y escritorio.                           |
| **Lazy loading**      | Todas las páginas se cargan bajo demanda para mejorar el rendimiento.   |
| **Thumbnails**        | Las miniaturas se generan previamente para carga rápida.                |
| **Animaciones**       | Transiciones suaves en modales, carruseles, lightbox y navegación.      |
| **Accesibilidad**     | Skip links, etiquetas ARIA, gestión de foco en modales, HTML semántico. |
