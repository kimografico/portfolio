---
name: css-extraction
description: >
  Skill para extraer className y estilos CSS en línea a archivos .css externos. Recomienda cuándo extraer, organiza clases y mantiene la semántica.
license: MIT
metadata:
  author: kimografico
  version: '1.0'
---

# CSS Extraction Skill — kimografico

Pasos para extraer estilos CSS de componentes React a archivos `.css` externos.

---

## 1. Identificar candidatos para extracción

Extraer CSS cuando:

- **Multi-atributo className**: Más de 3-4 utilidades Tailwind o propiedades CSS.
- **Lógica condicional repetida**: Mismos estilos aplicados en varios puntos.
- **Estilos complejos**: Media queries, pseudo-clases, animaciones.
- **Nombres cortos**: Clases aplicables a múltiples elementos.

**NO extraer**:

- Estilos únicos (1-2 clases simples).
- Lógica muy específica del componente.

---

## 2. Crear archivo `.css`

**Ubicación**: Mismo directorio que el componente, con el mismo nombre base.

**Ejemplo**:

- Componente: `/src/components/ui/MobileMenu.tsx`
- CSS: `/src/components/ui/mobile-menu.css`

---

## 3. Extraer estilos

**Patrón de extracción**:

### Caso 1: Multi-atributo directo

```tsx
// ANTES
className="px-6 py-5 text-2xl text-ink text-center hover:text-accent transition-colors duration-150"

// DESPUÉS (componente)
className="nav-link"

// DESPUÉS (CSS)
.nav-link {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  font-size: 1.5rem;
  color: var(--color-ink);
  text-align: center;
  transition: color 0.15s;
}
.nav-link:hover {
  color: var(--color-accent);
}
```

Los nombres deben ser descriptivos y reflejar la función del elemento, no solo su apariencia.

### Caso 2: Condicional

```tsx
// ANTES
className={`pb-2 text-base md:text-xl font-medium transition-all duration-200 border-b-2 ${
  isActive ? 'text-accent border-accent' : 'text-muted border-transparent hover:border-current'
}`}

// DESPUÉS (componente)
className={`tab ${isActive ? 'tab-active' : 'tab-inactive'}`}

// DESPUÉS (CSS)
.tab {
  padding-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  border-bottom-width: 2px;
}
@media (min-width: 768px) {
  .tab {
    font-size: 1.25rem;
  }
}
.tab-active {
  color: var(--color-accent);
  border-color: var(--color-accent);
}
.tab-inactive {
  color: var(--color-muted);
  border-color: transparent;
}
.tab-inactive:hover {
  border-color: currentColor;
}
```

---

## 4. Usar variables CSS

**Variables disponibles** en `:root` en el archivo /variables.css
Si se necesitan colores, tamaños o cualquier valor repetido: añadirlo a variables.css y usar `var(--nombre-variable)`.

**Ejemplo**:

```css
.button {
  color: var(--color-ink);
  border: 1px solid var(--color-border);
}
```

---

## 5. Comentarios en CSS

- Separar secciones con comentarios in-line.
- Explicar lógica compleja.
- Listar variantes y estados.

---

## 6. Importar en el componente

En el componente React:

```tsx
import './component-name.css';
```

Colocarlo después de imports de librerías, antes del código.

---

## 7. Validación

- [ ] CSS válido (sin errores de sintaxis).
- [ ] className no contiene espacios extra.
- [ ] Variables CSS existen en `:root`.
- [ ] Media queries funcionan correctamente.
- [ ] Color contrast cumple WCAG AA (si aplica).
- [ ] No hay clases CSS no usadas.
- [ ] El componente se renderiza igual visualmente.

---

## Checklist de extracción

- [ ] Archivo `.css` creado junto al componente.
- [ ] Estilos extraídos completamente.
- [ ] Import de CSS añadido al componente.
- [ ] className simplificado en JSX.
- [ ] Sin errores de compilación o lint.
- [ ] Comportamiento visual idéntico.
