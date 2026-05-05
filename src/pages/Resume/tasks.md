# TASKS — ResumePage (Curriculum)

## Tareas principales

1. **Definir estructura de datos**
   - [ ] Crear `/src/data/resume.json` con la estructura base y datos de ejemplo.
   - [ ] Añadir campo `category` en bloques para filtrar.

2. **Crear páginas**
   - [ ] Crear `ResumeDesignPage.tsx` y `ResumeDevelopmentPage.tsx` en `/src/pages/Resume/`.
   - [ ] Implementar carga y filtrado de datos desde el JSON.
   - [ ] Aplicar layout y estilos por CSS (no componentizar secciones).

3. **Compatibilidad futura con PDF**
   - [ ] Estructurar el layout y los datos para que sean compatibles con generación dinámica de PDF en el futuro.
   - [ ] (La implementación de la descarga se hará en una fase posterior).

4. **Accesibilidad y SEO**
   - [ ] Usar estructura semántica (`<section>`, `<h1>`, `<h2>`, listas...)
   - [ ] Añadir roles y ARIA donde sea necesario.

5. **Internacionalización (opcional)**
   - [ ] Permitir múltiples archivos JSON por idioma y método de comparación.

## Checklist de validación

- [ ] El curriculum se muestra correctamente en ambas páginas.
- [ ] El PDF generado es fiel al layout y datos de la web.
- [ ] El JSON es fácil de actualizar y ampliar.
- [ ] El código cumple las convenciones del proyecto.
- [ ] No hay duplicidad de datos ni lógica.
- [ ] El curriculum es compatible con ATS/IA y humanos.
- [ ] El diseño es claro, profesional y accesible.
