import {
  IconPen,
  IconFlyer,
  IconPoster,
  IconLaptop,
  IconBox,
  IconBottle,
  IconBook,
  IconImage,
} from '../../components/iconos';
import type { ComponentType } from 'react';

export interface Category {
  key: string;
  title: string;
  description: string;
  icon: ComponentType<{ size: number; strokeWidth: number; className: string }>;
}

export const GRAPHIC_DESIGN_CATEGORIES: Category[] = [
  {
    key: 'logotipos',
    title: 'Branding & Logotipos',
    description: 'Identidad visual, logotipos y sistemas de marca.',
    icon: IconPen,
  },
  {
    key: 'editorial',
    title: 'Editorial',
    description: 'Diseño de publicaciones, revistas y materiales editoriales.',
    icon: IconBook,
  },
  {
    key: 'etiquetas',
    title: 'Etiquetas',
    description: 'Diseño de etiquetas, pegatinas y elementos gráficos para packaging.',
    icon: IconBottle,
  },
  {
    key: 'papeleria',
    title: 'Papelería Corporativa',
    description: 'Tarjetas, sobres, carpetas y material corporativo.',
    icon: IconFlyer,
  },
  {
    key: 'carteleria',
    title: 'Cartelería',
    description: 'Posters, flyers y material promocional.',
    icon: IconPoster,
  },
  {
    key: 'packaging',
    title: 'Packaging',
    description: 'Envases, etiquetas y diseño de producto.',
    icon: IconBox,
  },
  {
    key: 'multimedia',
    title: 'Digital & Multimedia',
    description: 'Diseño para vídeo, web y presentaciones.',
    icon: IconLaptop,
  },
  {
    key: 'proyectos-especiales',
    title: 'Proyectos especiales',
    description: 'Proyectos gráficos singulares, personalizados o fuera de categoría.',
    icon: IconImage,
  },
];
