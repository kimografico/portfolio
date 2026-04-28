import papeleriaData from '../../data/graphic-design/papeleria.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import { IconCode } from '../../components/iconos';

const projects = papeleriaData as GraphicDesignProject[];

export default function GraphicDesignPapeleria() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-papeleria">
      <CategoryHero
        title="Papelería"
        description="Diseño de papelería corporativa, trípticos, flyers y material impreso."
        color="blue"
        opacity={0.1}
        dataId="graphic-design-papeleria-hero"
        backLink="/graphic-design"
        backLinkText="Volver a Diseño Gráfico"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="papeleria-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los diseños de papelería."
            dataId="papeleria-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="papeleria-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/graphic-design/papeleria/${project.id}`}
                dataId={`papeleria-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
