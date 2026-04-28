import proyectosEspecialesData from '../../data/graphic-design/proyectos-especiales.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import { IconCode } from '../../components/iconos';

const projects = proyectosEspecialesData as GraphicDesignProject[];

export default function GraphicDesignProyectosEspeciales() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-proyectos-especiales">
      <CategoryHero
        title="Proyectos especiales"
        description="Proyectos gráficos singulares, personalizados o fuera de categoría."
        color="indigo"
        opacity={0.1}
        dataId="graphic-design-proyectos-especiales-hero"
        backLink="/graphic-design"
        backLinkText="Volver a Diseño Gráfico"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="proyectos-especiales-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los proyectos especiales."
            dataId="proyectos-especiales-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="proyectos-especiales-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/graphic-design/proyectos-especiales/${project.id}`}
                dataId={`proyectos-especiales-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
