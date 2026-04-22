# copilot-instructions

## Stack y convenciones

- Usar React 18+ con TypeScript y Vite.
- Gestor de paquetes: pnpm (no usar npm ni yarn).
- CSS: Tailwind, no usar CSS-in-JS.
- Testing: Vitest + Testing Library.
- Estructura de carpetas según spec.md.
- Los datos se gestionan en archivos JSON en /data.

## Flujo de trabajo

- Los cambios deben ser atómicos y bien justificados.
- Los commits deben ser claros y en inglés.
- No modificar archivos fuera de /portfolio salvo que se indique (por normas de empresa).
- No instalar dependencias globales.
- No usar servicios externos salvo GitHub Actions y GitHub Pages.

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

## Diario

Después de cada cambio significativo, Copilot escribirá una entrada en el diario del proyecto (DIARIO.md) explicando qué se hizo y por qué se hizo.
Cada entrada del diario debe empezar por una etiqueta [frontend], [tests], [componente], etc...

## Lint y revisión automática

- Al finalizar cada cambio, Copilot debe:
  - Revisar y corregir los errores y warnings reportados por el editor (diagnósticos de lint, formato, imports, etc.).
  - Optimizar los imports de los archivos modificados.
  - Corregir cualquier otro problema de formato, importación o warning relevante detectado automáticamente.
  - Explicar en el diario cualquier corrección automática realizada tras el cambio principal.

---
