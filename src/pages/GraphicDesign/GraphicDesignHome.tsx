import { useState } from 'react';
import {
  IconPen,
  IconFlyer,
  IconPoster,
  IconLaptop,
  IconBox,
  IconBottle,
  IconBook,
  IconImage,
} from '../../components/iconos';
import { CategoryCard } from '../../components/ui/CategoryCard';
import CategoryHero from '../../components/ui/CategoryHero';
import HeroSection from '../../components/layout/HeroSection';
import RecentProjectsSection from '../../components/layout/RecentProjectsSection';
import recentWorks from '../../data/recent-works.json';
import type { Project } from '../../interfaces/project';

const CATEGORIES = [
  {
    key: 'logotipos',
    title: 'Branding & Logotipos',
    description: 'Identidad visual, logotipos y sistemas de marca.',
    icon: IconPen,
  },
  {
    key: 'editorial',
    title: 'Editorial',
    description: 'Diseño de publicaciones, revistas y materiales editoriales.',
    icon: IconBook,
  },
  {
    key: 'etiquetas',
    title: 'Etiquetas',
    description: 'Diseño de etiquetas, pegatinas y elementos gráficos para packaging.',
    icon: IconBottle,
  },
  {
    key: 'papeleria',
    title: 'Papelería Corporativa',
    description: 'Tarjetas, sobres, carpetas y material corporativo.',
    icon: IconFlyer,
  },
  {
    key: 'carteleria',
    title: 'Cartelería',
    description: 'Posters, flyers y material promocional.',
    icon: IconPoster,
  },
  {
    key: 'packaging',
    title: 'Packaging',
    description: 'Envases, etiquetas y diseño de producto.',
    icon: IconBox,
  },
  {
    key: 'multimedia',
    title: 'Digital & Multimedia',
    description: 'Diseño para vídeo, web y presentaciones.',
    icon: IconLaptop,
  },
  {
    key: 'proyectos-especiales',
    title: 'Proyectos especiales',
    description: 'Proyectos gráficos singulares, personalizados o fuera de categoría.',
    icon: IconImage,
  },
];

export default function GraphicDesignHome() {
  // Calcular acceso directo usando inicializador de estado
  // Evita el warning de setState en efecto
  const [isDirectAccess] = useState(() => window.history.length === 2);

  // Filtrar proyectos recientes por categoría GraphicDesign
  const graphicDesignProjects = (recentWorks as Project[]).filter(
    (project) => project.category === 'GraphicDesign',
  );

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
          separator="orange"
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
              viewAllHref="/portfolio/graphic-design"
            />
          )}
        </>
      )}
      {/* Categorías en rejilla */}
      <main
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-12"
        data-id="graphic-design-categories"
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          data-id="categories-grid"
        >
          {CATEGORIES.map((category) => (
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
      </main>
    </div>
  );
}
