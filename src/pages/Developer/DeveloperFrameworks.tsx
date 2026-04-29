import frameworksData from '../../data/development/frameworks.json';
import type { WebProject } from '../../interfaces/developer';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import './Developer.css';

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

// Mapeo de tecnologías a iconos específico de Frameworks
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
    <CategoryGalleryPage
      projects={projects}
      basePath="/dev/frameworks"
      title="Frameworks"
      description="Proyectos desarrollados con frameworks modernos: React, Vue y otros."
      icon={LogoReact}
      color="green"
      opacity={0.1}
      backLink="/dev"
      backLinkText="Volver a Desarrollo"
      IconFallback={IconCode}
      webProject
      stackIconMap={stackIconMap}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados con frameworks modernos."
      dataIdPrefix="frameworks"
    />
  );
}
