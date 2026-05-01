/**
 * graphicDesignGalleries.tsx
 *
 * Configuración centralizada de todas las galerías de Diseño Gráfico.
 * En lugar de un archivo por categoría, aquí definimos el array de rutas
 * y props que App.tsx usa para generar los <Route> dinámicamente.
 *
 * Para añadir una nueva categoría: añade un objeto a este array.
 */

import type { GraphicDesignProject } from '../interfaces/graphicDesign';
import type { BaseProject } from '../components/ui/ProjectCard';
import type { IconProps } from '../types/icons';

import logotypesData from '../data/graphic-design/logotipos.json';
import papeleriaData from '../data/graphic-design/papeleria.json';
import carteriaData from '../data/graphic-design/carteleria.json';
import multimediaData from '../data/graphic-design/multimedia.json';
import packagingData from '../data/graphic-design/packaging.json';
import OtrosData from '../data/graphic-design/proyectos-especiales.json';
import etiquetasData from '../data/graphic-design/etiquetas.json';
import editorialData from '../data/graphic-design/editorial.json';

import { IconPirateCoin } from '../components/iconos';

export interface GalleryRouteConfig {
  /** Segmento de URL, ej. "carteleria" → ruta /graphic-design/carteleria */
  slug: string;
  props: {
    projects: BaseProject[];
    basePath: string;
    title: string;
    description: string;
    icon?: React.FC<IconProps>;
    color?: string;
    opacity?: number;
    backLink?: string;
    backLinkText?: string;
    IconFallback?: React.FC<IconProps>;
    emptyStateDescription?: string;
    dataIdPrefix?: string;
    webProject?: boolean;
    stackIconMap?: Record<string, React.FC<IconProps>>;
    /** Si true, usa proporción 16:9 en ProjectCard */
    widescreen?: boolean;
  };
}

const GD_BACK = '/graphic-design';
const GD_BACK_TEXT = 'Volver a Diseño Gráfico';

export const graphicDesignGalleries: GalleryRouteConfig[] = [
  {
    slug: 'logotipos',
    props: {
      projects: logotypesData as GraphicDesignProject[],
      basePath: '/graphic-design/logotipos',
      title: 'Logotipos',
      description: 'Diseño de logotipos e identidades visuales para empresas y proyectos.',
      color: 'purple',
      opacity: 0.1,
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los logotipos y diseños de marca.',
      dataIdPrefix: 'logotipos',
    },
  },
  {
    slug: 'papeleria',
    props: {
      projects: papeleriaData as GraphicDesignProject[],
      basePath: '/graphic-design/papeleria',
      title: 'Papelería',
      description: 'Diseño de papelería corporativa, trípticos, flyers y material impreso.',
      color: 'blue',
      opacity: 0.1,
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los diseños de papelería.',
      dataIdPrefix: 'papeleria',
    },
  },
  {
    slug: 'carteleria',
    props: {
      projects: carteriaData as GraphicDesignProject[],
      basePath: '/graphic-design/carteleria',
      title: 'Cartelería',
      description: 'Diseño de carteles, señalética y material publicitario exterior.',
      color: 'red',
      opacity: 0.1,
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los diseños de cartelería.',
      dataIdPrefix: 'carteleria',
    },
  },
  {
    slug: 'multimedia',
    props: {
      projects: multimediaData as GraphicDesignProject[],
      basePath: '/graphic-design/multimedia',
      title: 'Multimedia',
      description: 'Contenido multimedia, animaciones, vídeos y efectos visuales.',
      color: 'pink',
      opacity: 0.1,
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los proyectos multimedia.',
      dataIdPrefix: 'multimedia',
    },
  },
  {
    slug: 'packaging',
    props: {
      projects: packagingData as GraphicDesignProject[],
      basePath: '/graphic-design/packaging',
      title: 'Packaging',
      description: 'Diseño de empaques, cajas y etiquetas para productos.',
      color: 'amber',
      opacity: 0.1,
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los diseños de packaging.',
      dataIdPrefix: 'packaging',
    },
  },
  {
    slug: 'proyectos-especiales',
    props: {
      projects: OtrosData as GraphicDesignProject[],
      basePath: '/graphic-design/proyectos-especiales',
      title: 'Proyectos especiales',
      description: 'Proyectos gráficos singulares, personalizados o fuera de categoría.',
      color: 'indigo',
      opacity: 0.1,
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí los proyectos especiales.',
      dataIdPrefix: 'proyectos-especiales',
    },
  },
  {
    slug: 'etiquetas',
    props: {
      projects: etiquetasData as GraphicDesignProject[],
      basePath: '/graphic-design/etiquetas',
      title: 'Etiquetas',
      description: 'Diseño de etiquetas, pegatinas y elementos gráficos para packaging y branding.',
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí diseños de etiquetas.',
      dataIdPrefix: 'etiquetas',
    },
  },
  {
    slug: 'editorial',
    props: {
      projects: editorialData as GraphicDesignProject[],
      basePath: '/graphic-design/editorial',
      title: 'Editorial',
      description: 'Diseño de publicaciones, revistas, libros y materiales editoriales.',
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí diseños editoriales.',
      dataIdPrefix: 'editorial',
    },
  },
];
