/**
 * HeroSection: Sección principal (Hero) de la página.
 * Componente reutilizable para landings.
 */

import UIButton from '../ui/UIButton';

import type { HeroSectionProps } from '../../interfaces/hero';

export default function HeroSection({
  label = 'Portfolio — 2026',
  title,
  description,
  ctas = [],
  decorator = '01',
  image,
  separator,
}: HeroSectionProps) {
  const paddingClass = separator ? 'pt-10 md:pt-16 pb-0 md:pb-4' : 'py-20 md:py-32';

  return (
    <section
      aria-labelledby="hero-heading"
      className={`relative overflow-hidden${separator ? '' : ' border-b border-border'}`}
      data-id="hero-section"
    >
      {/* CAPA z-[0]: Triángulo trasero (semitransparente).
          Empieza en el 25% izquierdo, llega a 200px de alto a la derecha.
          Es absolute, se ancla al fondo de la sección. */}
      {separator && (
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 z-[0]"
          style={{ height: '150px' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: separator,
              opacity: 0.5,
              // Triángulo: vértice en (25%, top), esquina derecha arriba, esquina derecha abajo
              clipPath: 'polygon(35% 100%, 100% 0, 100% 100%)',
            }}
          />
        </div>
      )}

      {/* CAPA z-[1]: Imagen decorativa.
          - Se ancla al fondo (bottom-0) y ocupa el alto de la sección (top-0)
          - right-[8vw] da ~100px de margen en pantallas normales sin romper en small
          - max-w-[35%] impide que invada la columna de texto (max-w-[52ch]) */}
      {image && (
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-y-0 right-[8vw] z-[1] pointer-events-none mt-10"
          style={{ maxWidth: '35%' }}
        >
          <img src={image} alt="" className="h-full w-auto object-contain object-bottom" />
        </div>
      )}

      {/* CAPA z-[10]: Contenido de texto, siempre por encima de todo lo decorativo */}
      <div className={`relative z-[10] max-w-7xl mx-auto px-6 md:px-12 ${paddingClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
          <div className="animate-fade-up">
            {label && (
              <p className="font-mono text-xs tracking-widest uppercase text-muted mb-10">
                {label}
              </p>
            )}
            <h1
              id="hero-heading"
              className="text-5xl md:text-7xl font-semibold tracking-tighter leading-none text-ink mb-8"
            >
              {title}
            </h1>
            <p className="text-base leading-relaxed text-muted max-w-[52ch] mb-12">{description}</p>
            {ctas.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {ctas.map((cta) => (
                  <UIButton key={cta.href} href={cta.href} arrow>
                    {cta.label}
                  </UIButton>
                ))}
              </div>
            )}
          </div>

          {!image && decorator && (
            <div className="hidden md:block select-none" aria-hidden="true">
              <span className="font-bold tracking-tighter leading-none text-[10rem] text-border">
                {decorator}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CAPA z-[2]: Triángulo delantero (opacidad total), encima de la imagen.
          Trapecio de 5px arriba-izquierda a 50px arriba-derecha.
          La reserva de 200px en height del contenedor garantiza espacio visual
          para ambos triángulos. Se ancla al fondo. */}
      {separator && (
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 z-[2]"
          style={{ height: '50px' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: separator,
              // Trapecio: (0, 45px) → (100%, 0) → (100%, 50px) → (0, 50px)
              clipPath: 'polygon(0 45px, 100% 0, 100% 50px, 0 50px)',
            }}
          />
        </div>
      )}

      {/* Espaciador en flujo normal para que la sección reserve altura para los triángulos */}
      {separator && <div aria-hidden="true" style={{ height: '200px' }} />}
    </section>
  );
}
