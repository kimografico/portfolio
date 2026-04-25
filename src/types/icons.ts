import type React from 'react';

/**
 * Tipo genérico para todas los componentes de iconos.
 * Usado por todos los iconos SVG en src/components/iconos/
 * Extiende React.SVGProps para permitir className y otros atributos SVG.
 */
export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
};
