/**
 * developerGalleries.tsx
 *
 * Configuración centralizada de todas las galerías de Desarrollo Web.
 * Reutiliza el catálogo único de categorías para mantener slugs y textos
 * sincronizados con la navegación y con el panel de administración.
 */

import type { WebProject } from '../../interfaces/developer';
import type { ComponentType } from 'react';
import type { IconProps } from '../../interfaces/ui';
import type { GalleryRouteConfig } from './graphicDesignGalleries';

import legacyData from '../development/legacy.json';
import appsData from '../development/apps.json';
import webData from '../development/web.json';
import experimentsData from '../development/experiments.json';
import { processProjectsImages, buildDeveloperImagePath } from './imagePathHelper';
import { DEVELOPER_CATEGORY_BY_SLUG, type CategoryCatalogEntry } from './categoryCatalog';

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
  IconSave,
  IconLaptop,
  IconSkate,
  LogoAjax,
  IconTPV,
} from '../../components/iconos';

// Mapa centralizado de iconos para stacks tecnológicos
const stackIconMap: Record<string, ComponentType<IconProps>> = {
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

const DEV_BACK = '/dev';
const DEV_BACK_TEXT = 'Volver a Desarrollo';

interface GalleryDefinition {
  slug: string;
  projects: WebProject[];
  color?: string;
  opacity?: number;
  emptyStateDescription: string;
  icon?: ComponentType<{ size: number; strokeWidth: number; className: string }>;
}

const DEVELOPER_GALLERY_DEFINITIONS: GalleryDefinition[] = [
  {
    slug: 'legacy',
    projects: legacyData as WebProject[],
    icon: IconSave,
    color: 'yellow',
    opacity: 0.15,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los proyectos hasta 2024.',
  },
  {
    slug: 'apps',
    projects: appsData as WebProject[],
    icon: IconCode,
    color: 'green',
    opacity: 0.1,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí las aplicaciones con frameworks modernos.',
  },
  {
    slug: 'web',
    projects: webData as WebProject[],
    icon: IconLaptop,
    color: 'blue',
    opacity: 0.075,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los proyectos de 2025 en adelante.',
  },
  {
    slug: 'experiments',
    projects: experimentsData as WebProject[],
    icon: IconSkate,
    color: 'orange',
    opacity: 0.1,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los proyectos experimentales.',
  },
];

const getDeveloperCategory = (slug: string): CategoryCatalogEntry => {
  const category = DEVELOPER_CATEGORY_BY_SLUG[slug];

  if (!category) {
    throw new Error(`Categoría de desarrollo desconocida: ${slug}`);
  }

  return category;
};

const createGalleryRoute = ({
  slug,
  projects,
  color,
  opacity,
  emptyStateDescription,
  icon,
}: GalleryDefinition): GalleryRouteConfig => {
  const category = getDeveloperCategory(slug);

  return {
    slug,
    props: {
      projects: processProjectsImages(projects),
      basePath: `/dev/${slug}`,
      title: category.title,
      description: category.description,
      icon: icon ?? category.icon,
      color,
      opacity,
      backLink: DEV_BACK,
      backLinkText: DEV_BACK_TEXT,
      IconFallback: IconCode,
      webProject: true,
      stackIconMap,
      widescreen: true,
      emptyStateDescription,
      dataIdPrefix: slug,
      buildImagePath: (filename) => buildDeveloperImagePath(slug, filename),
    },
  };
};

export const developerGalleries: GalleryRouteConfig[] =
  DEVELOPER_GALLERY_DEFINITIONS.map(createGalleryRoute);
