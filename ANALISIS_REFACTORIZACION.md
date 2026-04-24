# 📊 Análisis de Refactorización - Portfolio (24 de abril de 2026)

---

## 📋 PARTE 1: REFACTORIZACIÓN DE TIPOS, INTERFACES Y CLASSNAMES

### 1.1 Tipos e Interfaces a Centralizar

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

### 1.2 ClassNames Largos de Tailwind a Extraer

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

### 1.3 Estilos Inline a Refactorizar

| Ubicación                                                     | Usar                             | Alternativa                                                               | Justificación                                                      |
| ------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `src/App.tsx` (placeholder)                                   | CSS Tailwind o variables         | `max-width: 1280px` → `max-w-7xl`, `margin: 0 auto` → `mx-auto`           | Limpieza del placeholder                                           |
| `src/components/combinations/BookModal.tsx` (animaciones)     | Inline (mantener)                | N/A                                                                       | Necesario: duración dinámica del OVERLAY_DURATION / MODAL_DURATION |
| `src/components/combinations/VisitedWorldMap.tsx`             | Tailwind: `h-[custom]` o CSS var | `style={{ height }}` → `style={{ height, overflow: 'hidden' }}` → CSS var | Considerar para futuro                                             |
| `src/components/layout/MainLayout.tsx` (hamburger transforms) | Inline (mantener)                | N/A                                                                       | Necesario: transforms dinámicos según estado `open`                |

---

## 📊 PARTE 2: ANÁLISIS DE COMPONENTIZACIÓN

### Leyenda de Prioridad:

- 🔴 **ALTA**: Impacto inmediato, elimina duplicidad, alta reutilización
- 🟠 **MEDIA**: Valor didáctico alto, reutilización moderada
- 🟡 **BAJA**: Value menor, pero completa el sistema
- 🟢 **NICE-TO-HAVE**: No urgente pero aplicable a futuro

### Leyenda de Duración:

- **Rápida**: 1 hora o menos
- **Media**: 1-2 horas
- **Larga**: 2+ horas

### Leyenda de Valor Didáctico (⭐):

- ⭐ Básico (no aprenderás casi nada nuevo)
- ⭐⭐ Elemental
- ⭐⭐⭐ Intermedio
- ⭐⭐⭐⭐ Bueno
- ⭐⭐⭐⭐⭐ Excelente (conceptos avanzados)

---

### 📈 TABLA MAESTRA: Oportunidades de Componentización

| #      | Archivo de Origen                                              | Componente Propuesto                            | Ubicación Sugerida                         | Duración             | Casos de Uso                                  | Reutilización       | Valor Didáctico                                                           | Prioridad       | Notas                                                                                                                        |
| ------ | -------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------ | -------------------- | --------------------------------------------- | ------------------- | ------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **1**  | `Home.tsx` (42, 48) + `NotFoundPage.tsx` (28)                  | `Button`                                        | `src/components/ui/Button.tsx`             | Media (2h)           | 7+ (CTAs, toggles, cerrar modal, etc.)        | ⭐⭐⭐⭐⭐ Muy alta | ⭐⭐⭐⭐⭐ Excelente (Composición, props, variantes, accesibilidad)       | 🔴 ALTA         | Consolidaría todos los botones. Variantes: `primary`, `secondary`, `ghost`, `outline`. Props: `size`, `disabled`, `loading`. |
| **2**  | `BooksFilter.tsx` (40-51)                                      | `TextInput`                                     | `src/components/ui/TextInput.tsx`          | Rápida (1h)          | 1 actual + futuro contact form                | ⭐⭐⭐ Media        | ⭐⭐⭐ Intermedio (Controlled components, validation)                     | 🔴 ALTA         | Reutilizable para búsqueda y formularios.                                                                                    |
| **3**  | `BooksFilter.tsx` (53-76)                                      | `SelectField`                                   | `src/components/ui/SelectField.tsx`        | Rápida (1-1.5h)      | 4 (Author, Series, Genre) + futuro            | ⭐⭐⭐⭐ Alta       | ⭐⭐⭐⭐ Bueno (TypeScript generics, type-safe options)                   | 🔴 ALTA         | 4 selects idénticos + futuro. Props: `options`, `label`, `onChange`, `disabled`.                                             |
| **4**  | `BooksTable.tsx` + `PlacesTable.tsx`                           | `TableSortButton`                               | `src/components/ui/TableSortButton.tsx`    | Media (1.5-2h)       | 10+ (ambas tablas × múltiples columnas)       | ⭐⭐⭐⭐⭐ Muy alta | ⭐⭐⭐⭐ Bueno (State, aria-sort, visual feedback)                        | 🔴 ALTA         | Elimina duplicidad. Encapsula: flecha, color, aria, handler.                                                                 |
| **5**  | `Home.tsx` + `MainLayout.tsx` + `KimoLayout.tsx`               | `Link`                                          | `src/components/ui/Link.tsx`               | Media (1.5-2h)       | 15+                                           | ⭐⭐⭐ Media-Alta   | ⭐⭐⭐ Intermedio (Router integration, variants)                          | 🔴 ALTA         | Wrapper sobre react-router Link. Variantes: `text`, `button`, `nav`. Active state.                                           |
| **6**  | `GraphicDesign.tsx` (77-96)                                    | `Card` (+ CardHeader, CardBody, CardFooter)     | `src/components/ui/Card.tsx`               | Media (2h)           | 1 actual + futuro galleries                   | ⭐⭐⭐⭐ Media-Alta | ⭐⭐⭐⭐ Bueno (Composition patterns, mixin-like)                         | 🟠 MEDIA        | Composable. Variantes: `default`, `elevated`, `outlined`. Reusable base.                                                     |
| **7**  | `BookModal.tsx`                                                | `Modal` (+ ModalHeader, ModalBody, ModalFooter) | `src/components/ui/Modal.tsx`              | Media (2-2.5h)       | 1 (BookModal) + futuro (confirm, alert, form) | ⭐⭐⭐⭐ Media-Alta | ⭐⭐⭐⭐⭐ Excelente (Animations, focus trap, a11y (aria, role), portal)  | 🟠 MEDIA        | Actualizar BookModal para usar Modal genérico. Features: ESC to close, backdrop click, focus trap.                           |
| **8**  | `BooksFilter.tsx` (estructura )                                | `FormField`                                     | `src/components/ui/FormField.tsx`          | Media (1.5-2h)       | 4 en BooksFilter + futuro forms               | ⭐⭐⭐⭐ Media-Alta | ⭐⭐⭐⭐ Bueno (Composition, props forwarding, error handling)            | 🟠 MEDIA        | Wrapper: label + input/select + error + help text. Reduce prop drilling.                                                     |
| **9**  | `Home.tsx` (83-106)                                            | `ProjectListItem`                               | `src/components/ProjectListItem.tsx`       | Rápida (1-1.5h)      | 1 (pero reduce duplicity)                     | ⭐⭐ Baja           | ⭐⭐⭐ Intermedio (Index-based animation, props)                          | 🟠 MEDIA        | Renderiza fila de proyecto con número, título, tipo, año, icono. Facilita futuros cambios.                                   |
| **10** | `Home.tsx` (61-65, 73-80)                                      | `SectionHeader`                                 | `src/components/ui/SectionHeader.tsx`      | Rápida (1h)          | 3-4 (Home + GraphicDesign)                    | ⭐⭐⭐ Baja-Media   | ⭐⭐⭐ Intermedio (Semantic HTML h1-h6, aria-labelledby)                  | 🟠 MEDIA        | Encapsula: font-mono label, h2 título, descripción opcional. Reutilizable.                                                   |
| **11** | `GraphicDesign.tsx` (77-96)                                    | `CategoryCard`                                  | `src/components/CategoryCard.tsx`          | Media (1.5h)         | 1 actual (6 cards) + futuro                   | ⭐⭐⭐⭐ Media      | ⭐⭐⭐⭐ Bueno (Icon composition, hover animations, interaction patterns) | 🟠 MEDIA        | Especialización de Card. Props: `title`, `icon`, `href`, `animate`. Hover: scale/rotate/color.                               |
| **12** | `Home.tsx` (17-55)                                             | `HeroSection`                                   | `src/components/layout/HeroSection.tsx`    | Media (2h)           | 1 actual + futuro landings                    | ⭐⭐⭐ Baja-Media   | ⭐⭐⭐⭐ Bueno (Layout patterns, responsive grid, composition)            | 🟠 MEDIA        | Template reutilizable. Props: `title`, `description`, `ctas`, `decorator`. Grid 1/2 col.                                     |
| **13** | `Home.tsx` (36)                                                | `Badge`                                         | `src/components/ui/Badge.tsx`              | Rápida (1h)          | 1-2 actual + futuro (tags, labels)            | ⭐⭐ Baja           | ⭐⭐ Elemental (Variantes, simple)                                        | 🟡 BAJA         | Etiqueta pequeña. Variantes: `primary`, `secondary`, `outline`, `filled`.                                                    |
| **14** | Múltiples (separadores)                                        | `Divider`                                       | `src/components/ui/Divider.tsx`            | Rápida (30m-1h)      | 7+ (sections, nav, lists)                     | ⭐⭐⭐ Baja-Media   | ⭐⭐ Elemental (CSS classes, variants)                                    | 🟡 BAJA         | Línea horizontal/vertical. Variantes: `dashed`, `color`, `spacing`.                                                          |
| **15** | `BooksTable.tsx` (implícito con mensaje vacío)                 | `EmptyState`                                    | `src/components/ui/EmptyState.tsx`         | Rápida (1h)          | 2-3 (Tables/Galleries si filtros vacíos)      | ⭐⭐⭐ Baja-Media   | ⭐⭐⭐ Intermedio (Conditional rendering, UX patterns)                    | 🟡 BAJA         | Mensaje cuando no hay datos. Props: `icon`, `title`, `description`, `actionButton`.                                          |
| **16** | N/A (no existe)                                                | `ErrorBoundary`                                 | `src/components/ErrorBoundary.tsx`         | Media (2h con tests) | Wrap secciones críticas (2-3)                 | ⭐⭐⭐⭐ Media-Alta | ⭐⭐⭐⭐⭐ Excelente (Class components, error handling, lifecycle)        | 🟢 NICE-TO-HAVE | Captura errores de renderizado. Muestra UI de error + retry. Fundamental pero no urgente.                                    |
| **17** | Implícito                                                      | `SkeletonLoader`                                | `src/components/ui/SkeletonLoader.tsx`     | Media (1.5-2h)       | BooksGallery (lazy images), futuro            | ⭐⭐⭐ Media        | ⭐⭐⭐⭐ Bueno (Animations, CSS, progressive enhancement)                 | 🟢 NICE-TO-HAVE | Placeholder animado. Props: `lines`, `width`, `height`, `animated`.                                                          |
| **18** | `BooksGallery.tsx` (title attribute)                           | `Tooltip`                                       | `src/components/ui/Tooltip.tsx`            | Media (2h)           | BooksGallery + futuros info icons             | ⭐⭐⭐ Media        | ⭐⭐⭐⭐ Bueno (Floating positioning, focus management, aria-label)       | 🟢 NICE-TO-HAVE | Info flotante accesible. Props: `content`, `position`, `delay`. Mejora actual `title` de covers.                             |
| **19** | N/A (no existe)                                                | `Breadcrumbs`                                   | `src/components/ui/Breadcrumbs.tsx`        | Rápida (1-1.5h)      | Potencial en rutas nested futuras             | ⭐⭐ Baja           | ⭐⭐⭐ Intermedio (Semantic nav, accessibility)                           | 🟢 NICE-TO-HAVE | Navegación de ruta. Props: `items`, `current`. Separador "/" custom.                                                         |
| **20** | `ScrollToTop.tsx` (existente, mejorar)                         | `ScrollToTopButton`                             | `src/components/ui/ScrollToTopButton.tsx`  | Media (1.5-2h)       | Flotante en Home (cuando scroll > 300px)      | ⭐⭐⭐ Baja         | ⭐⭐⭐ Intermedio (Scroll events, visibility, animation)                  | 🟢 NICE-TO-HAVE | Botón flotante. Props: `showThreshold`, `target`. Encapsula lógica actual.                                                   |
| **21** | N/A (no existe)                                                | `Pagination`                                    | `src/components/ui/Pagination.tsx`         | Media (1.5-2h)       | Futuro (si listas largas)                     | ⭐⭐ Baja           | ⭐⭐⭐ Intermedio (Pagination logic, a11y nav)                            | 🟢 NICE-TO-HAVE | Paginación accesible. Props: `currentPage`, `totalPages`, `onPageChange`.                                                    |
| **22** | `BooksPage.tsx` (18-31)                                        | `Tabs` (+ TabsList, TabsContent)                | `src/components/ui/Tabs.tsx`               | Media (2h)           | 1 (tabla/galería) + futuro                    | ⭐⭐⭐ Media        | ⭐⭐⭐⭐ Bueno (Compound components, context (opcional), a11y)            | 🟡 BAJA         | Componente pestañas. Soporta icon + label, disabled, aria attributes.                                                        |
| **23** | N/A (no existe)                                                | `Alert`                                         | `src/components/ui/Alert.tsx`              | Rápida (1-1.5h)      | Futuro (errores, avisos)                      | ⭐⭐ Baja           | ⭐⭐ Elemental (Variants, conditional)                                    | 🟢 NICE-TO-HAVE | Info box. Props: `type` (info, warning, error, success), `title`, `message`, `icon`, `closeable`.                            |
| **24** | `BookModal.tsx` (X cerrar) + `MainLayout.tsx` (hamburger)      | `IconButton`                                    | `src/components/ui/IconButton.tsx`         | Rápida (1h)          | 2-3 (cerrar, hamburger, opciones futuro)      | ⭐⭐⭐ Media        | ⭐⭐⭐ Intermedio (Icon-only buttons accessibility, sizing)               | 🟡 BAJA         | Botón solo icon. Props: `icon`, `aria-label`, `size`, `variant`. Square shape.                                               |
| **25** | `GraphicDesign.tsx` (70) + `BooksGallery.tsx` (bookshelf-grid) | `ResponsiveGrid`                                | `src/components/layout/ResponsiveGrid.tsx` | Rápida (1h)          | 2 ubicaciones + futuro                        | ⭐⭐ Baja           | ⭐⭐ Elemental (CSS Grid, responsive)                                     | 🟢 NICE-TO-HAVE | Grid wrapper. Props: `columns` {sm, md, lg}, `gap`, `children`.                                                              |

---

### 🎣 Hook Utilities (Refactors Estructurales)

| #      | Archivo de Origen                    | Hook Propuesto    | Ubicación                      | Duración       | Casos de Uso                             | Reutilización       | Valor Didáctico                                                              | Prioridad | Notas                                                                                          |
| ------ | ------------------------------------ | ----------------- | ------------------------------ | -------------- | ---------------------------------------- | ------------------- | ---------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| **26** | `BooksTable.tsx` + `PlacesTable.tsx` | `useTableSorting` | `src/hooks/useTableSorting.ts` | Rápida (1h)    | Ambas tablas                             | ⭐⭐⭐⭐ Alta       | ⭐⭐⭐⭐ Bueno (Custom hooks, state abstraction)                             | 🔴 ALTA   | Encapsula: `sorting` state, `setSorting`, `onSortingChange`. Elimina duplicidad.               |
| **27** | `BooksFilter.tsx` (20-40)            | `useFilters`      | `src/hooks/useFilters.ts`      | Media (1.5-2h) | BooksFilter + futuro filtros             | ⭐⭐⭐⭐ Media-Alta | ⭐⭐⭐⭐ Bueno (Hook composition, memoization, complex logic)                | 🟠 MEDIA  | Hook multi-campo. Params: `data`, `filters` config. Retorna: `filtered`, `setFilter`, `reset`. |
| **28** | Implícito                            | `useLocalStorage` | `src/hooks/useLocalStorage.ts` | Media (1.5h)   | Persistir vista (table/gallery), filtros | ⭐⭐⭐⭐ Media      | ⭐⭐⭐⭐⭐ Excelente (localStorage API, hooks avanzados, JSON serialization) | 🟠 MEDIA  | Sincroniza state con localStorage. Retorna `[value, setValue]` como useState.                  |
| **29** | `ScrollToTop.tsx`                    | `useScrollToTop`  | `src/hooks/useScrollToTop.ts`  | Media (1.5h)   | ScrollToTop component + futuro           | ⭐⭐⭐ Media        | ⭐⭐⭐ Intermedio (useEffect, router hooks, scroll API)                      | 🟡 BAJA   | Mejorar existente. Soporta: `auto` (route change), `manual` (ref), `smooth` option.            |

---

## 🎯 RESUMEN DE IMPACTO

### Componentes por Impacto (Eliminan Mayor Duplicidad)

1. **Button** - 7+ lugares
2. **TableSortButton** - Ambas tablas
3. **Link** - 15+ enlaces inconsistentes
4. **Modal** - Base para futuros (BookModal + confirm/alert/form)
5. **TextInput + SelectField** - Todos los campos de BooksFilter

### Hooks por Impacto (Eliminan Mayor Lógica Duplicada)

1. **useTableSorting** - Eliminates ~30 líneas duplicadas entre BooksTable y PlacesTable
2. **useFilters** - Encapsula lógica de filtrado compleja
3. **useLocalStorage** - Patrón fundamental faltante

### Archivos CSS Necesarios

| Archivo                                     | Contenido                                      | Prioridad |
| ------------------------------------------- | ---------------------------------------------- | --------- |
| `src/pages/Home/home.css`                   | `.skip-link`, `.text-section` (opcional)       | 🟡 Media  |
| `src/pages/GraphicDesign/graphicdesign.css` | `.category-icon`, `.category-icon:hover`       | 🟡 Media  |
| `src/pages/Kimo/books.css`                  | `.btn-toggle`, `.btn-toggle--active` (agregar) | 🔴 Alta   |
| `src/styles/buttonStyles.ts`                | Constantes de botones (usado por Button.tsx)   | 🔴 Alta   |
| `src/components/combinations/modal.css`     | `.modal-overlay`, `.modal-content`             | 🟠 Media  |

### Archivos de Interface/Types Necesarios

| Archivo                    | Contenido                                       | Prioridad |
| -------------------------- | ----------------------------------------------- | --------- |
| `src/types/icons.ts`       | `type IconProps`                                | 🔴 Alta   |
| `src/types/index.ts`       | Agregar `type View`                             | 🔴 Alta   |
| `src/interfaces/books.ts`  | Agregar `BooksFilterProps`, `BooksGalleryProps` | 🔴 Alta   |
| `src/interfaces/modals.ts` | `BookModalProps`, future modal types            | 🟠 Media  |
| `src/interfaces/maps.ts`   | `MapPoint`, `VisitedWorldMapProps`              | 🟠 Media  |

---

## 📈 ROADMAP SUGERIDO (Por Fase)

### **Fase 1: Refactorización Base (Semana 1-2)**

**Objetivo**: Centralizar tipos, interfaces y eliminar duplicidad masiva

1. ✅ Crear `src/types/icons.ts` con `IconProps`
2. ✅ Mover tipos a `src/types/index.ts` y `src/interfaces/books.ts`
3. ✅ Crear `src/styles/buttonStyles.ts` con constantes de botones
4. ✅ Extraer classNames largos a archivos CSS (home.css, graphicdesign.css, modal.css)
5. ✅ Crear hook `useTableSorting` (reutilizable en BooksTable + PlacesTable)

**Impacto**: Elimina ~50+ duplicaciones, sienta base para componentes

---

### **Fase 2: Componentes UI Base (Semana 2-3)**

**Objetivo**: Crear componentes de UI reutilizables de alta frecuencia

1. 🆕 Componente `Button` (consolida 7+ variantes)
2. 🆕 Componente `TextInput` + `SelectField` (BooksFilter)
3. 🆕 Componente `TableSortButton` (ambas tablas)
4. 🆕 Componente `Link` (15+ enlaces)
5. 🆕 Hook `useFilters` (lógica filtrado)

**Impacto**: Código más consistente, mantenible y reutilizable

---

### **Fase 3: Componentes Complejos (Semana 3-4)**

**Objetivo**: Abstracciones avanzadas (modales, cards, forms)

1. 🆕 Componente `Modal` genérico (actualizar BookModal)
2. 🆕 Componente `Card` + `CategoryCard`
3. 🆕 Componente `FormField` wrapper
4. 🆕 Hook `useLocalStorage` (persistencia)

**Impacto**: Experiencia visual consistente, code reusability mejorada

---

### **Fase 4: Componentes Nice-to-Have (Semana 4+)**

**Objetivo**: Completar sistema de componentes (no urgente)

1. 🆕 `ErrorBoundary`, `SkeletonLoader`, `Tooltip`, `Breadcrumbs`, etc.
2. 🆕 Componentes especializados: `ProjectListItem`, `SectionHeader`, etc.
3. 🆕 Componentes de data: `Pagination`, `Tabs`, `Badge`, `Alert`

**Impacto**: Sistema de componentes completo y profesional

---

## 🎓 VALOR DIDÁCTICO POR REFACTOR

### Conceptos Aprendido por Tipo de Refactor

| Concepto                                | Componente/Hook                              | Nivel Aprendizaje |
| --------------------------------------- | -------------------------------------------- | ----------------- |
| **TypeScript Generics & Type Safety**   | SelectField, useFilters                      | ⭐⭐⭐⭐⭐        |
| **Component Composition**               | Button, Card, Modal                          | ⭐⭐⭐⭐⭐        |
| **React Hooks (Custom)**                | useTableSorting, useLocalStorage, useFilters | ⭐⭐⭐⭐⭐        |
| **Accessibility (a11y / ARIA)**         | Button, TableSortButton, Modal               | ⭐⭐⭐⭐⭐        |
| **CSS Responsive Design**               | ResponsiveGrid                               | ⭐⭐⭐⭐          |
| **Focus Management & Event Handling**   | Modal, ErrorBoundary                         | ⭐⭐⭐⭐⭐        |
| **Variant Patterns (cva/clsx)**         | Button, Badge                                | ⭐⭐⭐⭐          |
| **Class Components (Error Boundaries)** | ErrorBoundary                                | ⭐⭐⭐⭐⭐        |
| **Animations & Transitions**            | Modal, HeroSection                           | ⭐⭐⭐⭐          |
| **Compound Components Pattern**         | Tabs, Card, FormField                        | ⭐⭐⭐⭐          |
| **Props Forwarding & Spreading**        | TextInput, Card                              | ⭐⭐⭐            |
| **Semantic HTML & A11y Structure**      | Link, SectionHeader, Breadcrumbs             | ⭐⭐⭐⭐          |

---

## ✅ PRÓXIMOS PASOS

1. **Revisar este documento** antes de comenzar refactorización
2. **Elegir Fase 1** como punto de partida
3. **NO hacer commits** hasta revisar (como solicitaste)
4. **Proceder fase por fase** para mantener código estable
5. **Escribir tests** para cada nuevo componente

---

**Documento generado**: 24 de abril de 2026  
**Proyecto**: Portfolio (React + TypeScript + Tailwind)  
**Versión**: 1.0
