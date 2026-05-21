# Kimografico — Lista de componentes

Referencia rápida de todos los componentes React del proyecto, agrupados por carpeta.

---

## Compositions (`src/components/compositions/`)

Componentes complejos que combinan lógica de negocio, estado y UI.

| Componente                | Descripción                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BaseTable**             | Tabla genérica con TanStack Table v8. Sorting, selección de filas y estado vacío. Acepta columnas y datos con tipado genérico.                                |
| **BookModal**             | Modal con ficha completa de un libro: portada, título, autor, fecha formateada, idioma (bandera), género, serie y sinopsis. Animación fade y gestión de foco. |
| **BooksFilter**           | Panel de filtros para libros: autor (agrupado por frecuencia), serie y género.                                                                                |
| **CarouselManager**       | Panel admin para gestionar las imágenes del carrusel de la home. Añadir, reordenar (drag & drop) y eliminar imágenes.                                         |
| **CategoryHomeTemplate**  | Plantilla reutilizable para las homes de sección (Diseño Gráfico y Desarrollo). Combina hero, rejilla de categorías y trabajos recientes.                     |
| **DataActionBar**         | Barra de acciones para la tabla admin: conteo de seleccionados y botones de visibilidad/borrado en lote.                                                      |
| **EditableFieldList**     | Lista dinámica de campos de texto con botones añadir/eliminar. Usada para extras y vídeos en formularios de proyecto.                                         |
| **ImageDropZone**         | Zona de arrastre para gestión de imágenes. Soporta subida, reordenación (drag & drop), previsualización, etiquetas y borrado.                                 |
| **KimoLogin**             | Formulario de login: campo de contraseña, mensajes de error/aviso y botón de envío.                                                                           |
| **MyClients**             | Carrusel horizontal infinito de logos de clientes. Velocidad configurable, pausa en hover, orden aleatorio ponderado por frecuencia.                          |
| **ProjectCarousel**       | Carrusel de imágenes con autoplay (4.5s) y transición animada. Modos: enmarcado (con marco blanco y sombra) o full-width.                                     |
| **ProjectDetailPage**     | Página de detalle de proyecto: imagen principal, galería, metadatos, tech stack, navegación prev/next.                                                        |
| **ProjectSelectorColumn** | Columna de selección de proyectos con checkboxes. Usada en el gestor de trabajos recientes.                                                                   |
| **TechStackTags**         | Botones toggle para seleccionar tecnologías del stack. Opciones predefinidas + campo para añadir personalizadas.                                              |
| **VisitedWorldMap**       | Mapa vectorial mundial con países resaltados y marcadores en coordenadas. Usa jsvectormap.                                                                    |

---

## UI (`src/components/ui/`)

Componentes atómicos y presentacionales.

| Componente              | Descripción                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **BackendOfflineAlert** | Banner de alerta cuando el backend no responde. Incluye botón de reintentar.                                                                    |
| **CategoryCard**        | Tarjeta de navegación para categorías: icono, título, descripción y efecto hover con color configurable.                                        |
| **CategoryHero**        | Hero grande para páginas de categoría: fondo animado, icono, título, descripción y enlace «Volver».                                             |
| **EmptyState**          | Placeholder para secciones sin contenido: emoji (🚧), título «Próximamente» y descripción personalizable.                                       |
| **FormStatusAlert**     | Alerta de estado tras enviar formulario. Variantes: éxito (verde) y error (rojo).                                                               |
| **ImageLightbox**       | Visor de imagen modal a pantalla completa con animación fade, trap de foco y cierre con ESC.                                                    |
| **MobileMenu**          | Menú hamburguesa móvil: overlay animado con enlaces de navegación, bloqueo de scroll.                                                           |
| **PrevNextBtns**        | Par de botones circulares con flechas para navegación prev/next entre ítems.                                                                    |
| **ProjectCard**         | Tarjeta de proyecto con miniatura, título, cliente y barra de tech stack opcional. Tipado genérico `<T extends BaseProject>`.                   |
| **ProjectLine**         | Línea de proyecto para la sección «Trabajos recientes»: número, título, tipo, año con animación hover.                                          |
| **UIButton**            | Botón versátil: renderiza `<a>` o `<button>` según props. Variantes: solid, outline, icon, arrow, save, add. Colores: accent, cta, text, muted. |

---

## Layout (`src/components/layout/`)

Estructura de página y navegación.

| Componente                | Descripción                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **MainLayout**            | Layout raíz: skip link, cabecera, `<Outlet />` (contenido), pie de página. Flex column a pantalla completa.        |
| **MainHeader**            | Cabecera sticky: logo, navegación principal (Diseño, Desarrollo, Contacto), toggle de tema, menú móvil.            |
| **MainFooter**            | Pie de página: copyright, enlace al espacio Kimo, navegación secundaria.                                           |
| **KimoAuthGate**          | Guardia de ruta: redirige a login si el usuario no está autenticado. Pasa `?redirect=` para volver tras login.     |
| **HeroSection**           | Banner hero con título (ReactNode), descripción, CTAs, decorador numérico, imagen opcional y separador triangular. |
| **RecentProjectsSection** | Rejilla de proyectos recientes usando `ProjectLine`.                                                               |
| **SobreSection**          | Sección «Sobre» con layout de dos columnas: etiqueta a la izquierda, texto a la derecha.                           |
| **CategoryGalleryPage**   | Página genérica de galería para categorías: hero, filtros, rejilla de tarjetas de proyecto y estado vacío.         |
| **ScrollToTop**           | Componente invisible que desplaza la página arriba en cada cambio de ruta.                                         |

---

## Resume (`src/components/resume/`)

Componentes del editor y visor de currículum.

| Componente           | Descripción                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| **BasicsAreaFields** | Campos editables del área de diseño o desarrollo del CV: título y resumen.    |
| **CourseRow**        | Fila editable para cursos: nombre, entidad, año, categoría, visibilidad.      |
| **EducationRow**     | Fila editable para formación: título, centro, fechas, categoría.              |
| **ExperienceRow**    | Fila editable para experiencia laboral: cargo, empresa, fechas, descripción.  |
| **LanguageRow**      | Fila editable para idiomas: nombre, nivel, categoría.                         |
| **SkillRow**         | Fila editable para habilidades: nombre, nivel, categoría.                     |
| **SoftwareRow**      | Fila editable para software/tecnologías: nombre, nivel, categoría.            |
| **ToggleGroup**      | Grupo de botones toggle para seleccionar categoría (diseño/desarrollo/ambos). |
| **ToggleIcon**       | Icono toggle para mostrar/ocultar un elemento del CV (ojo abierto/cerrado).   |
| **WorkshopRow**      | Fila editable para talleres: nombre, entidad, año, categoría.                 |

---

## Iconos (`src/components/iconos/`)

Iconos SVG como componentes React. Aceptan `IconProps` (className, size, etc.). Exportados desde un `index.ts` centralizado.

Se dividen en:

- **Iconos funcionales**: trazo (stroke) — flechas, menú, tema, libro, mapa, etc.
- **Logos de tecnología**: relleno (fill) — React, WordPress, JavaScript, HTML, CSS, etc.
