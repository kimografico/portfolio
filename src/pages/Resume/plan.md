# PLAN — ResumePage (Curriculum)

## Objetivo

Implementar una sección de Curriculum (Resume) con dos variantes (Diseño y Desarrollo), datos centralizados en JSON, descarga dinámica en PDF y estructura simple (sin componentización excesiva, layout por CSS).

---

## Fases del desarrollo

1. **Definición de datos y estructura**
   - Crear `/src/data/resume.json` con la estructura acordada (sin datos personales sensibles, sin premios).
   - Incluir campos: basics, skills, experience, education, languages, certifications, projects.
   - Añadir campo `category` en bloques para filtrar por página.

2. **Páginas Resume**
   - Crear `ResumeDesignPage.tsx` y `ResumeDevelopmentPage.tsx` en `/src/pages/Resume/`.
   - Ambas páginas leen el mismo JSON y filtran según la categoría.
   - Layout y estilos gestionados por CSS, no por componentes pequeños.

3. **Compatibilidad futura con PDF**
   - El layout y los datos se estructuran para ser compatibles con generación dinámica de PDF en el futuro.
   - No se implementa aún la descarga, pero se deja preparado para integrar `@react-pdf/renderer` o similar más adelante.

4. **Accesibilidad y SEO**
   - Usar estructura semántica y roles adecuados.
   - Etiquetas ARIA donde sea necesario.

5. **Internacionalización (opcional/futuro)**
   - Permitir múltiples archivos JSON por idioma y método para comparar equivalencia.

---

## Decisiones clave

- No se componentizan las secciones del CV: el layout se controla por CSS y estructura clara.
- No se incluyen datos personales sensibles ni premios.
- El PDF se implementará en una fase futura, pero la estructura será compatible desde el inicio.
- El JSON es la única fuente de verdad.

---

## Resultados esperados

- Dos páginas de curriculum, filtradas y con layout profesional.
- Descarga de PDF siempre actualizada.
- Fácil actualización y mantenimiento.
- Cumplimiento de buenas prácticas para ATS/IA y accesibilidad.
