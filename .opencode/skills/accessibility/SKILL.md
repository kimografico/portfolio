---
name: accessibility
description: >
  WCAG 2.1 AA accessibility checklist and patterns for kimografico React + Tailwind components.
  Use when: auditing or building any UI component, page, or interactive element.
  Triggers: "accesibilidad", "a11y", "aria", "wcag", "contraste", "teclado", "foco".
license: MIT
metadata:
  author: kimografico
  version: "1.0"
---

# Accessibility Skill — kimografico

Estándar objetivo: **WCAG 2.1 nivel AA**. Stack: React 18 + TypeScript + Tailwind CSS.

---

## Principio de jerarquía

```
1. HTML semántico nativo      → siempre primero
2. ARIA solo si el nativo no alcanza
3. JavaScript de accesibilidad solo si 1 y 2 no son suficientes
```

Si un elemento tiene un rol nativo correcto (`button`, `nav`, `main`, `table`...), no añadir `role` manualmente. Los roles manuales incorrectos son peores que no tenerlos.

---

## 1. HTML Semántico

### Estructura de página

```tsx
// Estructura mínima de cualquier página
<>
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Saltar al contenido principal
  </a>
  <Header /> {/* <header> con <nav> */}
  <main id="main-content">
    <h1>Título de la página</h1>
    {/* contenido */}
  </main>
  <Footer /> {/* <footer> */}
</>
```

- [ ] Cada página tiene exactamente **un `<h1>`**
- [ ] La jerarquía de headings es secuencial: h1 → h2 → h3 (nunca saltar)
- [ ] Existe un skip link "Saltar al contenido principal" visible al recibir foco
- [ ] `<main>` existe y envuelve el contenido principal
- [ ] `<nav>` tiene `aria-label` si hay más de uno en la página (`aria-label="Principal"`, `aria-label="Breadcrumb"`)

### Landmarks

```tsx
<header>          // landmark: banner
<nav>             // landmark: navigation
<main>            // landmark: main
<aside>           // landmark: complementary
<footer>          // landmark: contentinfo
<section aria-labelledby="section-id">  // landmark: region (solo con label)
```

---

## 2. Imágenes

```tsx
// ✅ Imagen significativa — describir el contenido, no el objeto
<img src="..." alt="Portada de El nombre del viento, de Patrick Rothfuss" />

// ✅ Imagen decorativa — alt vacío (el lector la ignora)
<img src="divider.svg" alt="" aria-hidden="true" />

// ❌ MAL — es una descripción del archivo, no del contenido
<img src="libro.jpg" alt="libro.jpg" />
<img src="portada.jpg" alt="Imagen" />
```

- [ ] Todas las imágenes tienen `alt`
- [ ] Las decorativas tienen `alt=""` y `aria-hidden="true"`
- [ ] Los `alt` describen el **significado**, no el aspecto técnico

---

## 3. Botones, enlaces y controles interactivos

### Botones

```tsx
// ✅ Texto visible
<button onClick={handleToggle}>Ver como tabla</button>

// ✅ Solo icono — necesita aria-label
<button onClick={handleClose} aria-label="Cerrar modal">
  <XIcon aria-hidden="true" />
</button>

// ❌ MAL — div con onClick no tiene focus, rol ni keyboard gratis
<div onClick={handleClick} className="cursor-pointer">Click</div>
```

- [ ] Todos los botones tienen texto visible o `aria-label`
- [ ] Los iconos dentro de botones tienen `aria-hidden="true"`
- [ ] Los botones de toggle tienen `aria-pressed` cuando comunican estado

### Estados de botón toggle

```tsx
<button
  onClick={handleToggle}
  aria-pressed={vista === "tabla"}
  className={vista === "tabla" ? "bg-accent" : "bg-transparent"}
>
  Vista tabla
</button>
```

### Enlaces

```tsx
// ✅ Texto descriptivo
<a href="/kimo/libros">Ver mis libros</a>

// ❌ MAL — no describe el destino
<a href="/kimo/libros">Haz click aquí</a>
<a href="/kimo/libros">Más</a>

// ✅ Enlace externo — avisar al usuario
<a href="https://github.com/..." target="_blank" rel="noopener noreferrer">
  Ver repositorio <span className="sr-only">(abre en nueva pestaña)</span>
  <ExternalLinkIcon aria-hidden="true" />
</a>
```

---

## 4. Formularios

```tsx
<div className="flex flex-col gap-1.5">
  {/* Label SIEMPRE asociado — nunca solo placeholder */}
  <label htmlFor="email" className="text-sm font-medium">
    Correo electrónico
  </label>

  <input
    id="email"
    type="email"
    name="email"
    autoComplete="email"
    aria-describedby="email-error" // apunta al error cuando existe
    aria-invalid={hasError}
    className="..."
  />

  {hasError && (
    <span id="email-error" role="alert" className="text-xs text-red-600">
      El correo no tiene un formato válido
    </span>
  )}
</div>
```

- [ ] Cada `input` tiene un `label` con `htmlFor` = `id` del input
- [ ] No se usa solo `placeholder` como label
- [ ] Los errores de validación usan `role="alert"` y `aria-describedby`
- [ ] `aria-invalid="true"` en el input cuando hay error
- [ ] Los campos obligatorios tienen `required` (no solo `*` visual)

---

## 5. Tablas (TanStack Table)

```tsx
<table>
  <caption className="sr-only">
    Lista de libros leídos, ordenable por columna
  </caption>
  <thead>
    <tr>
      <th
        scope="col"
        aria-sort={sorted ? (sortDesc ? "descending" : "ascending") : "none"}
      >
        <button>Título</button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>El nombre del viento</td>
    </tr>
  </tbody>
</table>
```

- [ ] Las tablas tienen `<caption>` (puede ser `sr-only` si hay título visible)
- [ ] Los `<th>` de columna tienen `scope="col"`, los de fila `scope="row"`
- [ ] Las columnas ordenables tienen `aria-sort`: `'ascending'` | `'descending'` | `'none'`
- [ ] No se usan divs anidados para simular tablas con datos tabulares

---

## 6. Navegación por teclado

```tsx
// El orden de tabulación debe seguir el orden visual
// No usar tabIndex > 0 (rompe el orden natural)

// ❌ MAL — rompe el tab order y confunde a usuarios de teclado
<button tabIndex={3}>Primero visualmente, tercero en tab</button>

// ✅ Solo estos valores son válidos:
tabIndex={0}    // añadir al tab order natural (para elementos no-interactivos que necesitan focus)
tabIndex={-1}   // sacar del tab order pero permitir focus programático (modales, etc.)
```

- [ ] Todos los elementos interactivos son alcanzables con `Tab`
- [ ] El orden de tabulación sigue el flujo visual (arriba-abajo, izquierda-derecha)
- [ ] No hay `tabIndex` con valores positivos
- [ ] Los modales capturan el foco al abrirse y lo devuelven al elemento disparador al cerrarse
- [ ] Se puede cerrar cualquier overlay con `Escape`

### Focus visible

```css
/* tailwind.config.js – asegurar que los focus rings son visibles */
/* Nunca hacer esto: */
*:focus {
  outline: none;
}

/* El proyecto debe tener: */
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

- [ ] El foco es **siempre visible** en todos los elementos interactivos
- [ ] No se usa `outline: none` sin alternativa visible

---

## 7. Contraste de color (WCAG AA)

| Tipo de texto                          | Ratio mínimo AA |
| -------------------------------------- | --------------- |
| Texto normal (< 18px / < 14px bold)    | **4.5:1**       |
| Texto grande (≥ 18px / ≥ 14px bold)    | **3:1**         |
| Componentes UI e iconos significativos | **3:1**         |

### Paleta del proyecto verificada

Con la paleta Swiss del proyecto (`--color-text: #1A1917` sobre `--color-bg: #F8F7F4`):

```
#1A1917 sobre #F8F7F4 → ratio ~16:1 ✅ (supera AAA)
#9E9C96 sobre #F8F7F4 → ratio ~2.8:1 ⚠️  (solo válido para texto > 18px)
```

- [ ] Verificar el color muted (`--color-muted: #9E9C96`) en textos pequeños
- [ ] El acento elegido supera 3:1 sobre el fondo en su uso como UI component

**Herramienta:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 8. Movimiento y animaciones

```css
/* OBLIGATORIO en el proyecto — ya incluido en el design skill */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] El media query `prefers-reduced-motion` está activo globalmente
- [ ] No hay animaciones de contenido esenciales (que transmitan información solo por movimiento)

---

## 9. Sección personal (`/kimo`) — noindex

```tsx
// En cada página bajo /kimo — ya especificado en specifications.md
<Helmet>
  <meta name="robots" content="noindex, nofollow" />
</Helmet>

// O directamente en el layout de la sección personal:
<head>
  <meta name="robots" content="noindex, nofollow" />
</head>
```

---

## 10. Clases utilitarias de Tailwind para accesibilidad

```tsx
// Texto solo para lectores de pantalla (invisible visualmente)
className="sr-only"

// Elemento sr-only que se hace visible al recibir foco (skip link)
className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
           focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black"

// Ocultar de lectores de pantalla (decorativo)
aria-hidden="true"
```

---

## Antipatrones prohibidos

```tsx
// ❌ Rol manual en elemento nativo
<button role="button">     // redundante pero inofensivo
<nav role="navigation">    // redundante pero inofensivo
<div role="button">        // PELIGROSO — sin keyboard, sin focus natural

// ❌ aria-label en elemento con texto visible (duplica el anuncio)
<button aria-label="Cerrar modal">Cerrar modal</button>
// ✅ aria-label solo cuando no hay texto visible

// ❌ Color como ÚNICO indicador de estado
<span className="text-red-500">Campo obligatorio</span>
// ✅ Color + texto + icono

// ❌ Placeholder como label
<input placeholder="Tu nombre" />
// ✅ Siempre label + placeholder juntos

// ❌ Links sin destino
<a href="#">Ver más</a>
// ✅ href con URL real o un <button> si es una acción
```
