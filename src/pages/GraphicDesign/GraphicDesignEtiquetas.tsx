import etiquetasData from '../../data/graphic-design/etiquetas.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import { IconBottle } from '../../components/iconos';

const projects = etiquetasData as GraphicDesignProject[];

export default function GraphicDesignEtiquetas() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-etiquetas">
      <CategoryHero
        title="Etiquetas"
        description="Diseño de etiquetas, pegatinas y elementos gráficos para packaging y branding."
        dataId="graphic-design-etiquetas-hero"
        backLink="/graphic-design"
        backLinkText="Volver a Diseño Gráfico"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="etiquetas-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí diseños de etiquetas y elementos gráficos."
            dataId="etiquetas-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="etiquetas-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/graphic-design/etiquetas/${project.id}`}
                dataId={`etiquetas-card-${project.id}`}
                IconFallback={IconBottle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
