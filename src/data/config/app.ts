/**
 * Configuración global de la aplicación
 * Sincronizado con vite.config.ts y main.tsx
 */

import { DEVELOPER_CATEGORY_CATALOG, GRAPHIC_DESIGN_CATEGORY_CATALOG } from './categoryCatalog';

// Raíz del dominio (kimografico.com) → base '/' en vite.config.ts y basename '/' en main.tsx.
// NOTA: si vuelves a GitHub Pages (kimografico.github.io/portfolio), cambia a '/portfolio'.
export const APP_BASENAME = '';

/**
 * Rutas base para imágenes de proyectos
 * Los JSON solo contendrán nombres de archivos
 * Los componentes construirán rutas completas concatenando estas bases + nombre de archivo
 */

// Estructura: /portfolio/images/portfolio/design/[category]/[filename]
export const GRAPHIC_DESIGN_IMAGES_BASE = `${APP_BASENAME}/images/portfolio/design`;

// Estructura: /portfolio/images/portfolio/web/[category]/[filename]
export const DEVELOPER_IMAGES_BASE = `${APP_BASENAME}/images/portfolio/web`;

// Mapeo de categorías a subcarpetas, derivado del catálogo único de categorías.
export const GRAPHIC_DESIGN_CATEGORIES = Object.fromEntries(
  GRAPHIC_DESIGN_CATEGORY_CATALOG.map((category) => [category.slug, category.slug]),
) as Record<string, string>;

// Mapeo de categorías a subcarpetas, derivado del catálogo único de categorías.
export const DEVELOPER_CATEGORIES = Object.fromEntries(
  DEVELOPER_CATEGORY_CATALOG.map((category) => [category.slug, category.slug]),
) as Record<string, string>;
