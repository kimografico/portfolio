import { Link } from 'react-router-dom';
import type { FC, ComponentType } from 'react';
import './CategoryCard.css';

interface CategoryCardProps {
  icon: ComponentType<{ size: number; strokeWidth: number; className: string }>; // Componente de icono (ej: IconPlant, IconCode, etc.)
  title: string; // Título de la categoría
  description: string; // Descripción breve de la categoría
  to: string; // Ruta a la que navega al hacer clic
  hoverColor?: string; // Color de hover opcional (CSS variable o valor). Por defecto: var(--color-accent)
}

/**
 * CategoryCard
 * Componente reutilizable para mostrar una tarjeta de categoría con icono, título y descripción.
 * Se usa en las páginas de inicio de Diseño Gráfico y Desarrollo Web.
 *
 * @param icon - Componente del icono a mostrar
 * @param title - Título de la categoría
 * @param description - Descripción breve
 * @param to - Ruta de navegación
 * @param hoverColor - Color de hover (opcional, por defecto var(--color-accent))
 */
export const CategoryCard: FC<CategoryCardProps> = ({
  icon: Icon,
  title,
  description,
  to,
  hoverColor = 'var(--color-accent)',
}) => {
  return (
    <Link
      to={to}
      className="category-card"
      style={{ '--hover-color': hoverColor } as React.CSSProperties}
    >
      <span className="category-card__icon" aria-hidden="true">
        <Icon size={96} strokeWidth={0.75} className="" />
      </span>
      <h2 className="category-card__title">{title}</h2>
      <p className="category-card__description">{description}</p>
    </Link>
  );
};
