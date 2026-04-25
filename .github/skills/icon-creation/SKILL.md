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

**Estructura base**:

```tsx
interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function IconNombreDelIcono({
  size = 24,
  strokeWidth = 1.5,
  className = '',
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className={className}
    >
      {/* SVG paths aquí */}
    </svg>
  );
}
```

**Notas de estilo SVG**:

- Usar `viewBox="0 0 24 24"` como estándar.
- `stroke="currentColor"` para heredar color del padre.
- `fill="none"` por defecto (outline icons).
- Props: `size`, `strokeWidth`, `className` reutilizables.

---

## 3. Exportar en `index.ts`

**Archivo**: `/src/components/iconos/index.ts`

Añadir el nuevo icono a la lista de exports:

```tsx
export { default as IconNombreDelIcono } from './IconNombreDelIcono';
```

**Verificar**: Que no haya duplicados y que el orden sea alfabético.

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
