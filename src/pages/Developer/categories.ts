import { DEVELOPER_CATEGORY_CATALOG } from '../../data/config/categoryCatalog';

export const DEVELOPER_CATEGORIES = DEVELOPER_CATEGORY_CATALOG.map(
  ({ key, title, description, icon }) => ({
    key,
    title,
    description,
    icon,
  }),
);
