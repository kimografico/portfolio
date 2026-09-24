/**
 * Configuración global de la aplicación
 *
 * Fuente única de verdad para el base path:
 * «APP_BASENAME» se deriva automáticamente de `import.meta.env.BASE_URL`,
 * que Vite inyecta a partir del `base` de `vite.config.ts`. Así, al cambiar
 * el `base` (p. ej. de '/' a '/portfolio/') toda la app se adapta sola.
 */

import { DEVELOPER_CATEGORY_CATALOG, GRAPHIC_DESIGN_CATEGORY_CATALOG } from './categoryCatalog';

/**
 * Basename de la app ('' en la raíz del dominio, '/portfolio' en GitHub Pages).
 * Derivado del `base` de Vite: '/portfolio/' → '/portfolio', '/' → ''.
 */
export const APP_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Rutas base de imágenes. Los JSON guardan SOLO nombres de archivo (o rutas
 * relativas a la raíz del sitio) y los componentes construyen la URL completa
 * con estas constantes. Nunca debe hardcodearse un prefijo en datos o UI.
 */
export const PORTFOLIO_IMAGES_BASE = `${APP_BASENAME}/images/portfolio`;
export const GRAPHIC_DESIGN_IMAGES_BASE = `${PORTFOLIO_IMAGES_BASE}/design`;
export const DEVELOPER_IMAGES_BASE = `${PORTFOLIO_IMAGES_BASE}/web`;
export const THUMBS_BASE = `${PORTFOLIO_IMAGES_BASE}/thumbs`;
export const NO_COVER_PATH = `${PORTFOLIO_IMAGES_BASE}/no-cover.jpg`;
export const CLIENTS_BASE = `${APP_BASENAME}/images/clients`;

/**
 * Resuelve una ruta de asset a una URL utilizable por el navegador en el
 * contexto de desplegado actual:
 * - URLs absolutas, blob:, data: y anclas → se devuelven tal cual.
 * - Rutas que ya incluyen el basename actual → se devuelven tal cual.
 * - Rutas relativas a la raíz ('/images/...') → se les antepone el basename
 *   si la app no se sirve desde la raíz.
 */
export const resolveAssetPath = (ruta: string, basename: string = APP_BASENAME): string => {
  if (!ruta) return ruta;
  if (/^(https?:|data:|blob:|#)/i.test(ruta)) return ruta;
  if (!basename) return ruta;
  if (ruta === basename || ruta.startsWith(`${basename}/`)) return ruta;
  return `${basename}${ruta}`;
};

// Mapeo de categorías a subcarpetas, derivado del catálogo único de categorías.
export const GRAPHIC_DESIGN_CATEGORIES = Object.fromEntries(
  GRAPHIC_DESIGN_CATEGORY_CATALOG.map((category) => [category.slug, category.slug]),
) as Record<string, string>;

// Mapeo de categorías a subcarpetas, derivado del catálogo único de categorías.
export const DEVELOPER_CATEGORIES = Object.fromEntries(
  DEVELOPER_CATEGORY_CATALOG.map((category) => [category.slug, category.slug]),
) as Record<string, string>;
