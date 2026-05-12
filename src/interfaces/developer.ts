export interface DevImage {
  image: string;
  label: string;
}

export interface DevVideo {
  image: string;
  label: string;
}

import type { BaseProject } from '../components/ui/ProjectCard';

export interface WebProject extends BaseProject {
  cliente: string;
  descripcion: string;
  stack: string[];
  imagenes: DevImage[];
  videos: DevVideo[];
  extras: string[];
  [key: string]: unknown;
}
