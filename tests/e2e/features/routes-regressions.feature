Feature: Regresiones de rutas y UI global

  Scenario Outline: Cada sección principal carga su contenido esperado
    Given el navegador tiene tamaño escritorio
    When navega a la ruta "<ruta>"
    Then debería ver el elemento <selector>

    Examples:
      | ruta             | selector                           |
      | /                | [data-id="home-page"]             |
      | /graphic-design  | [data-id="graphic-design-home"]   |
      | /dev             | [data-id="developer-home"]        |
      | /contacto        | [data-id="contact-page"]          |

  Scenario: Las rutas protegidas de Kimo cargan con sesión
    Given el usuario está autenticado en Kimo
    And el navegador tiene tamaño escritorio
    When navega a la ruta "/kimo/books"
    Then debería ver el elemento [data-id="books-page"]
    When navega a la ruta "/kimo/places"
    Then debería ver el elemento [data-id="places-page"]

  Scenario: Kimo redirige al login cuando no hay sesión
    Given el usuario no está autenticado en Kimo
    When navega a la ruta "/kimo/books"
    Then debería ver el heading "Acceso a Kimo"
    And no debería ver el elemento [data-id="books-page"]

  Scenario: El menú responsive funciona en móvil y escritorio
    Given el navegador tiene tamaño móvil
    When navega a la ruta "/"
    Then debería ver el botón del menú móvil
    And no debería ver la navegación de escritorio
    When abre el menú móvil
    And pulsa el enlace "Contacto" del menú móvil
    Then debería ver el elemento [data-id="contact-page"]
    When cambia el navegador a escritorio
    And navega a la ruta "/"
    Then debería ver la navegación de escritorio
    And no debería ver el botón del menú móvil

  Scenario: El modo oscuro cambia el tema del documento
    Given el navegador tiene tamaño escritorio
    When navega a la ruta "/"
    Then el documento tiene tema "light"
    When activa el tema
    Then el documento tiene tema "dark"
