import type { ReactNode } from 'react';

export interface HeroSectionProps {
  label?: string;
  title: ReactNode;
  /** Puede ser un `string` o un array de `string` cuando se usa `animated` */
  description: string | string[];
  ctas?: Array<{ label: string; href: string }>;
  /** Texto decorativo grande a la derecha. Se oculta si hay image. */
  decorator?: string;
  /** URL de imagen a mostrar a la derecha en lugar del decorator */
  image?: string;
  /** Color del triángulo separador inferior. Si se omite, no se muestra. */
  separator?: string;
  /** Si es true y `description` es un array, rota las descripciones cada Xs */
  animated?: boolean;
  /** Segundos entre cada rotación de descripción. Default: 10 */
  speed?: number;
}
