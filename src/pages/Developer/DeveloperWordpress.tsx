import wordpressData from '../../data/development/wordpress.json';
import type { WebProject } from '../../interfaces/developer';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import './Developer.css';

// Importar iconos relevantes
import {
  LogoWordpress,
  LogoWoo,
  LogoPHP,
  LogoJS,
  LogoCSS,
  LogoHTML,
  LogoReact,
  LogoAngular,
  LogoVue,
  LogoPrestashop,
  LogoFlash,
  IconCode,
  LogoAjax,
  IconTPV,
} from '../../components/iconos';

// Mapeo de tecnologías a iconos
const stackIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  WORDPRESS: LogoWordpress,
  WOOCOMMERCE: LogoWoo,
  PHP: LogoPHP,
  JS: LogoJS,
  JAVASCRIPT: LogoJS,
  CSS: LogoCSS,
  HTML: LogoHTML,
  REACT: LogoReact,
  ANGULAR: LogoAngular,
  VUE: LogoVue,
  PRESTASHOP: LogoPrestashop,
  FLASH: LogoFlash,
  AJAX: LogoAjax,
  'TPV VIRTUAL': IconTPV,
};

const projects = wordpressData as WebProject[];

export default function DeveloperWordpress() {
  return (
    <div className="min-h-screen flex flex-col" data-id="developer-wordpress">
      <CategoryHero
        title="WordPress"
        description="Webs desarrolladas con CMS WordPress: catálogos, tiendas online, portfolios y webs corporativas."
        dataId="developer-wordpress-hero"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="wordpress-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados con WordPress."
            dataId="wordpress-empty"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" data-id="wp-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/dev/wordpress/${project.id}`}
                stackIconMap={stackIconMap}
                webProject
                dataId={`wp-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
