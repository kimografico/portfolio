import { useState } from 'react';
import { CategoryCard } from '../../components/ui/CategoryCard';
import CategoryHero from '../../components/ui/CategoryHero';
import HeroSection from '../../components/layout/HeroSection';
import RecentProjectsSection from '../../components/layout/RecentProjectsSection';
import { GRAPHIC_DESIGN_CATEGORIES } from './categories';
import recentWorks from '../../data/recent-works.json';
import { APP_BASENAME } from '../../data/config/app';
import type { Project } from '../../interfaces/project';

export default function GraphicDesignHome() {
  // Detectar acceso directo usando sessionStorage. Si no hay flag de acceso interno, es acceso directo/externo
  const [isDirectAccess] = useState(() => !sessionStorage.getItem('isInternal'));

  // Filtrar proyectos recientes por categoría GraphicDesign y agregar APP_BASENAME
  const graphicDesignProjects = (recentWorks as Project[])
    .filter((project) => project.category === 'GraphicDesign')
    .map((project) => ({
      ...project,
      href: `${APP_BASENAME}${project.href}`,
    }));

  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-home">
      {/* Mostrar HeroSection solo si acceso es directo/externo */}
      {isDirectAccess && (
        <HeroSection
          label="Diseño Gráfico"
          title={
            <>
              Diseñador gráfico
              <br />
              afincado en Valencia
            </>
          }
          description="Diseño soluciones visuales a medida, fusionando estrategia y detalle. Ayudo a marcas a proyectar su esencia con coherencia, desde la identidad hasta la web. Mi objetivo es acompañar la evolución de tu empresa, transformando sus fortalezas en una comunicación impecable."
          image={`${import.meta.env.BASE_URL}images/ui/K2.png`}
          separator="var(--color-design)"
        />
      )}
      {/* CategoryHero siempre visible */}
      {!isDirectAccess && (
        <CategoryHero
          title="Diseño Gráfico"
          description="Selecciona una categoría para explorar proyectos de diseño gráfico: branding, papelería, cartelería, multimedia, ilustración, packaging y más. Cada sección muestra ejemplos reales, procesos y resultados."
          dataId="graphic-design-hero"
        />
      )}{' '}
      {/* Mostrar RecentProjectsSection y SobreSection solo si acceso es directo/externo */}
      {isDirectAccess && (
        <>
          {graphicDesignProjects.length > 0 && (
            <RecentProjectsSection
              projects={graphicDesignProjects}
              viewAllHref={`${APP_BASENAME}/graphic-design`}
            />
          )}
        </>
      )}
      {/* Categorías en rejilla */}
      <section
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-12"
        data-id="graphic-design-categories"
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          data-id="categories-grid"
        >
          {GRAPHIC_DESIGN_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.key}
              icon={category.icon}
              title={category.title}
              description={category.description}
              to={`/graphic-design/${category.key}`}
              hoverColor="#dc2626"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
