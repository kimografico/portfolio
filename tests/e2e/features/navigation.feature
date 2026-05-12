Feature: Navegación general

  @navegacionHeaderHome 
  @smoke
  
  Scenario: El usuario puede navegar a todas las páginas principales desde el menú y volver a la home con el logo
    Given el usuario está en la página de inicio
    When navega a la página de diseño gráfico desde el menú
    Then debería ver la página de diseño gráfico
    When navega a la página de desarrollo web desde el menú
    Then debería ver la página de desarrollo web
    When navega a la página de contacto desde el menú
    Then debería ver la página de contacto
    When hace clic en el logo
    Then debería volver a la página de inicio
