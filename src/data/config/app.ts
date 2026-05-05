/**
 * Configuración global de la aplicación
 * Sincronizado con vite.config.ts y main.tsx
 */

/** basename de React Router (debe coincidir con vite.config base) */
export const APP_BASENAME = '/portfolio';

/**
 * Rutas base para imágenes de proyectos
 * Los JSON solo contendrán nombres de archivos
 * Los componentes construirán rutas completas concatenando estas bases + nombre de archivo
 */

// Estructura: /portfolio/images/portfolio/design/[category]/[filename]
export const GRAPHIC_DESIGN_IMAGES_BASE = `${APP_BASENAME}/images/portfolio/design`;

// Estructura: /portfolio/images/portfolio/web/[category]/[filename]
export const DEVELOPER_IMAGES_BASE = `${APP_BASENAME}/images/portfolio/web`;

// Mapeo de categorías a subcarpetas de diseño gráfico
export const GRAPHIC_DESIGN_CATEGORIES = {
  logotipos: 'logotipos',
  papeleria: 'papeleria',
  carteleria: 'carteleria',
  multimedia: 'multimedia',
  packaging: 'packaging',
  'proyectos-especiales': 'proyectos-especiales',
  etiquetas: 'etiquetas',
  editorial: 'editorial',
} as const;

// Mapeo de categorías a subcarpetas de desarrollo
export const DEVELOPER_CATEGORIES = {
  vanilla: 'vanilla',
  wordpress: 'wordpress',
  frameworks: 'frameworks',
} as const;
