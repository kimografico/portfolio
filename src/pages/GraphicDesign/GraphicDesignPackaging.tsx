import packagingData from '../../data/graphic-design/packaging.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import { IconCode } from '../../components/iconos';

const projects = packagingData as GraphicDesignProject[];

export default function GraphicDesignPackaging() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-packaging">
      <CategoryHero
        title="Packaging"
        description="Diseño de empaques, cajas y etiquetas para productos."
        color="amber"
        opacity={0.1}
        dataId="graphic-design-packaging-hero"
        backLink="/graphic-design"
        backLinkText="Volver a Diseño Gráfico"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="packaging-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los diseños de packaging."
            dataId="packaging-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="packaging-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/graphic-design/packaging/${project.id}`}
                dataId={`packaging-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
