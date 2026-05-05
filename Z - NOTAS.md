# Otras tareas

Añadir este proyecto a "React"
Añadir proyectos mas nuevos
Reescribir recent-works

---

Revisar que el editar no este añadiendo el prefijo portfolio

---

Modo oscuro falla en:

- books-view-table-btn
- inputs de texto en addProject, ProjectTable y BookTable (filtros)
- modales
- fondo del mapa
- fondo de iconGallery

---

**Añadir**

- Gestión de recent-works (all, graphicDesign, developer)
- Curriculum (ver como se gestiona)

---

El modo oscuro necesita algunos arreglos. La solución en la mayoría de ellos sería tirar del src/styles/variables.css para que los colores cambien al cambiar de modo. Si hay que añadir alguno, se añade (pero si ya existe alguno parecido nos lo ahorramos).

- books-view-table-btn (Cambia de color el fondo pero el texto se mantiene negro)
- inputs de texto en addProject, ProjectTable y BookTable (filtros) (Los inputs siguen con fondo blanco y texto gris/negro en darkmode)
- modales (el fondo no cambia, seguramente esté tirando de otros colores de css)
- fondo del mapa (se queda azul claro, deberia cambiar a negro puro)
- fondo de iconGallery (se queda el fondo claro, deberia ser fondo negro y icono claro)
