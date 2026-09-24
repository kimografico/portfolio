/**
 * Helper para procesar rutas de imágenes y construir rutas completas
 *
 * Los JSON de proyectos ahora solo contienen nombres de archivos.
 * Los componentes construyen rutas completas usando estas funciones.
 */

import {
  resolveAssetPath,
  GRAPHIC_DESIGN_IMAGES_BASE,
  DEVELOPER_IMAGES_BASE,
  GRAPHIC_DESIGN_CATEGORIES,
  DEVELOPER_CATEGORIES,
} from './app';

/**
 * Normaliza una ruta de imagen al contexto de desplegado actual.
 * Elimina el prefijo '/portfolio/' (legado de la era GitHub Pages) y luego
 * resuelve con el basename activo, de modo que cualquier dato —con o sin
 * prefijo— funcione en la raíz y en subcarpeta sin tocarlo.
 */
export const processImagePath = (ruta: string): string => {
  if (!ruta || typeof ruta !== 'string') return ruta;
  const sinPrefijo = ruta.replace(/^\/portfolio\//, '/');
  return resolveAssetPath(sinPrefijo);
};

/**
 * Construye la ruta completa de una imagen de diseño gráfico
 * @param category - Categoría del proyecto (logotipos, packaging, etc)
 * @param filename - Solo nombre del archivo (ej: "logo-123.jpg" sin la ruta base)
 * @returns Ruta completa para usar en <img src>
 */
export const buildGraphicDesignImagePath = (
  category: keyof typeof GRAPHIC_DESIGN_CATEGORIES | string,
  filename: string,
): string => {
  if (!filename) return '';
  const categoryFolder =
    GRAPHIC_DESIGN_CATEGORIES[category as keyof typeof GRAPHIC_DESIGN_CATEGORIES] || category;
  return `${GRAPHIC_DESIGN_IMAGES_BASE}/${categoryFolder}/${filename}`;
};

/**
 * Construye la ruta completa de una imagen de proyecto de desarrollo
 * @param category - Categoría del proyecto (vanilla, wordpress, frameworks)
 * @param filename - Solo nombre del archivo
 * @returns Ruta completa para usar en <img src>
 */
export const buildDeveloperImagePath = (
  category: keyof typeof DEVELOPER_CATEGORIES | string,
  filename: string,
): string => {
  if (!filename) return '';
  const categoryFolder =
    DEVELOPER_CATEGORIES[category as keyof typeof DEVELOPER_CATEGORIES] || category;
  return `${DEVELOPER_IMAGES_BASE}/${categoryFolder}/${filename}`;
};

/**
 * Procesa un objeto de imagen con propiedades ruta y label
 * Normaliza rutas de imagen al basename activo
 */
export const processImageObject = (image: { image: string; label?: string }) => ({
  ...image,
  image: processImagePath(image.image),
});

/**
 * Procesa un proyecto (con propiedad imagenes array) para actualizar rutas de imágenes
 * Usado para compatibilidad con JSON antiguos que tenían rutas hardcodeadas
 */
export const processProjectImages = <
  T extends { imagenes?: Array<{ image: string; label?: string }> },
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
 * Usado para compatibilidad con JSON antiguos que tenían rutas hardcodeadas
 */
export const processProjectsImages = <
  T extends { imagenes?: Array<{ image: string; label?: string }> },
>(
  projects: T[],
): T[] => {
  if (!Array.isArray(projects)) return projects;
  return projects.map(processProjectImages);
};
