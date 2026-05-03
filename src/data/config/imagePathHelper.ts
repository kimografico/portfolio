/**
 * Helper para procesar rutas de imágenes y reemplazar /portfolio/ con APP_BASENAME
 * Usado en loaders de JSONs de proyectos para mantener coherencia con la configuración
 */

import { APP_BASENAME } from './app';

/**
 * Reemplaza /portfolio/ por APP_BASENAME en una ruta de imagen
 * Ejemplo: /portfolio/images/portfolio/web/... → /portfolio/images/portfolio/web/...
 * (si APP_BASENAME cambia, esto se adapta automáticamente)
 */
export const processImagePath = (ruta: string): string => {
  if (!ruta || typeof ruta !== 'string') return ruta;
  return ruta.replace('/portfolio/', `${APP_BASENAME}/`);
};

/**
 * Procesa un objeto de imagen con propiedades ruta y label
 */
export const processImageObject = (image: { ruta: string; label?: string }) => ({
  ...image,
  ruta: processImagePath(image.ruta),
});

/**
 * Procesa un proyecto (con propiedad imagenes array) para actualizar rutas de imágenes
 */
export const processProjectImages = <
  T extends { imagenes?: Array<{ ruta: string; label?: string }> },
>(
  project: T,
): T => {
  if (!project.imagenes || !Array.isArray(project.imagenes)) {
    return project;
  }

  return {
    ...project,
    imagenes: project.imagenes.map(processImageObject),
  };
};

/**
 * Procesa un array de proyectos para actualizar todas las rutas de imágenes
 */
export const processProjectsImages = <
  T extends { imagenes?: Array<{ ruta: string; label?: string }> },
>(
  projects: T[],
): T[] => {
  if (!Array.isArray(projects)) return projects;
  return projects.map(processProjectImages);
};
