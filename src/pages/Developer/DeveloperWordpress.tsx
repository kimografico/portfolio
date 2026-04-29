import wordpressData from '../../data/development/wordpress.json';
import type { WebProject } from '../../interfaces/developer';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import './Developer.css';

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

// Mapeo de tecnologías a iconos específico de WordPress
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
    <CategoryGalleryPage
      projects={projects}
      basePath="/dev/wordpress"
      title="WordPress"
      description="Webs desarrolladas con CMS WordPress: catálogos, tiendas online, portfolios y webs corporativas."
      icon={LogoWordpress}
      color="blue"
      opacity={0.075}
      backLink="/dev"
      backLinkText="Volver a Desarrollo"
      IconFallback={IconCode}
      webProject
      stackIconMap={stackIconMap}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados con WordPress."
      dataIdPrefix="wordpress"
    />
  );
}
