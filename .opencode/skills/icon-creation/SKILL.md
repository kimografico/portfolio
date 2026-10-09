---
name: icon-creation
description: >
  Skill para crear y integrar nuevos iconos SVG reutilizables. Incluye validación de estructura, export a index.ts y registro en la página de contacto.
license: MIT
metadata:
  author: kimografico
  version: '1.0'
---

# Icon Creation Skill — kimografico

Pasos para crear e integrar un nuevo icono SVG en el proyecto.

---

## 1. Recibir especificación del icono

El usuario proporciona:

- **Idea de icono** o **código SVG** existente
- **Nombre del icono** (ej: "IconStar", "IconHeart")

Validar que el nombre sigue la convención `Icon<PascalCase>`.

---

## 2. Crear el archivo del icono

**Ubicación**: `/src/components/iconos/<NombreDelIcono>.tsx`

**Estructura base** (React 18+ con JSX transform):

```tsx
import type { IconProps } from '../../types/icons';

export function IconNombreDelIcono({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* SVG paths aquí */}
    </svg>
  );
}
```

**Notas importantes**:

- **NO importar React** — React 18+ usa JSX transform automático
- **Importar IconProps desde** `../../types/icons` (tipo centralizado para consistencia)
- **Usar `strokeWidth`** (no `stroke` que es para color)
- **Usar `color`** en lugar de hardcodear `currentColor` para flxibilidad
- Usar **named export** (`export function`) en lugar de `export default`
- `viewBox="0 0 24 24"` como estándar
- Props spread (`...props`) al final para permitir atributos SVG adicionales como `className`

**Type IconProps**: Definición en `/src/types/icons.ts`

---

## 3. Exportar en `index.ts`

**Archivo**: `/src/components/iconos/index.ts`

Añadir el nuevo icono a la lista de exports (named export):

```tsx
export { IconNombreDelIcono } from './IconNombreDelIcono';
```

**Verificar**:

- ✅ Usar **named export** (`export { IconNombreDelIcono }`)
- ✅ No hay duplicados en la lista
- ✅ Orden alfabético

---

## 4. Visualización automática en la galería

La galería de iconos se genera automáticamente en el componente `IconGallery` (`/src/pages/Kimo/IconGallery.tsx`) a partir de todos los iconos exportados en `/src/components/iconos/index.ts`.

**No es necesario modificar ContactMe ni añadir manualmente el icono a la galería.**

Para que el icono aparezca en la galería, basta con exportarlo correctamente en `index.ts` siguiendo el paso anterior.

---

## 5. Validación

- [ ] El archivo `.tsx` compila sin errores.
- [ ] El icono se renderiza correctamente en ContactMe.
- [ ] El nombre sigue convención `Icon<PascalCase>`.
- [ ] Los props (`size`, `strokeWidth`, `className`) funcionan.
- [ ] No hay warnings de TypeScript o ESLint.

---

## Checklist de creación

- [ ] Archivo creado en `/src/components/iconos/Icon<Nombre>.tsx`
- [ ] Exportado en `iconos/index.ts`
- [ ] Aparece automáticamente en la galería de iconos
- [ ] Compila sin errores
- [ ] Funciona correctamente en navegador

---

## Errores Comunes y Soluciones

### ❌ Error: `Property 'className' does not exist on type`

**Causa**: El tipo `IconProps` no extiende `React.SVGProps<SVGSVGElement>`

**Solución**: Usar el tipo centralizado desde `/src/types/icons.ts`:

```tsx
import type { IconProps } from '../../types/icons';
```

Asegurar que en `types/icons.ts` esté definido como:

```tsx
import type React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
};
```

### ❌ Error: `React is not defined`

**Causa**: Importar `import * as React from 'react'` innecesariamente

**Solución**: **NO importar React** — React 18+ usa JSX transform automático. Solo imports de tipos son necesarios.

```tsx
// ❌ No necesario
import * as React from 'react';

// ✅ Correcto: solo si usas tipos
import type { IconProps } from '../../types/icons';
```

### ❌ Error: `'stroke' is assigned but never used`

**Causa**: Usar `stroke` como parámetro en lugar de `strokeWidth`

**Solución**: Usar parámetro `strokeWidth`:

```tsx
// ❌ Incorrecto
export function IconNombre({ stroke = 2, ...props }: ...) {
  return <svg strokeWidth={stroke} ... />;
}

// ✅ Correcto
export function IconNombre({ strokeWidth = 2, ...props }: IconProps) {
  return <svg strokeWidth={strokeWidth} ... />;
}
```

### ❌ Error: `Type is not assignable to type 'never'`

**Causa**: Props spread (`...props`) pero IconProps no extiende SVGProps

**Solución**: Asegurar que IconProps extienda `React.SVGProps<SVGSVGElement>`:

```tsx
// En types/icons.ts
export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
};
```

### ❌ Error: Icono no aparece en la galería

**Causa**: No exportado correctamente en `iconos/index.ts`

**Solución**: Verificar que esté en `index.ts` con **named export**:

```tsx
export { IconNombreDelIcono } from './IconNombreDelIcono';
```

---

## Resumen de mejores prácticas

| Concepto           | ✅ Correcto                 | ❌ Incorrecto             |
| ------------------ | --------------------------- | ------------------------- |
| Import de tipo     | `import type { IconProps }` | `import * as React`       |
| Tipo props         | `IconProps` centralizado    | Interface local           |
| Param ancho stroke | `strokeWidth`               | `stroke`                  |
| Export             | `export function Icon...`   | `export default function` |
| Props dinámico     | `{...props}` al final       | Atributos hardcodeados    |
| Color heredado     | `color = 'currentColor'`    | `stroke="currentColor"`   |
