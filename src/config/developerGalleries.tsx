/**
 * developerGalleries.tsx
 *
 * Configuración centralizada de todas las galerías de Desarrollo Web.
 * Para añadir una nueva categoría: añade un objeto a este array.
 */

import type { WebProject } from '../interfaces/developer';
import type { BaseProject } from '../components/ui/ProjectCard';
import type { IconProps } from '../types/icons';

import wordpressData from '../data/development/wordpress.json';
import vanillaData from '../data/development/vanilla.json';
import frameworksData from '../data/development/frameworks.json';

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
} from '../components/iconos';
// Mapa centralizado de iconos para stacks tecnológicos
const stackIconMap: Record<string, React.FC<IconProps>> = {
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

import type { GalleryRouteConfig } from './graphicDesignGalleries';

const DEV_BACK = '/dev';
const DEV_BACK_TEXT = 'Volver a Desarrollo';

export const developerGalleries: GalleryRouteConfig[] = [
  {
    slug: 'wordpress',
    props: {
      projects: wordpressData as WebProject[],
      basePath: '/dev/wordpress',
      title: 'WordPress',
      description:
        'Webs desarrolladas con CMS WordPress: catálogos, tiendas online, portfolios y webs corporativas.',
      icon: LogoWordpress,
      color: 'blue',
      opacity: 0.075,
      backLink: DEV_BACK,
      backLinkText: DEV_BACK_TEXT,
      IconFallback: IconCode,
      webProject: true,
      stackIconMap,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados con WordPress.',
      dataIdPrefix: 'wordpress',
    },
  },
  {
    slug: 'vanilla',
    props: {
      projects: vanillaData as WebProject[] as BaseProject[],
      basePath: '/dev/vanilla',
      title: 'Vanilla',
      description:
        'Webs desarrolladas con HTML, CSS y JavaScript puro, sin depender de frameworks ni CMS.',
      icon: IconCode,
      color: 'yellow',
      opacity: 0.15,
      backLink: DEV_BACK,
      backLinkText: DEV_BACK_TEXT,
      IconFallback: IconCode,
      webProject: true,
      stackIconMap,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los proyectos en Vanilla.',
      dataIdPrefix: 'vanilla',
    },
  },
  {
    slug: 'frameworks',
    props: {
      projects: frameworksData as WebProject[] as BaseProject[],
      basePath: '/dev/frameworks',
      title: 'Frameworks',
      description: 'Proyectos desarrollados con frameworks modernos: React, Vue y otros.',
      icon: LogoReact,
      color: 'green',
      opacity: 0.1,
      backLink: DEV_BACK,
      backLinkText: DEV_BACK_TEXT,
      IconFallback: IconCode,
      webProject: true,
      stackIconMap,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los proyectos con frameworks modernos.',
      dataIdPrefix: 'frameworks',
    },
  },
];
