import type { ReactNode } from 'react';

export interface HeroSectionProps {
  label?: string;
  title: ReactNode;
  description: string;
  ctas?: Array<{ label: string; href: string }>;
  /** Texto decorativo grande a la derecha. Se oculta si hay image. */
  decorator?: string;
  /** URL de imagen a mostrar a la derecha en lugar del decorator */
  image?: string;
  /** Color del triángulo separador inferior. Si se omite, no se muestra. */
  separator?: string;
}
