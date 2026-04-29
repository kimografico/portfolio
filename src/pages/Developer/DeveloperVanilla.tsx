import vanillaData from '../../data/development/vanilla.json';
import type { WebProject } from '../../interfaces/developer';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import './Developer.css';

import {
  LogoHTML,
  LogoCSS,
  LogoJS,
  LogoPHP,
  LogoPrestashop,
  LogoFlash,
  IconCode,
  LogoAjax,
  IconTPV,
} from '../../components/iconos';

// Mapeo de tecnologías a iconos específico de Vanilla JS
const stackIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  HTML: LogoHTML,
  CSS: LogoCSS,
  JAVASCRIPT: LogoJS,
  JS: LogoJS,
  PHP: LogoPHP,
  PRESTASHOP: LogoPrestashop,
  AJAX: LogoAjax,
  'TPV VIRTUAL': IconTPV,
  FLASH: LogoFlash,
};

const projects = vanillaData as WebProject[];

export default function DeveloperVanilla() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/dev/vanilla"
      title="Vanilla JS"
      description="Webs desarrolladas con HTML, CSS y JavaScript puro, sin depender de frameworks ni CMS."
      icon={IconCode}
      color="yellow"
      opacity={0.15}
      backLink="/dev"
      backLinkText="Volver a Desarrollo"
      IconFallback={IconCode}
      webProject
      stackIconMap={stackIconMap}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados en Vanilla JS."
      dataIdPrefix="vanilla"
    />
  );
}
