/**
 * AboutSection: Sección "Sobre" con contenido flexible.
 * Componente para biografía o descripción general en dos columnas.
 */
import type { AboutSectionProps } from '../../interfaces/about';

export default function AboutSection({ label, heading, description }: AboutSectionProps) {
  return (
    <section
      aria-labelledby="sobre-heading"
      className="border-b border-border"
      data-id="about-section"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <div>
            <h2
              id="sobre-heading"
              className="font-mono text-xs tracking-widest uppercase text-muted"
            >
              {label}
            </h2>
          </div>
          <div>
            <p className="text-xl md:text-2xl font-medium tracking-tight text-ink leading-snug mb-6 max-w-[42ch]">
              {heading}
            </p>
            <p className="text-base leading-relaxed text-muted max-w-[52ch]">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
