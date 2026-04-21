---
name: code-review
description: >
  Code review checklist and conventions for kimografico. Covers TypeScript, React, Tailwind, clean code and SOLID.
  Use when: reviewing any component, page, hook, or utility in the project.
license: MIT
metadata:
  author: kimografico
  version: "1.0"
---

# Code Review Skill — kimografico

Checklist completo para revisar código del proyecto. Aplícalo en orden de sección.

---

## 1. Convenciones del proyecto (no negociables)

- [ ] Gestor de paquetes: `pnpm`. No hay `package-lock.json` ni `yarn.lock` en el diff
- [ ] No se usan servicios externos salvo GitHub Actions y GitHub Pages
- [ ] Los datos están en `/data/*.json`, no hardcodeados en componentes
- [ ] Las imágenes van en `/frontend/public/images/`
- [ ] Los imports dentro de `src/` son relativos (`../components/X`, no rutas absolutas sin alias)
- [ ] No se usa `npm run` ni `yarn` en scripts, comentarios ni documentación

---

## 2. TypeScript

- [ ] No hay `any` explícito sin justificación comentada
- [ ] Las interfaces están en `src/types/index.ts` (modelos de datos) o co-localizadas (tipos locales)
- [ ] Las props de los componentes están tipadas con `interface Props { ... }` o tipo inline específico
- [ ] No hay `as unknown as X` (doble cast) sin comentario que lo justifique
- [ ] Los arrays tienen tipo (`string[]`, no `Array<any>`)
- [ ] Las funciones tienen tipo de retorno explícito si no es trivialmente inferible
- [ ] `pnpm typecheck` pasa sin errores

---

## 3. React

### Estructura del componente

```tsx
// Orden correcto dentro de un componente:
// 1. Imports
// 2. interface Props (si aplica)
// 3. export function Component({ prop1, prop2 }: Props) {
// 4.   Hooks (siempre primero, sin condicionales)
// 5.   Lógica derivada / handlers
// 6.   return (JSX)
// 7. }
```

- [ ] Los hooks están al inicio del componente, sin condicionales alrededor
- [ ] No hay lógica de negocio en el JSX (`return`): extraer a variables o funciones
- [ ] Los event handlers se nombran `handle{Acción}` (ej: `handleClick`, `handleToggle`)
- [ ] Las props se desestructuran en la firma, no dentro del cuerpo
- [ ] No hay `useEffect` con arrays de dependencias vacíos que oculten side effects
- [ ] Los componentes de página (`pages/`) solo orquestan; no tienen lógica visual propia
- [ ] No se pasa `children` a componentes que no lo necesitan

### Keys en listas

```tsx
// ❌ MAL
items.map((item, index) => <Card key={index} />);

// ✅ BIEN
items.map((item) => <Card key={item.id} />);
```

- [ ] Las keys en `.map()` usan el `id` del dato, no el índice del array

### Rendimiento

- [ ] No se crean objetos/arrays inline en JSX que causen re-renders innecesarios (salvo que sea trivial)
- [ ] `useMemo`/`useCallback` solo si hay evidencia de problema de rendimiento — no por defecto

---

## 4. Tailwind CSS

- [ ] No hay CSS-in-JS ni estilos inline (`style={{ }}`) salvo variables dinámicas inevitables
- [ ] Se usa `min-h-[100dvh]`, nunca `h-screen`
- [ ] Se usa CSS Grid para layouts complejos, no `w-[calc(...)]`
- [ ] No hay clases de Tailwind inventadas que no existen (`text-superxl`, etc.)
- [ ] Las clases siguen el orden: layout → sizing → spacing → typography → color → border → effects
- [ ] No se usa `z-50` arbitrario — solo en contextos de capa (modal, sticky nav, overlay)
- [ ] Los colores usan CSS custom properties (`var(--color-accent)`) para los del sistema de diseño

---

## 5. Clean Code

### Nombres

- [ ] Los nombres de variables/funciones son descriptivos y en inglés (código) o español (comentarios)
- [ ] Los booleanos se nombran con prefijo `is`, `has`, `can`, `should` (`isOpen`, `hasError`)
- [ ] Las funciones tienen un solo propósito y su nombre lo describe (`filterByGenero`, no `process`)
- [ ] No hay abreviaciones crípticas (`usr`, `p`, `tmp` sin contexto)

### Funciones

- [ ] Las funciones tienen menos de ~30 líneas. Si son más largas, evaluar extracción
- [ ] Los argumentos son <= 3. Si son más, agrupar en un objeto
- [ ] No hay efectos secundarios ocultos en funciones que parecen puras

### Comentarios

```tsx
// ❌ MAL — comenta lo obvio
// Incrementa el contador
setCount(count + 1)

// ✅ BIEN — explica el porqué, no el qué
// TanStack Table requiere un array estable; recalcular en cada render rompe la ordenación
const columns = useMemo(() => [...], [])
```

- [ ] Los comentarios explican el **porqué**, no el **qué**
- [ ] No hay código comentado sin explicación (usar `// TODO:` o eliminarlo)

---

## 6. SOLID aplicado a React

| Principio                     | Qué revisar                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------- |
| **S** — Single Responsibility | ¿El componente hace solo una cosa? ¿La página solo orquesta?                  |
| **O** — Open/Closed           | ¿Se puede extender con props sin tocar el interior?                           |
| **L** — Liskov                | ¿Las variantes del componente son intercambiables en su contexto de uso?      |
| **I** — Interface Segregation | ¿Las props son exactas? ¿No se pasan props que el componente ignora?          |
| **D** — Dependency Inversion  | ¿El componente recibe datos/callbacks por props, no los importa directamente? |

---

## 7. Accesibilidad básica (ver skill completo en `accessibility/SKILL.md`)

- [ ] Las imágenes tienen `alt` descriptivo (no vacío salvo decorativas)
- [ ] Los botones tienen texto o `aria-label`
- [ ] No se usa `div` con `onClick` en lugar de `button`
- [ ] Los inputs tienen `label` asociado
- [ ] El contraste de texto supera WCAG AA

---

## 8. Tests

- [ ] El componente nuevo tiene al menos un test básico
- [ ] Los tests existentes siguen pasando: `cd frontend && pnpm test --run`
- [ ] No hay `it.skip` o `xit` sin comentario de motivo

---

## Patrones problemáticos específicos del proyecto

```tsx
// ❌ Estado del toggle guardado en variable local (no persiste)
const [vista, setVista] = useState("galeria");

// ✅ Con persistencia en localStorage
const [vista, setVista] = useState<"galeria" | "tabla">(
  () =>
    (localStorage.getItem("libros-vista") as "galeria" | "tabla") ?? "galeria",
);

// ❌ Ordenación con índice de array como key
libros.map((libro, i) => <LibroCard key={i} {...libro} />);

// ✅ Key con id estable
libros.map((libro) => <LibroCard key={libro.id} {...libro} />);

// ❌ Lógica en página (viola single responsibility)
function PaginaLibros() {
  const sorted = libros.sort((a, b) => a.autor.localeCompare(b.autor));
  return <LibrosTabla libros={sorted} />;
}

// ✅ La lógica de ordenación pertenece a LibrosTabla
function PaginaLibros() {
  return <LibrosTabla libros={libros} />;
}
```
