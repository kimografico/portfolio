import type { ComponentType } from 'react';
import {
  IconBook,
  IconBottle,
  IconBox,
  IconCode,
  IconFlyer,
  IconImage,
  IconLaptop,
  IconPen,
  IconPoster,
  IconReact,
  IconWP,
} from '../../components/iconos';

export type CategorySection = 'graphic-design' | 'developer';

export interface CategoryCatalogEntry {
  key: string;
  slug: string;
  title: string;
  description: string;
  icon: ComponentType<{ size: number; strokeWidth: number; className: string }>;
  adminType: 'Diseño Gráfico' | 'Desarrollo';
  adminLabel: string;
}

export const GRAPHIC_DESIGN_CATEGORY_CATALOG: CategoryCatalogEntry[] = [
  {
    key: 'logotipos',
    slug: 'logotipos',
    title: 'Branding & Logotipos',
    description: 'Identidad visual, logotipos y sistemas de marca.',
    icon: IconPen,
    adminType: 'Diseño Gráfico',
    adminLabel: 'Logotipos',
  },
  {
    key: 'editorial',
    slug: 'editorial',
    title: 'Editorial',
    description: 'Diseño de publicaciones, revistas y materiales editoriales.',
    icon: IconBook,
    adminType: 'Diseño Gráfico',
    adminLabel: 'Editorial',
  },
  {
    key: 'etiquetas',
    slug: 'etiquetas',
    title: 'Etiquetas',
    description: 'Diseño de etiquetas, pegatinas y elementos gráficos para packaging.',
    icon: IconBottle,
    adminType: 'Diseño Gráfico',
    adminLabel: 'Etiquetas',
  },
  {
    key: 'papeleria',
    slug: 'papeleria',
    title: 'Papelería Corporativa',
    description: 'Tarjetas, sobres, carpetas y material corporativo.',
    icon: IconFlyer,
    adminType: 'Diseño Gráfico',
    adminLabel: 'Papelería',
  },
  {
    key: 'carteleria',
    slug: 'carteleria',
    title: 'Cartelería',
    description: 'Posters, flyers y material promocional.',
    icon: IconPoster,
    adminType: 'Diseño Gráfico',
    adminLabel: 'Cartelería',
  },
  {
    key: 'packaging',
    slug: 'packaging',
    title: 'Packaging',
    description: 'Envases, etiquetas y diseño de producto.',
    icon: IconBox,
    adminType: 'Diseño Gráfico',
    adminLabel: 'Packaging',
  },
  {
    key: 'multimedia',
    slug: 'multimedia',
    title: 'Digital & Multimedia',
    description: 'Diseño para vídeo, web y presentaciones.',
    icon: IconLaptop,
    adminType: 'Diseño Gráfico',
    adminLabel: 'Multimedia',
  },
  {
    key: 'proyectos-especiales',
    slug: 'proyectos-especiales',
    title: 'Proyectos especiales',
    description: 'Proyectos gráficos singulares, personalizados o fuera de categoría.',
    icon: IconImage,
    adminType: 'Diseño Gráfico',
    adminLabel: 'Proyectos especiales',
  },
];

export const DEVELOPER_CATEGORY_CATALOG: CategoryCatalogEntry[] = [
  {
    key: 'wordpress',
    slug: 'wordpress',
    title: 'WordPress',
    description: 'Webs con CMS WordPress: catálogos, tiendas online y portfolios.',
    icon: IconWP,
    adminType: 'Desarrollo',
    adminLabel: 'WordPress',
  },
  {
    key: 'vanilla',
    slug: 'vanilla',
    title: 'Vanilla',
    description: 'Webs con HTML, CSS y JavaScript puro, sin frameworks.',
    icon: IconCode,
    adminType: 'Desarrollo',
    adminLabel: 'Vanilla',
  },
  {
    key: 'frameworks',
    slug: 'frameworks',
    title: 'Frameworks',
    description: 'Proyectos con React, Vue u otros frameworks modernos.',
    icon: IconReact,
    adminType: 'Desarrollo',
    adminLabel: 'Frameworks',
  },
];

export const GRAPHIC_DESIGN_CATEGORY_BY_SLUG = Object.fromEntries(
  GRAPHIC_DESIGN_CATEGORY_CATALOG.map((category) => [category.slug, category]),
) as Record<string, CategoryCatalogEntry>;

export const DEVELOPER_CATEGORY_BY_SLUG = Object.fromEntries(
  DEVELOPER_CATEGORY_CATALOG.map((category) => [category.slug, category]),
) as Record<string, CategoryCatalogEntry>;

export const GRAPHIC_DESIGN_CATEGORY_BY_ADMIN_LABEL = Object.fromEntries(
  GRAPHIC_DESIGN_CATEGORY_CATALOG.map((category) => [category.adminLabel, category.slug]),
) as Record<string, string>;

export const DEVELOPER_CATEGORY_BY_ADMIN_LABEL = Object.fromEntries(
  DEVELOPER_CATEGORY_CATALOG.map((category) => [category.adminLabel, category.slug]),
) as Record<string, string>;
