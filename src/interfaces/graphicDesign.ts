import type { BaseProject } from '../components/ui/ProjectCard';

export interface GraphicDesignProject extends BaseProject {
  cliente: string;
  descripcion: string;
  imagenes: { image: string; label: string }[];
  videos?: { image: string; label: string }[];
  extras?: unknown[];
  [key: string]: unknown;
}
