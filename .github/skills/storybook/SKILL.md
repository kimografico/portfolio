# SKILL: Storybook Stories para kimografico

## Propósito

Guía para crear stories de Storybook en el proyecto kimografico, asegurando rutas, imports y convenciones correctas.

---

## 1. Ubicación de las stories

- Todas las stories deben ir en `/src/components/stories/`.
- Si el componente está en una subcarpeta (ej: `ui/ProjectLine.tsx`), la story debe ir en la subcarpeta correspondiente: `/src/components/stories/ui/ProjectLine.stories.tsx`.
- No crear stories fuera de esta estructura.

## 2. Importación de componentes

- Importar el componente desde su ruta relativa a la carpeta `stories`.
  - Ejemplo para un componente en `ui/`:  
    `import ProjectLine from '../../ui/ProjectLine';`
  - Ejemplo para un componente en `iconos/`:  
    `import IconSkate from '../../iconos/IconSkate';`
- Usar siempre imports relativos, nunca absolutos ni aliases.

## 3. Estructura básica de una story

- Usar el tipo `Meta` y `StoryObj` de `@storybook/react-vite` (o `@storybook/react` si se usa otro builder).
- Exportar por defecto el meta con título, componente y parámetros opcionales.
- Definir al menos una story básica (`Default`).

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import ProjectLine from '../../ui/ProjectLine';

const meta: Meta<typeof ProjectLine> = {
  title: 'ui/ProjectLine',
  component: ProjectLine,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof ProjectLine>;

export const Default: Story = {
  args: {
    num: '01',
    title: 'Proyecto de ejemplo',
    tipo: 'Web',
    year: '2024',
    href: '#',
  },
};
```

## 4. Convenciones de título

- El campo `title` debe reflejar la subcarpeta y el nombre del componente:
  - Ejemplo: `ui/ProjectLine`, `iconos/IconSkate`, `resume/SkillRow`.
- Usar mayúscula solo en la primera letra del nombre del componente.

## 5. Buenas prácticas

- Añadir más de una story si el componente tiene variantes visuales relevantes.
- Usar el objeto `args` para pasar props.
- Si el componente acepta children, mostrar ejemplos variados.
- Si el componente usa iconos, importarlos desde `../../iconos/`.
- Mantener las stories simples y autoexplicativas.

## 6. Testing y lint

- Verificar que la story no genera errores de import ni de tipo.
- Seguir las reglas de ESLint y Prettier del proyecto.

---

## Resumen rápido

- Ruta: `/src/components/stories/[subcarpeta]/Componente.stories.tsx`
- Import: siempre relativo desde `../../[subcarpeta]/Componente`
- Estructura: usar Meta y StoryObj, exportar meta y al menos una story
- Título: `[subcarpeta]/Componente`
- Añadir variantes si aplica

---
