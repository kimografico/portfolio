import { useState } from 'react';
import { CategoryCard } from '../../components/ui/CategoryCard';
import CategoryHero from '../../components/ui/CategoryHero';
import HeroSection from '../../components/layout/HeroSection';
import RecentProjectsSection from '../../components/layout/RecentProjectsSection';
import { DEVELOPER_CATEGORIES } from './categories';
import recentWorks from '../../data/recent-works.json';
import { APP_BASENAME } from '../../data/config/app';
import type { Project } from '../../interfaces/project';

export default function DeveloperHome() {
  // Detectar acceso directo usando sessionStorage
  // Si no hay flag de acceso interno, es acceso directo/externo
  const [isDirectAccess] = useState(() => !sessionStorage.getItem('isInternal'));

  // Filtrar proyectos recientes por categoría Developer y agregar APP_BASENAME
  const developerProjects = (recentWorks as Project[])
    .filter((project) => project.category === 'Developer')
    .map((project) => ({
      ...project,
      href: `${APP_BASENAME}${project.href}`,
    }));
  return (
    <div className="min-h-screen flex flex-col" data-id="developer-home">
      {/* Mostrar HeroSection solo si acceso es directo/externo */}
      {isDirectAccess && (
        <HeroSection
          label="Desarrollo Web"
          title={
            <>
              Desarrollador
              <br />
              frontend & backend
            </>
          }
          description="Creo soluciones web modernas, escalables y performantes. Especializado en React, vanilla JavaScript y WordPress. Cada proyecto es diseñado pensando en experiencia de usuario, accesibilidad y calidad de código."
          separator="var(--color-dev)"
          image={`${import.meta.env.BASE_URL}images/ui/K3.png`}
        />
      )}

      {/* CategoryHero con visualización condicional */}
      {!isDirectAccess && (
        <CategoryHero
          title="Desarrollo Web"
          description="Proyectos de desarrollo web: WordPress, JavaScript vanilla y frameworks modernos. Cada sección muestra ejemplos reales con capturas, tecnologías utilizadas y descripción del proyecto."
          dataId="developer-hero"
        />
      )}

      {/* Mostrar RecentProjectsSection y SobreSection solo si acceso es directo/externo */}
      {isDirectAccess && (
        <>
          {developerProjects.length > 0 && (
            <RecentProjectsSection
              projects={developerProjects}
              viewAllHref={`${APP_BASENAME}/dev`}
            />
          )}
        </>
      )}

      {/* Categorías */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12" data-id="developer-categories">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8" data-id="categories-grid">
          {DEVELOPER_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.key}
              icon={category.icon}
              title={category.title}
              description={category.description}
              to={`/dev/${category.key}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
