import { IconCode, IconReact, IconWP } from '../../components/iconos';
import type { ComponentType } from 'react';

export interface Category {
  key: string;
  title: string;
  description: string;
  icon: ComponentType<{ size: number; strokeWidth: number; className: string }>;
}

export const DEVELOPER_CATEGORIES: Category[] = [
  {
    key: 'wordpress',
    title: 'WordPress',
    description: 'Webs con CMS WordPress: catálogos, tiendas online y portfolios.',
    icon: IconWP,
  },
  {
    key: 'vanilla',
    title: 'Vanilla',
    description: 'Webs con HTML, CSS y JavaScript puro, sin frameworks.',
    icon: IconCode,
  },
  {
    key: 'frameworks',
    title: 'Frameworks',
    description: 'Proyectos con React, Vue u otros frameworks modernos.',
    icon: IconReact,
  },
];
