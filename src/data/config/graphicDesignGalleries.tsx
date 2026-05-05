/**
 * graphicDesignGalleries.tsx
 *
 * Configuración centralizada de todas las galerías de Diseño Gráfico.
 * En lugar de un archivo por categoría, aquí definimos el array de rutas
 * y props que App.tsx usa para generar los <Route> dinámicamente.
 *
 * Para añadir una nueva categoría: añade un objeto a este array.
 */

import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import type { BaseProject } from '../../components/ui/ProjectCard';
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

import { IconPirateCoin } from '../../components/iconos';

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
    /** Función para construir rutas de imágenes completas */
    buildImagePath?: (filename: string) => string;
  };
}

const GD_BACK = '/graphic-design';
const GD_BACK_TEXT = 'Volver a Diseño Gráfico';

export const graphicDesignGalleries: GalleryRouteConfig[] = [
  {
    slug: 'logotipos',
    props: {
      projects: processProjectsImages(logotypesData as GraphicDesignProject[]),
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
      buildImagePath: (filename) => buildGraphicDesignImagePath('logotipos', filename),
    },
  },
  {
    slug: 'papeleria',
    props: {
      projects: processProjectsImages(papeleriaData as GraphicDesignProject[]),
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
      buildImagePath: (filename) => buildGraphicDesignImagePath('papeleria', filename),
    },
  },
  {
    slug: 'carteleria',
    props: {
      projects: processProjectsImages(carteriaData as GraphicDesignProject[]),
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
      buildImagePath: (filename) => buildGraphicDesignImagePath('carteleria', filename),
    },
  },
  {
    slug: 'multimedia',
    props: {
      projects: processProjectsImages(multimediaData as GraphicDesignProject[]),
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
      buildImagePath: (filename) => buildGraphicDesignImagePath('multimedia', filename),
    },
  },
  {
    slug: 'packaging',
    props: {
      projects: processProjectsImages(packagingData as GraphicDesignProject[]),
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
      buildImagePath: (filename) => buildGraphicDesignImagePath('packaging', filename),
    },
  },
  {
    slug: 'proyectos-especiales',
    props: {
      projects: processProjectsImages(OtrosData as GraphicDesignProject[]),
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
      buildImagePath: (filename) => buildGraphicDesignImagePath('proyectos-especiales', filename),
    },
  },
  {
    slug: 'etiquetas',
    props: {
      projects: processProjectsImages(etiquetasData as GraphicDesignProject[]),
      basePath: '/graphic-design/etiquetas',
      title: 'Etiquetas',
      description: 'Diseño de etiquetas, pegatinas y elementos gráficos para packaging y branding.',
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí diseños de etiquetas.',
      dataIdPrefix: 'etiquetas',
      buildImagePath: (filename) => buildGraphicDesignImagePath('etiquetas', filename),
    },
  },
  {
    slug: 'editorial',
    props: {
      projects: processProjectsImages(editorialData as GraphicDesignProject[]),
      basePath: '/graphic-design/editorial',
      title: 'Editorial',
      description: 'Diseño de publicaciones, revistas, libros y materiales editoriales.',
      backLink: GD_BACK,
      backLinkText: GD_BACK_TEXT,
      IconFallback: IconPirateCoin,
      emptyStateDescription:
        'Esta sección está en preparación. Pronto encontrarás aquí diseños editoriales.',
      dataIdPrefix: 'editorial',
      buildImagePath: (filename) => buildGraphicDesignImagePath('editorial', filename),
    },
  },
];
