# Refactorización de Tipos, Interfaces y ClassNames

---

## 1.1 Tipos e Interfaces a Centralizar

| Prioridad | Ubicación Actual                                  | Propuesta de Centralización                                                                                                            | Impacto                               | Notas                                                                                    |
| --------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| 🔴 ALTA   | `src/components/iconos/*.tsx` (30 archivos)       | Crear `src/types/icons.ts` con `type IconProps = { size?: number; color?: string; strokeWidth?: number; className?: string; }`         | **CRÍTICO**: Elimina 30 duplicaciones | Aplicar a todos los iconos. Los condicionales ternarios de className también irían a CSS |
| 🔴 ALTA   | `src/components/combinations/BookModal.tsx`       | Mover a `src/interfaces/modals.ts` (nuevo archivo): `interface BookModalProps { book: Book; onClose: () => void; }`                    | Baja (1 interfaz) pero sientan base   | Si crearemos modales genéricos                                                           |
| 🔴 ALTA   | `src/components/combinations/BooksFilter.tsx`     | Mover a `src/interfaces/books.ts` (existente): `interface BooksFilterProps { books: Book[]; onFiltered: (filtered: Book[]) => void; }` | Baja (1 interfaz)                     | Ya tenemos el archivo, agregar esta interfaz                                             |
| 🟠 MEDIA  | `src/components/combinations/VisitedWorldMap.tsx` | Mover a `src/interfaces/maps.ts` (nuevo archivo): `interface MapPoint {...}` , `interface VisitedWorldMapProps {...}`                  | Baja (2 interfaces)                   | Para futuras integraciones de mapas                                                      |
| 🟠 MEDIA  | `src/pages/Kimo/BooksPage.tsx`                    | Mover a `src/types/index.ts`: `type View = 'table' \| 'gallery'`                                                                       | Muy baja                              | Reutilizable en futuras vistas                                                           |
| 🟢 BAJA   | App.tsx                                           | Eliminar `type PlaceholderPageProps` (no se usa)                                                                                       | Muy baja                              | Limpieza                                                                                 |

**Archivos de interfaz necesarios:**

- ✓ `src/interfaces/books.ts` (EXISTE) → Agregar `BooksFilterProps`, `BooksGalleryProps`
- ✓ `src/types/index.ts` (EXISTE) → Agregar `type IconProps`, `type View`
- 🆕 `src/types/icons.ts` (CREAR) → `type IconProps`
- 🆕 `src/interfaces/modals.ts` (CREAR) → Modal-related interfaces
- 🆕 `src/interfaces/maps.ts` (CREAR) → World map interfaces

---

## 1.2 ClassNames Largos de Tailwind a Extraer

| Prioridad | Ubicación                                       | Clase/Area                     | Cantidad                      | ClassNames                                                                                                                                                                                                                                         | Propuesta CSS                                                        | Archivo CSS                                     |
| --------- | ----------------------------------------------- | ------------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| 🔴 ALTA   | `src/pages/Home/Home.tsx:11`                    | Skip link (a11y)               | 1                             | `sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-ink focus:border focus:border-border focus:rounded-sm text-sm`                                                     | `.skip-link`                                                         | `src/pages/Home/home.css`                       |
| 🔴 ALTA   | `src/pages/Home/Home.tsx:42,48`                 | Action buttons CTA             | 2 (DUPLICADO)                 | `inline-flex items-center gap-2 text-sm font-medium text-muted border border-border px-5 py-2.5 hover:border-ink hover:text-ink transition-colors duration-250`                                                                                    | `.btn-outline` o dejar para componente `Button.tsx`                  | `src/styles/buttonStyles.ts` (CREAR)            |
| 🔴 ALTA   | `src/pages/Home/Home.tsx:74`                    | Category icon animation        | 1 + repetido en GraphicDesign | `text-6xl mb-4 transition-transform transition-colors duration-300 ease-out group-hover:scale-150 group-hover:-rotate-6 group-hover:text-red-600`                                                                                                  | `.icon-category-hover` o `.category-icon`                            | `src/pages/GraphicDesign/graphicdesign.css`     |
| 🟠 MEDIA  | `src/pages/Kimo/BooksPage.tsx:17,24`            | Toggle buttons (tabla/galería) | 2 (DUPLICADO con ternario)    | `px-4 py-2 rounded border border-border text-sm font-mono transition-colors duration-150 ${view === 'table'/'gallery' ? 'bg-accent text-bg' : 'bg-surface text-ink'}`                                                                              | Extraer base: `.btn-toggle` + modifier `.btn-toggle--active`         | `src/pages/Kimo/books.css` (AGREGAR)            |
| 🟠 MEDIA  | `src/components/combinations/BookModal.tsx:97`  | Overlay animation              | 1                             | `absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-[${OVERLAY_DURATION}ms] ${modalVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`                                                          | `.modal-overlay` (estado vía data-attribute o clase dinámico)        | `src/components/combinations/modal.css` (CREAR) |
| 🟠 MEDIA  | `src/components/combinations/BookModal.tsx:109` | Modal animation                | 1                             | `relative z-50 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 outline-none flex flex-col items-center transition-all duration-[${MODAL_DURATION}ms] ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}` | `.modal-content` (estado vía data-attribute)                         | `src/components/combinations/modal.css` (CREAR) |
| 🟡 BAJA   | `src/pages/NotFoundPage.tsx:28`                 | Back button                    | 1                             | `inline-flex items-center gap-2 text-sm font-medium text-ink border border-ink px-5 py-2 rounded transition-opacity duration-150 hover:opacity-70`                                                                                                 | Duplica pattern de Home → usar componente `Button.tsx`               | Ya extraído a Button                            |
| 🟡 BAJA   | `src/pages/Home/Home.tsx:122`                   | Text section                   | 1                             | `text-xl md:text-2xl font-medium tracking-tight text-ink leading-snug mb-6 max-w-[42ch]`                                                                                                                                                           | `.text-section` o dejar en Tailwind (es responsivo simple)           | Considerar pero baja prioridad                  |
| 🟡 BAJA   | `src/components/layout/MainLayout.tsx:87-102`   | Hamburger estilos + transform  | Múltiples                     | `transition-all`, `transform rotate-X translateY-X`, etc.                                                                                                                                                                                          | Estilos inline para transforms dinámicos → justificado, mantener asi | inline (necesario dinamismo)                    |

**Archivos CSS necesarios:**

- ✓ `src/pages/Kimo/books.css` (EXISTE) → Agregar `.btn-toggle`, `.btn-toggle--active`
- 🆕 `src/pages/Home/home.css` (CREAR) → `.skip-link`, posiblemente `.text-section`
- 🆕 `src/pages/GraphicDesign/graphicdesign.css` (CREAR) → `.category-icon`, `.category-icon:hover`
- 🆕 `src/styles/buttonStyles.ts` (CREAR) → Constantes para botones (usadas por componente `Button.tsx`)
- 🆕 `src/components/combinations/modal.css` (CREAR) → `.modal-overlay`, `.modal-content`

---

## 1.3 Estilos Inline a Refactorizar

| Ubicación                                                     | Usar                             | Alternativa                                                               | Justificación                                                      |
| ------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `src/App.tsx` (placeholder)                                   | CSS Tailwind o variables         | `max-width: 1280px` → `max-w-7xl`, `margin: 0 auto` → `mx-auto`           | Limpieza del placeholder                                           |
| `src/components/combinations/BookModal.tsx` (animaciones)     | Inline (mantener)                | N/A                                                                       | Necesario: duración dinámica del OVERLAY_DURATION / MODAL_DURATION |
| `src/components/combinations/VisitedWorldMap.tsx`             | Tailwind: `h-[custom]` o CSS var | `style={{ height }}` → `style={{ height, overflow: 'hidden' }}` → CSS var | Considerar para futuro                                             |
| `src/components/layout/MainLayout.tsx` (hamburger transforms) | Inline (mantener)                | N/A                                                                       | Necesario: transforms dinámicos según estado `open`                |
