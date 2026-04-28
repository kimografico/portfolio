import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import type { IconProps } from '../../types/icons';
import './CategoryHero.css';

// Obtener la ruta base para imágenes UI desde variables de entorno
const UI_IMG_PATH = import.meta.env.VITE_UI_IMG_PATH || '/images/ui';

/**
 * CategoryHero
 * Componente mejorado y reutilizable para el hero/header de secciones de categorías.
 * Muestra título, descripción, icono (opcional) y enlace de retroceso (opcional) con imagen de fondo.
 * Perfectamente adaptable para secciones principales o subsecciones.
 *
 * Mejoras visuales:
 * - Icono representativo (opcional, con animación float)
 * - Imagen de fondo parametrizada con offset vertical aleatorio
 * - Colores y overlay parametrizables
 * - Enlace de retroceso opcional
 * - Overlay con animación cíclica suave
 */
interface CategoryHeroProps {
  /** Título principal de la sección */
  title: string;
  /** Descripción o subtitle */
  description: string;
  /** Icono representativo de la categoría (opcional) */
  icon?: React.FC<IconProps>;
  /** URL de imagen de fondo (opcional, usa fallback si no se proporciona) */
  backgroundImage?: string;
  /** Color del overlay (default: --color-bg) */
  color?: string;
  /** Opacidad del overlay oscuro (0-1, default: 0.25) */
  opacity?: number;
  /** Ruta a la que vuelve el enlace de retroceso (opcional, si no se proporciona no se muestra) */
  backLink?: string;
  /** Texto del enlace de retroceso (default: "← Atrás") */
  backLinkText?: string;
  /** ID para atributos data-id (tests/debugging) */
  dataId?: string;
}

export default function CategoryHero({
  title,
  description,
  icon: Icon,
  backgroundImage,
  color = 'var(--color-bg)',
  opacity = 0.25,
  backLink,
  backLinkText = 'Atrás',
  dataId = 'category-hero',
}: CategoryHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [backgroundOffset, setBackgroundOffset] = useState(0);

  // Calcular offset vertical aleatorio basado en la altura del contenedor
  useEffect(() => {
    if (sectionRef.current) {
      const containerHeight = sectionRef.current.offsetHeight;
      // Offset aleatorio entre 0 y la altura del contenedor
      const randomOffset = Math.floor(Math.random() * containerHeight);
      setBackgroundOffset(randomOffset);
    }
  }, []);

  // Usar imagen personalizada o fallback
  const finalBackgroundImage = backgroundImage || `url(${UI_IMG_PATH}/category-bg.jpeg)`;

  return (
    <section
      ref={sectionRef}
      className="category-hero relative overflow-hidden py-24 px-4 text-center border-b border-border"
      data-id={dataId}
    >
      {/* Imagen de fondo con offset vertical aleatorio */}
      <div
        className="category-hero-background"
        style={{
          backgroundImage:
            typeof finalBackgroundImage === 'string' && !finalBackgroundImage.startsWith('url(')
              ? `url('${finalBackgroundImage}')`
              : finalBackgroundImage,
          backgroundPosition: `center -${backgroundOffset}px`,
        }}
      />

      {/* Overlay oscuro para legibilidad con animación cíclica */}
      <div
        className="category-hero-overlay"
        style={
          {
            backgroundColor: color,
            '--overlay-max-opacity': opacity,
          } as React.CSSProperties
        }
      />

      {/* Decoración de fondo sutil */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/50 rounded-full blur-3xl" />
      </div>

      {/* Contenido con z-index para aparecer sobre decoración */}
      <div className="relative z-10">
        {/* Icono + Título centrados */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {Icon && (
            <div className="category-hero-icon">
              <Icon size={48} className="text-accent" />
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold text-ink leading-tight">{title}</h1>
        </div>

        {/* Descripción con mejor tipografía */}
        <p className="max-w-2xl mx-auto text-lg text-muted mb-8 leading-relaxed">{description}</p>

        {/* Enlace de retroceso (opcional) - Debajo de la descripción con flecha */}
        {backLink && (
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            {backLinkText}
          </Link>
        )}
      </div>
    </section>
  );
}
