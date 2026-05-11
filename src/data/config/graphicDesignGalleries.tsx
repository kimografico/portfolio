/**
 * graphicDesignGalleries.tsx
 *
 * Configuración centralizada de todas las galerías de Diseño Gráfico.
 * En lugar de duplicar títulos, descripciones y slugs, reutilizamos el
 * catálogo único de categorías para mantener la navegación sincronizada.
 */

import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import type { BaseProject } from '../../components/ui/ProjectCard';
import type { ComponentType } from 'react';
import type { IconProps } from '../../types/icons';

import logotypesData from '../graphic-design/logotipos.json';
import papeleriaData from '../graphic-design/papeleria.json';
import carteriaData from '../graphic-design/carteleria.json';
import multimediaData from '../graphic-design/multimedia.json';
import packagingData from '../graphic-design/packaging.json';
import OtrosData from '../graphic-design/proyectos-especiales.json';
import etiquetasData from '../graphic-design/etiquetas.json';
import editorialData from '../graphic-design/editorial.json';
import { processProjectsImages, buildGraphicDesignImagePath } from './imagePathHelper';
import { GRAPHIC_DESIGN_CATEGORY_BY_SLUG, type CategoryCatalogEntry } from './categoryCatalog';

import { IconPirateCoin } from '../../components/iconos';

export interface GalleryRouteConfig {
  /** Segmento de URL, ej. "carteleria" → ruta /graphic-design/carteleria */
  slug: string;
  props: {
    projects: BaseProject[];
    basePath: string;
    title: string;
    description: string;
    icon?: ComponentType<{ size: number; strokeWidth: number; className: string }>;
    color?: string;
    opacity?: number;
    backLink?: string;
    backLinkText?: string;
    IconFallback?: ComponentType<IconProps>;
    emptyStateDescription?: string;
    dataIdPrefix?: string;
    webProject?: boolean;
    stackIconMap?: Record<string, ComponentType<IconProps>>;
    /** Si true, usa proporción 16:9 en ProjectCard */
    widescreen?: boolean;
    /** Función para construir rutas de imágenes completas */
    buildImagePath?: (filename: string) => string;
  };
}

const GD_BACK = '/graphic-design';
const GD_BACK_TEXT = 'Volver a Diseño Gráfico';

interface GalleryDefinition {
  slug: string;
  projects: GraphicDesignProject[];
  color?: string;
  opacity?: number;
  emptyStateDescription: string;
}

const GRAPHIC_DESIGN_GALLERY_DEFINITIONS: GalleryDefinition[] = [
  {
    slug: 'logotipos',
    projects: logotypesData as GraphicDesignProject[],
    color: 'purple',
    opacity: 0.1,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los logotipos y diseños de marca.',
  },
  {
    slug: 'papeleria',
    projects: papeleriaData as GraphicDesignProject[],
    color: 'blue',
    opacity: 0.1,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los diseños de papelería.',
  },
  {
    slug: 'carteleria',
    projects: carteriaData as GraphicDesignProject[],
    color: 'red',
    opacity: 0.1,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los diseños de cartelería.',
  },
  {
    slug: 'multimedia',
    projects: multimediaData as GraphicDesignProject[],
    color: 'pink',
    opacity: 0.1,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los proyectos multimedia.',
  },
  {
    slug: 'packaging',
    projects: packagingData as GraphicDesignProject[],
    color: 'amber',
    opacity: 0.1,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los diseños de packaging.',
  },
  {
    slug: 'proyectos-especiales',
    projects: OtrosData as GraphicDesignProject[],
    color: 'indigo',
    opacity: 0.1,
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí los proyectos especiales.',
  },
  {
    slug: 'etiquetas',
    projects: etiquetasData as GraphicDesignProject[],
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí diseños de etiquetas.',
  },
  {
    slug: 'editorial',
    projects: editorialData as GraphicDesignProject[],
    emptyStateDescription:
      'Esta sección está en preparación. Pronto encontrarás aquí diseños editoriales.',
  },
];

const getGraphicDesignCategory = (slug: string): CategoryCatalogEntry => {
  const category = GRAPHIC_DESIGN_CATEGORY_BY_SLUG[slug];

  if (!category) {
    throw new Error(`Categoría de diseño gráfico desconocida: ${slug}`);
  }

  return category;
};

const createGalleryRoute = ({
  slug,
  projects,
  color,
  opacity,
  emptyStateDescription,
}: GalleryDefinition): GalleryRouteConfig => {
  const category = getGraphicDesignCategory(slug);

  return {
    slug,
    props: {
      projects: processProjectsImages(projects),
      basePath: `/graphic-design/${slug}`,
      title: category.title,
      description: category.description,
      icon: category.icon,
      color,
      opacity,
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription,
      dataIdPrefix: slug,
      buildImagePath: (filename) => buildGraphicDesignImagePath(slug, filename),
    },
  };
};

export const graphicDesignGalleries: GalleryRouteConfig[] =
  GRAPHIC_DESIGN_GALLERY_DEFINITIONS.map(createGalleryRoute);
