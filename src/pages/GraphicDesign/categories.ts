import { GRAPHIC_DESIGN_CATEGORY_CATALOG } from '../../data/config/categoryCatalog';

export const GRAPHIC_DESIGN_CATEGORIES = GRAPHIC_DESIGN_CATEGORY_CATALOG.map(
  ({ key, title, description, icon }) => ({
    key,
    title,
    description,
    icon,
  }),
);
