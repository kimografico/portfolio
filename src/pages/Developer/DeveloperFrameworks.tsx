import { Link } from 'react-router-dom';

import frameworksData from '../../data/development/frameworks.json';
import type { WebProject } from '../../interfaces/developer';
import { ProjectCard } from '../../components/ui/ProjectCard';
import EmptyState from '../../components/ui/EmptyState';
import './Developer.css';

// Importar iconos relevantes
import {
  LogoHTML,
  LogoCSS,
  LogoJS,
  LogoReact,
  LogoAngular,
  LogoVue,
  IconCode,
  LogoAjax,
} from '../../components/iconos';

// Mapeo de tecnologías a iconos
const stackIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  HTML: LogoHTML,
  CSS: LogoCSS,
  JAVASCRIPT: LogoJS,
  JS: LogoJS,
  REACT: LogoReact,
  ANGULAR: LogoAngular,
  VUE: LogoVue,
  AJAX: LogoAjax,
};

const projects = frameworksData as WebProject[];

export default function DeveloperFrameworks() {
  return (
    <div className="min-h-screen flex flex-col" data-id="developer-frameworks">
      {/* Hero */}
      <section
        className="bg-gradient-to-b from-bg to-surface border-b border-border py-16 px-4 text-center"
        data-id="developer-frameworks-hero"
      >
        <Link
          to="/dev"
          className="text-sm text-muted hover:text-ink transition-colors mb-6 inline-block"
        >
          ← Desarrollo web
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">Frameworks</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted">
          Proyectos desarrollados con frameworks modernos: React, Vue y otros.
        </p>
      </section>

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="frameworks-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados con frameworks modernos."
            dataId="frameworks-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="frameworks-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/dev/frameworks/${project.id}`}
                stackIconMap={stackIconMap}
                webProject
                dataId={`frameworks-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
