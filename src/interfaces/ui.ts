// Interfaces para componentes UI reutilizables
import type React from 'react';

/**
 * Tipo genérico para todos los componentes de iconos SVG.
 * Extiende React.SVGProps para permitir className y otros atributos SVG.
 */
export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export interface NavLink {
  label: string;
  href: string;
}

export interface MobileMenuProps {
  navLinks: NavLink[];
  dataId?: string;
}
