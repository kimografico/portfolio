import carteriaData from '../../data/graphic-design/carteleria.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import { IconCode } from '../../components/iconos';

const projects = carteriaData as GraphicDesignProject[];

export default function GraphicDesignCarteleria() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-carteleria">
      <CategoryHero
        title="Cartelería"
        description="Diseño de carteles, señalética y material publicitario exterior."
        color="red"
        opacity={0.1}
        dataId="graphic-design-carteleria-hero"
        backLink="/graphic-design"
        backLinkText="Volver a Diseño Gráfico"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="carteleria-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los diseños de cartelería."
            dataId="carteleria-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="carteleria-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/graphic-design/carteleria/${project.id}`}
                dataId={`carteleria-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
