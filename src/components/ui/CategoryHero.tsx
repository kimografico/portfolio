import { Link } from 'react-router-dom';

/**
 * CategoryHero
 * Componente reutilizable para el hero/header de secciones de categorías.
 * Muestra título, descripción y enlace de retroceso.
 */
interface CategoryHeroProps {
  /** Título principal de la sección */
  title: string;
  /** Descripción o subtitle */
  description: string;
  /** Ruta a la que vuelve el enlace de retroceso (default: "/dev") */
  backLink?: string;
  /** Texto del enlace de retroceso (default: "← Desarrollo web") */
  backLinkText?: string;
  /** ID para atributos data-id (tests/debugging) */
  dataId?: string;
}

export default function CategoryHero({
  title,
  description,
  backLink = '/dev',
  backLinkText = '← Desarrollo web',
  dataId = 'category-hero',
}: CategoryHeroProps) {
  return (
    <section
      className="bg-gradient-to-b from-bg to-surface border-b border-border py-16 px-4 text-center"
      data-id={dataId}
    >
      <Link
        to={backLink}
        className="text-sm text-muted hover:text-ink transition-colors mb-6 inline-block"
      >
        {backLinkText}
      </Link>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">{title}</h1>
      <p className="max-w-2xl mx-auto text-lg text-muted">{description}</p>
    </section>
  );
}
