import { useState, type ReactNode, type ComponentType } from 'react';
import { CategoryCard } from '../ui/CategoryCard';
import CategoryHero from '../ui/CategoryHero';
import HeroSection from '../layout/HeroSection';
import RecentProjectsSection from '../layout/RecentProjectsSection';
import recentWorks from '../../data/recent-works.json';
import { APP_BASENAME } from '../../data/config/app';
import type { Project } from '../../interfaces/project';

/**
 * Configuración de categoría para CategoryCard.
 * Coincide con la estructura exportada desde categoryCatalog.ts
 */
interface CategoryConfig {
  key: string;
  title: string;
  description: string;
  icon: ComponentType<{ size: number; strokeWidth: number; className: string }>;
}

interface CategoryHomeTemplateProps {
  /** Tipo de categoría para filtrado de proyectos recientes */
  categoryType: 'Developer' | 'GraphicDesign';
  /** Base path para las rutas (ej: '/dev' o '/graphic-design') */
  basePath: string;
  /** data-id principal del contenedor */
  dataId: string;

  /** Props del HeroSection para acceso directo */
  hero: {
    label: string;
    title: ReactNode;
    description: string;
    image: string;
    separatorColor: string;
  };

  /** Props del CategoryHero para navegación interna */
  categoryHero: {
    title: string;
    description: string;
    dataId: string;
  };

  /** Lista de categorías a mostrar en la grilla */
  categories: CategoryConfig[];

  /** Color de hover para las tarjetas de categoría (opcional) */
  categoryHoverColor?: string;

  /** data-id para la sección de categorías */
  categoriesSectionDataId: string;

  /** Configuración de columnas responsivas (opcional, default: '1 / sm:2 / md:3') */
  gridCols?: string;
}

/**
 * CategoryHomeTemplate
 *
 * Componente genérico que unifica las páginas de inicio de categoría (Developer, GraphicDesign).
 * Abstrae la lógica común de:
 * - Detección de acceso directo vs navegación interna
 * - Filtrado de proyectos recientes por categoría
 * - Renderización condicional de secciones hero
 * - Grilla de tarjetas de categoría
 *
 * @example
 * ```tsx
 * <CategoryHomeTemplate
 *   categoryType="Developer"
 *   basePath="/dev"
 *   dataId="developer-home"
 *   hero={{
 *     label: "Desarrollo Web",
 *     title: <>Desarrollador<br/>frontend & backend</>,
 *     description: "...",
 *     image: "/images/ui/K3.png",
 *     separatorColor: "var(--color-dev)"
 *   }}
 *   categoryHero={{
 *     title: "Desarrollo Web",
 *     description: "...",
 *     dataId: "developer-hero"
 *   }}
 *   categories={DEVELOPER_CATEGORIES}
 *   categoriesSectionDataId="developer-categories"
 * />
 * ```
 */
export default function CategoryHomeTemplate({
  categoryType,
  basePath,
  dataId,
  hero,
  categoryHero,
  categories,
  categoryHoverColor,
  categoriesSectionDataId,
  gridCols = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
}: CategoryHomeTemplateProps) {
  /**
   * isDirectAccess: Señal UX interna que permite ajustar la experiencia visual
   * entre navegación interna y acceso directo.
   *
   * - Acceso directo (externo): Muestra HeroSection completo + RecentProjectsSection
   * - Navegación interna: Muestra CategoryHero simplificado
   *
   * NO constituye control de acceso real, solo UX.
   */
  const [isDirectAccess] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return !window.sessionStorage.getItem('isInternal');
  });

  // Filtrar proyectos recientes por categoría y agregar APP_BASENAME a las URLs
  const filteredProjects = (recentWorks as Project[])
    .filter((project) => project.category === categoryType)
    .map((project) => ({
      ...project,
      href: `${APP_BASENAME}${project.href}`,
    }));

  return (
    <div className="min-h-screen flex flex-col" data-id={dataId}>
      {/* HeroSection solo si acceso es directo/externo */}
      {isDirectAccess && (
        <HeroSection
          label={hero.label}
          title={hero.title}
          description={hero.description}
          separator={hero.separatorColor}
          image={`${import.meta.env.BASE_URL}${hero.image}`}
        />
      )}

      {/* CategoryHero solo si navegación interna */}
      {!isDirectAccess && (
        <CategoryHero
          title={categoryHero.title}
          description={categoryHero.description}
          dataId={categoryHero.dataId}
        />
      )}

      {/* RecentProjectsSection solo si acceso es directo/externo */}
      {isDirectAccess && filteredProjects.length > 0 && (
        <RecentProjectsSection
          projects={filteredProjects}
          viewAllHref={`${APP_BASENAME}${basePath}`}
        />
      )}

      {/* Categorías en grilla */}
      <section
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-12"
        data-id={categoriesSectionDataId}
      >
        <div className={`grid ${gridCols} gap-8`} data-id="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              icon={category.icon}
              title={category.title}
              description={category.description}
              to={`${basePath}/${category.key}`}
              hoverColor={categoryHoverColor}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
