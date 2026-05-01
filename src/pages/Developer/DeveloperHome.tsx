import { useState } from 'react';
import { IconCode, IconReact, IconWP } from '../../components/iconos';
import { CategoryCard } from '../../components/ui/CategoryCard';
import CategoryHero from '../../components/ui/CategoryHero';
import HeroSection from '../../components/layout/HeroSection';
import RecentProjectsSection from '../../components/layout/RecentProjectsSection';
import recentWorks from '../../data/recent-works.json';
import type { Project } from '../../interfaces/project';

const CATEGORIES = [
  {
    key: 'wordpress',
    title: 'WordPress',
    description: 'Webs con CMS WordPress: catálogos, tiendas online y portfolios.',
    icon: IconWP,
  },
  {
    key: 'vanilla',
    title: 'Vanilla',
    description: 'Webs con HTML, CSS y JavaScript puro, sin frameworks.',
    icon: IconCode,
  },
  {
    key: 'frameworks',
    title: 'Frameworks',
    description: 'Proyectos con React, Vue u otros frameworks modernos.',
    icon: IconReact,
  },
];

export default function DeveloperHome() {
  // Calcular acceso directo usando inicializador de estado
  // Evita el warning de setState en efecto
  const [isDirectAccess] = useState(() => window.history.length === 1);

  // Filtrar proyectos recientes por categoría Developer
  const developerProjects = (recentWorks as Project[]).filter(
    (project) => project.category === 'Developer',
  );
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
          separator="#225cba"
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
            <RecentProjectsSection projects={developerProjects} viewAllHref="/portfolio/dev" />
          )}
        </>
      )}

      {/* Categorías */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12" data-id="developer-categories">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8" data-id="categories-grid">
          {CATEGORIES.map((category) => (
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
