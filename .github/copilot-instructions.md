# copilot-instructions

## Stack y convenciones

- Usar React 18+ con TypeScript y Vite.
- Gestor de paquetes: pnpm (no usar npm ni yarn).
- Dependencias e instalaciones en package.json (en la raíz del proyecto).
- CSS: Tailwind + archivos CSS externos (no usar CSS-in-JS de más de un parámetro).
- Testing: Vitest + Testing Library.
- Estructura de carpetas según spec.md.
- Los datos se gestionan en archivos JSON en /src/data:
  - `books.json`: Libros leídos con portadas y metadatos.
  - `places.json`: Lugares visitados con coordenadas y fechas.
  - `recent-works.json`: Proyectos recientes para landing.
- Iconos reutilizables en `/src/components/iconos` como componentes React.
- Scripts disponibles: `pnpm run dev`, `pnpm run build`, `pnpm run lint`, `pnpm run test`, `pnpm run check`.

### Atributos de Testing y Ubicación (data-id)

Todos los componentes principales, secciones y elementos interactivos deben llevar el atributo `data-id` con un nombre semántico y único. Esto facilita:

- **Tests E2E**: Localizar elementos de forma robusta sin acoplar a clases CSS o estructura visual.
- **Debugging visual**: Identificar rápidamente qué bloque de código corresponde a cada elemento.
- **Mantenibilidad**: Los cambios de estilo no rompen los selectores de tests.

**Convenciones de nomenclatura:**

- Usar kebab-case: `data-id="element-name"`
- Ser específico y descriptivo: `books-page`, `books-gallery-grid`, `places-map`, etc.
- Para elementos dinámicos con índice, incluirlo: `data-id="illustration-card-${id}"`
- Nombres comunes: `*-page`, `*-section`, `*-grid`, `*-table`, `*-filter`, `*-modal`, `*-lightbox`, `*-btn`, `*-wrapper`

**Dónde añadir data-id:**

- Secciones principales (`<section>`, `<div>` de contenedor de página)
- Componentes interactivos (botones, filtros)
- Grillas y listas (`grid`, `gallery`, `table`)
- Modales y lightbox
- Envolturas de componentes complejos
- Elementos que serán referenciados en tests E2E

## Flujo de trabajo

### Evolutivos y cambios

1. **Primera fase - Monolítico**: Todo el código nuevo se implementa en un único archivo.
2. **Segunda fase - Plan de componentes**: Se genera un markdown con posibilidades de componentización (decidido por el usuario).
3. **Tercera fase - Extracción**: Se crean componentes manualmente según el plan, paso a paso.
4. **Extracción de estilos**: Al refactorizar, se extrae CSS a archivos `.css` con el mismo nombre del componente.
5. **Interfaces centralizadas**: Las interfaces y tipos se organizan en `/src/interfaces`.

### Gestión de cambios

- Los cambios deben ser atómicos y bien justificados.
- **NO hacer commit automáticamente**: solo compilar/verificar si se solicita explícitamente en el prompt.
- Los commits (cuando se hagan) deben ser claros y en inglés.
- No modificar archivos fuera del proyecto salvo que se indique.
- No instalar dependencias globales.

## Estilo de código

- Seguir las reglas de ESLint y Prettier del proyecto.
- Usar imports relativos dentro de src/.
- Seguir los principios de clean code y SOLID.
- Escribir código autoexplicativo, con nombres claros y concisos.
- Comentar partes complejas del código, pero no sobrecomentar.
- Antes de escribir código, piensa: ¿Entiendo lo que me piden? ¿Cual es la solución más simple? ¿Hay edge cases que debo considerar?
- Escribir codigo que pueda entender un desarrollador junior, explicando conceptos avanzados cuando sea necesario.
- Una pequeña cantidad de codigo repetido es mejor que una abstracción forzada. No hay que evitar la repetición a toda costa.

## Testing

- Todo componente nuevo debe tener al menos un test básico.
- Los tests deben estar en /tests.

## Exclusiones

- No modificar archivos de configuración de la empresa (globales o fuera del repositorio).
- No usar Storybook salvo que se indique explícitamente.

## Proyecto didáctico

Este proyecto es de carácter didáctico.
Copilot debe explicar cómo funcionan las cosas y por qué se hacen de cierta manera o de otra, actuando como un profesor.
Las respuestas deben incluir explicaciones claras de los conceptos, decisiones técnicas y alternativas cuando sea relevante.
Se explicará la arquitectura del proyecto, la estructura de carpetas, el flujo de datos y cualquier patrón de diseño utilizado.
Se fomentará el aprendizaje y la comprensión profunda del código, no solo la generación de código funcional.
Es importante seguir las buenas prácticas, convenciones de clean code y SOLID, explicando cómo se aplican en el contexto del proyecto.
Se usaran comentarios en el código para explicar partes específicas, pero las respuestas de Copilot deben ser completas y no depender exclusivamente de los comentarios para transmitir la información.

## Verificación y completitud de tareas

Para cada tarea, Copilot debe:

1. **Crear un mini-plan** antes de comenzar:
   - Desglosar la tarea en pasos específicos.
   - Identificar archivos a modificar o crear.
   - Prever posibles problemas o dependencias.

2. **Ejecutar la tarea** según el plan.

3. **Verificar completitud y errores** al final:
   - Ejecutar verificación de tipos (`pnpm run typecheck` si es necesario).
   - Revisar errores de lint y corregirlos.
   - Comprobar imports y referencias.
   - Validar que no haya partes incompletas, código duplicado o fallos.
   - Confirmar que la funcionalidad implementada es correcta (sin regresiones).

4. **Reportar el resultado**: Explicar brevemente qué se completó y si hay algún ajuste pendiente.

**Nota crítica**: Este proceso es especialmente importante con modelos GPT 4.1 que tienden a romper archivos pegando código en lugares inadecuados. Siempre verificar la integridad del fichero.

## Errores comunes a evitar

- Siempre tipar explícitamente BaseTable y las columnas con el tipo de celda real (por ejemplo, `string`, `number`, `string | undefined`, etc). No usar `any` ni tipos genéricos ambiguos.
- Si una celda puede devolver JSX, usar `ReactNode` como tipo de celda.
- El tipo de columna (`ColumnDef<T, TValue>`) debe coincidir exactamente con el tipo de dato que devuelve el accessor o cell.
- Si se necesita un tipo común para celdas, debe declararse en `/src/interfaces` y usarse de forma explícita.
- No importar tipos dentro de funciones ni scopes locales: todos los imports de tipos deben ir al toplevel del archivo.
- Así se evitan errores de tipado, incompatibilidades y problemas de linting con TanStack Table v8 y ESLint.
- Elimina siempre `import React from 'react'` si no es necesario.
- Tras cada cambio, revisa y optimiza los imports de todos los archivos modificados, eliminando los que no se usen y ordenando los necesarios.

## Lint y revisión automática

Al finalizar cada cambio, Copilot debe:

- Revisar y corregir los errores y warnings reportados por el editor (diagnósticos de lint, formato, imports, etc.).
- Optimizar los imports de los archivos modificados.
- Corregir cualquier otro problema de formato, importación o warning relevante detectado automáticamente.
- Comprobar que no falten etiquetas, paréntesis o llaves abiertas/cerradas después de cada cambio.

## Corrección de errores por consola

Si te pego un error de consola, sin preguntarme antes, debes:

1. Analizar el error y entender su causa.
2. Localizar el código responsable del error.
3. Corregir el código para resolver el error.
4. Verificar que el error se ha resuelto y que no se han introducido nuevos errores.

---
