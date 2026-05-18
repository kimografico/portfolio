Feature: Regresiones de contenido, imágenes y tablas

  @all-thumbs-are-generated
  Scenario Outline: Las galerías de proyecto tienen imágenes thumb generadas
    Given el navegador tiene tamaño escritorio
    When navega a la galería de proyecto "<ruta>"
    Then todas las ProjectCard de "<prefijo>" muestran miniaturas

    Examples:
      | ruta                  | prefijo      |
      | /dev/wordpress        | wordpress    |
      | /graphic-design/logotipos | logotipos |

  @books-gallery-fallback-modal
  Scenario: La galería de libros muestra fallback y modal
    Given el usuario está autenticado en Kimo
    And el navegador tiene tamaño escritorio
    When navega a la ruta "/kimo/books"
    Then debería ver el elemento [data-id="books-gallery-grid"]
    Then la portada del libro "La isla misteriosa" usa el fallback
    When abre la portada del libro "La isla misteriosa"
    Then se muestra el modal del libro "La isla misteriosa"
    When cierra el modal con Escape
    Then el modal del libro no está visible

  @books-table-filter-title
  Scenario: La tabla de libros filtra por título
    Given el usuario está autenticado en Kimo
    And el navegador tiene tamaño escritorio
    When navega a la ruta "/kimo/books"
    And cambia a vista tabla
    And filtra los libros por título "Juego de tronos"
    Then la fila del libro "Juego de tronos" es visible

  @places-table-sort-city
  Scenario: La tabla de lugares carga y se puede ordenar por ciudad
    Given el usuario está autenticado en Kimo
    And el navegador tiene tamaño escritorio
    When navega a la ruta "/kimo/places"
    Then debería ver el mapa de lugares
    And debería ver la tabla de lugares
    When ordena la tabla por ciudad
    Then la primera fila de lugares contiene "Andorra"
