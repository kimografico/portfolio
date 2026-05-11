import type { DataEntry } from '../../../../interfaces/adminData';
import {
  DEVELOPER_CATEGORY_BY_ADMIN_LABEL,
  GRAPHIC_DESIGN_CATEGORY_BY_ADMIN_LABEL,
} from '../../../../data/config/categoryCatalog';

export function buildProjectDetailPath(
  entry: Pick<DataEntry, 'type' | 'category' | 'id'>,
): string | null {
  if (entry.type === 'Desarrollo') {
    const parent = DEVELOPER_CATEGORY_BY_ADMIN_LABEL[entry.category];

    return parent ? `/dev/${parent}/${entry.id}` : null;
  }

  if (entry.type === 'Diseño Gráfico') {
    const category = GRAPHIC_DESIGN_CATEGORY_BY_ADMIN_LABEL[entry.category];

    return category ? `/graphic-design/${category}/${entry.id}` : null;
  }

  return null;
}
