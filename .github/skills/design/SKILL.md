---
name: frontend-design
description: >
  Build production-grade frontend UI for kimografico following the Swiss Minimalism aesthetic.
  Use when: building components, pages, layouts, or any visual element.
  Triggers: "diseña", "crea componente", "UI de", "página de", "cómo debería verse", "estilos de".
license: MIT
metadata:
  author: kimografico
  version: "1.0"
---

# Frontend Design Skill — kimografico

Estética fijada: **Minimalismo Suizo**. Este skill no ofrece opciones de estilo; la dirección ya está decidida. Implementa con precisión y convicción, sin ceder a los patrones genéricos de la IA.

---

## 1. Estética: Minimalismo Suizo

> "La forma sigue a la función. La tipografía manda. El espacio vacío es contenido."

| Pilar | Aplicación concreta |
|-------|---------------------|
| **Tipografía primero** | La jerarquía visual se comunica con tipo, peso y espaciado — no con color ni ornamentos |
| **Grid estricto** | Todo se alinea. Nada flota arbitrariamente. |
| **Espacio generoso** | El blanco no es vacío, es estructura |
| **Paleta contenida** | Monocromático + un único acento. Nunca más de dos colores funcionales |
| **Movimiento casi invisible** | Las animaciones existen para confirmar interacciones, no para llamar la atención |

**La pregunta de oro antes de cualquier decisión:** ¿esto sirve al contenido o sirve al decorado?

---

## 2. Tipografía

### Fuentes del proyecto

```css
/* Display / Headings */
font-family: 'DM Sans', sans-serif;   /* opción A — limpio, geométrico */
font-family: 'Archivo', sans-serif;   /* opción B — más austero, editorial */

/* Body / UI */
font-family: 'DM Sans', sans-serif;

/* Monospace (datos, fechas, tablas) */
font-family: 'JetBrains Mono', monospace;
```

Carga desde Google Fonts. Usa **siempre una sola familia** por proyecto para máxima coherencia.

### Escala tipográfica

| Token | Tailwind | Uso |
|-------|----------|-----|
| `text-xs` | `text-xs tracking-widest uppercase` | Labels, metadatos |
| `text-sm` | `text-sm leading-relaxed` | Cuerpo secundario, captions |
| `text-base` | `text-base leading-relaxed max-w-[65ch]` | Cuerpo principal |
| `text-xl` | `text-xl font-medium tracking-tight` | Subtítulos |
| `text-3xl` | `text-3xl md:text-5xl font-semibold tracking-tight leading-none` | Títulos de sección |
| `text-5xl` | `text-5xl md:text-7xl font-bold tracking-tighter leading-none` | Hero / Display |

### Reglas absolutas de tipografía

- **PROHIBIDO:** Inter, Roboto, Arial, system-ui, Space Grotesk
- Los h1 no necesitan ser inmensos para dominar — usa peso y contraste
- `max-w-[65ch]` en todo párrafo de cuerpo sin excepción
- Serif: PROHIBIDO en este proyecto (no es editorial, es portfolio técnico)
- Jerarquía mediante `font-weight` y `letter-spacing`, nunca solo tamaño

---

## 3. Color

### Paleta

```css
:root {
  /* Base */
  --color-bg:       #F8F7F4;    /* blanco cálido, no puro */
  --color-surface:  #FFFFFF;
  --color-border:   #E5E4E0;
  --color-muted:    #9E9C96;    /* texto secundario */
  --color-text:     #1A1917;    /* casi negro, no #000000 */

  /* Acento único — decidir uno y no cambiar */
  --color-accent:   #1A1917;    /* modo monocromático puro */
  /* — o — */
  --color-accent:   #D4542A;    /* terracota cálida */
  /* — o — */
  --color-accent:   #2E5BFF;    /* azul eléctrico frío */
}
```

### Reglas de color

- **PROHIBIDO:** `#000000` puro — usa off-black (`zinc-950`, `#1A1917`)
- **PROHIBIDO:** gradientes de texto en headings
- **PROHIBIDO:** glow exterior (`box-shadow` de color saturado)
- **PROHIBIDO:** paleta AI: morado/violeta, neón, aurora sobre blanco
- Un único acento en todo el proyecto. Se elige en `sdd-design` y no se toca
- Los grays deben ser todos cálidos o todos fríos — nunca mezclar
- `border-color` siempre tintado ligeramente (nunca `border-gray-200` genérico)

---

## 4. Layout y composición

### Grid base

```html
<!-- Contenedor de página -->
<div class="max-w-5xl mx-auto px-6 md:px-12">

<!-- Sección con espacio generoso -->
<section class="py-20 md:py-32">

<!-- Grid asimétrico (preferir sobre 3 columnas iguales) -->
<div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
```

### Reglas de layout

- **PROHIBIDO:** `h-screen` — usar `min-h-[100dvh]`
- **PROHIBIDO:** `w-[calc(33%-1rem)]` — usar CSS Grid
- **PROHIBIDO:** tres cards horizontales iguales — usar zig-zag, grid asimétrico o lista editorial
- **PROHIBIDO:** centrado total en heroes con `DESIGN_VARIANCE > 4` — preferir alineación izquierda o split screen
- Asimetría controlada: offset con `margin-top: -2rem`, aspect ratios variados, grandes zonas vacías
- En móvil (`< md:`): **siempre** columna única, sin layouts asimétricos
- Usar `border-t` o `divide-y` para separar secciones en lugar de cards con sombra

### Espaciado

Escala estricta: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128px`. No inventar valores intermedios.

---

## 5. Movimiento y animaciones

### Configuración base (Swiss Subtle)

```
MOTION_INTENSITY: 3/10 — solo CSS transitions y keyframes
```

En Minimalismo Suizo, la animación confirma, no protagoniza. Una transición mal calibrada rompe la sobriedad de todo el sistema.

### Lo que está permitido

```css
/* Transición base — aplicar a TODOS los elementos interactivos */
transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

/* Hover lift sutil */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

/* Reveal de entrada — stagger por CSS */
.item {
  animation: fadeUp 0.4s ease both;
  animation-delay: calc(var(--index) * 60ms);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Feedback táctil en botones */
button:active {
  transform: scale(0.98) translateY(1px);
}
```

### Reglas de movimiento

- **Animar solo:** `transform` y `opacity`. Nunca `top`, `left`, `width`, `height`
- **Duración:** 150ms - 400ms. Nada más. Las entradas de página: 400ms máximo
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` para interacciones, `ease` para reveals
- **PROHIBIDO:** animaciones infinitas en componentes estándar (pulso, shimmer perpetuo)
- **PROHIBIDO:** magnetic buttons, physics spring, parallax agresivo
- **PROHIBIDO:** `will-change: transform` en más de 3 elementos por página
- **Framer Motion:** solo si ya está instalado (verificar `package.json`). Si se usa, solo para `layout`/`layoutId` transitions — nunca para `useMotionValue` de mouse tracking
- **prefers-reduced-motion:** siempre respetar

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Componentes e interacciones

### Estados interactivos (obligatorios)

Nunca entregar solo el estado de éxito. Implementar siempre:

| Estado | Implementación |
|--------|----------------|
| **Loading** | Skeleton con `animate-pulse` que replica el layout real |
| **Empty** | Estado vacío con texto descriptivo, sin iconos genéricos |
| **Error** | Mensaje inline bajo el campo, color `text-red-600` |
| **Hover** | `translateY(-2px)` o cambio de `border-color`, nunca glow |
| **Active/Press** | `scale(0.98)` o `translateY(1px)` |
| **Focus** | Ring visible — nunca `outline: none` sin alternativa |

### Cards

Usar cards **solo cuando la elevación comunica jerarquía**. Alternativas preferidas:

```html
<!-- Separación por línea (preferida en listas) -->
<div class="divide-y divide-[var(--color-border)]">

<!-- Separación por espacio (preferida en grids) -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-12">

<!-- Card solo cuando se necesita elevación real -->
<div class="bg-white border border-[var(--color-border)] rounded-lg p-6
            hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]
            transition-shadow duration-200">
```

### Formularios

```html
<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-[var(--color-text)]">
    Nombre del campo
  </label>
  <input class="border border-[var(--color-border)] rounded-md px-3 py-2
                text-sm placeholder:text-[var(--color-muted)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
                focus:border-transparent transition-all duration-150" />
  <span class="text-xs text-[var(--color-muted)]">Texto de ayuda opcional</span>
  <!-- Error: -->
  <span class="text-xs text-red-600">Mensaje de error</span>
</div>
```

---

## 7. Imágenes

### Fotografía real

Solo URLs directas que terminen en `.jpg` / `.png`. Nunca inventar URLs.

```html
<!-- Unsplash: usar solo si se confirma que el link es válido -->
<img
  src="https://images.unsplash.com/photo-{id}?w=1200&q=80&auto=format"
  alt="{descripción específica y semántica}"
  loading="lazy"
  decoding="async"
/>

<!-- Placeholder seguro para desarrollo -->
<img src="https://picsum.photos/seed/{seed-descriptivo}/800/600" alt="..." />
```

### Prompts para imagen personalizada (hero, fondos, ilustraciones)

Cuando se necesita una imagen generada, entregar exactamente este formato:

```
[IMAGE PROMPT START]
Overhead flat lay photograph of {descripción exacta}, natural daylight, clean white surface,
Swiss design aesthetic, no text, no people, minimal props, high resolution, 16:9 ratio
[IMAGE PROMPT END]
```

---

## 8. Stack del proyecto (obligatorio verificar)

```
Framework:     React 18 + TypeScript
Estilos:       Tailwind CSS v3
Gestor:        pnpm (NUNCA npm ni yarn)
Testing:       Vitest + Testing Library
Build:         Vite
```

### Antes de cualquier instalación

```bash
# Verificar package.json antes de importar QUALQUIER librería de terceros
# Si no está instalada, incluir el comando antes del código:
pnpm add nombre-paquete
```

### Reglas de componentes

- Server Components por defecto en Next.js (no aplica aquí — es Vite/SPA)
- `"use client"` no es necesario en este proyecto (no es Next.js)
- Estado local: `useState` / `useReducer`
- No usar `h-screen` — usar `min-h-[100dvh]`
- Iconos: `@phosphor-icons/react` o `@radix-ui/react-icons` — verificar instalación
- **PROHIBIDO:** emojis en código, markup o alt text — usar iconos SVG

---

## 9. Anti-patrones prohibidos

### Visual

- Gradientes de texto en headlines
- Sombras de colores saturados (glow exterior)
- Tres columnas de cards iguales
- Hero centrado con texto sobre imagen oscura (usar split screen o alineación izquierda)
- `#000000` puro
- Colores grises mezclados (cálidos + fríos en el mismo proyecto)

### Tipografía

- Inter, Roboto, Arial, system-ui, Space Grotesk
- H1 gigantesco como único mecanismo de jerarquía
- Serif en este proyecto

### Animación

- Animaciones infinitas en UI estándar
- Animaciones sobre `top`, `left`, `width`, `height` (solo `transform` + `opacity`)
- Magnetic buttons o scroll hijacking
- Physics springs sin necesidad funcional

### Código

- URLs de Unsplash inventadas
- `z-50` arbitrario sin contexto de capas
- `h-screen` (causa layout jumping en iOS)
- `calc(33% - 1rem)` — usar CSS Grid
- Nombres genéricos en datos de ejemplo: "John Doe", "99.99%", "Acme Corp"
- Copy cliché: "Seamless", "Elevate", "Next-Gen", "Unleash"

---

## 10. Proceso de diseño

Antes de escribir una sola línea de código para cualquier componente o página:

1. **Propósito:** ¿qué problema resuelve visualmente este elemento?
2. **Jerarquía:** ¿qué es lo primero, segundo y tercero que el usuario debe leer?
3. **Búsqueda de patrón existente:** ¿hay ya un componente similar en el proyecto? Si lo hay, extender — no reinventar.
4. **Un detalle memorable:** ¿cuál es el único refinamiento que distingue este componente de uno genérico? (una transición, un espaciado inesperado, una alineación deliberada)
5. **Verificar en móvil:** col-1 estricta antes de cualquier layout asimétrico en `md:+`
