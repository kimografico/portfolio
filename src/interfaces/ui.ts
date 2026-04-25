// Interfaces para componentes UI reutilizables

export interface NavLink {
  label: string;
  href: string;
}

export interface MobileMenuProps {
  navLinks: NavLink[];
}
