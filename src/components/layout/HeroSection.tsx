/**
 * HeroSection: Sección principal (Hero) de la página.
 * Componente reutilizable para landings.
 */

import UIButton from '../ui/UIButton';
import type { ReactNode } from 'react';

export interface HeroSectionProps {
  label?: string;
  title: ReactNode;
  description: string;
  ctas?: Array<{ label: string; href: string }>;
  decorator?: string;
}

export default function HeroSection({
  label = 'Portfolio — 2026',
  title,
  description,
  ctas = [],
  decorator = '01',
}: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-heading" className="border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
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

          {/* Decorativo */}
          {decorator && (
            <div className="hidden md:block select-none" aria-hidden="true">
              <span className="font-bold tracking-tighter leading-none text-[10rem] text-border">
                {decorator}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
