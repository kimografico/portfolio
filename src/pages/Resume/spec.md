# SDD — ResumePage (Curriculum)

## Objetivo

Implementar una sección de Curriculum (Resume) en el portfolio, con dos variantes:

- Resume orientado a Diseño
- Resume orientado a Desarrollo

Ambos comparten datos base, pero muestran información filtrada y adaptada a cada perfil. El curriculum se mantiene en un único archivo JSON, y se puede descargar en PDF generado dinámicamente.

---

## Requisitos funcionales

1. **Datos centralizados**
   - Toda la información del CV se almacena en `/src/data/resume.json`.
   - El JSON sigue una estructura normalizada, inspirada en [JSON Resume](https://jsonresume.org/), con campos estándar (`basics`, `skills`, `experience`, etc).
   - Cada bloque puede tener un campo `category` (`design`, `development`, `common`) para filtrar.

2. **Dos páginas de curriculum**
   - `/resume/design` y `/resume/development`.
   - Ambas usan los mismos componentes y datos, pero filtran según la categoría.
   - El layout es claro, semántico y compatible con ATS/IA.

3. **Componentes reutilizables**
   - Secciones: Datos básicos, experiencia, educación, skills, idiomas, certificaciones, proyectos...

4. **Descarga de PDF**
   - Botón para descargar el curriculum en PDF.
   - El PDF se genera dinámicamente desde el mismo JSON y layout, usando `@react-pdf/renderer` o similar.
   - El PDF es accesible, semántico y compatible con ATS.

5. **Accesibilidad y SEO**
   - Estructura semántica (`<section>`, `<h1>`, `<h2>`, listas...)
   - Etiquetas ARIA donde sea necesario.

6. **Internacionalización (opcional)**
   - Habrá un JSON distinto por idioma, pero se generará un método que compare ambos para asegurar que tienen la misma cantidad de elementos.

---

## Estructura de archivos

```
src/
  data/
    resume.json
  pages/
    Resume/
      ResumeDesignPage.tsx
      ResumeDevelopmentPage.tsx
      spec.md
```

---

## JSON de ejemplo (`resume.json`)

```json
{
  "basics": {
    "name": "Nombre Apellido",
    "title": "Diseñador & Desarrollador",
    "summary": "Perfil profesional breve..."
  },
  "skills": [
    { "name": "React", "category": "development" },
    { "name": "Figma", "category": "design" }
  ],
  "experience": [
    {
      "company": "...",
      "role": "...",
      "category": ["design", "development"],
      "start": "...",
      "end": "...",
      "description": "...",
      "achievements": ["..."]
    }
  ],
  "education": [...],
  "languages": [...],
  "certifications": [...],
  "projects": [...]
}
```

---

## Criterios de aceptación

- [ ] El curriculum se muestra correctamente en ambas páginas, filtrando por categoría.
- [ ] El PDF generado es fiel al layout y datos de la web.
- [ ] El JSON es fácil de actualizar y ampliar.
- [ ] El código cumple las convenciones del proyecto (tipado, data-id, accesibilidad, clean code).
- [ ] No hay duplicidad de datos ni lógica.
- [ ] El curriculum es compatible con ATS/IA y humanos.
- [ ] El diseño es claro, profesional y accesible.
