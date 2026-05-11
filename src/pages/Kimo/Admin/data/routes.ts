import type { DataEntry } from '../../../../interfaces/adminData';

const GRAPHIC_DESIGN_DETAIL_SLUGS: Record<string, string> = {
  Cartelería: 'carteleria',
  Editorial: 'editorial',
  Etiquetas: 'etiquetas',
  Logotipos: 'logotipos',
  Multimedia: 'multimedia',
  Packaging: 'packaging',
  Papelería: 'papeleria',
  'Proyectos especiales': 'proyectos-especiales',
};

const DEVELOPMENT_DETAIL_SLUGS: Record<string, string> = {
  Frameworks: 'frameworks',
  Vanilla: 'vanilla',
  WordPress: 'wordpress',
};

export function buildProjectDetailPath(
  entry: Pick<DataEntry, 'type' | 'category' | 'id'>,
): string | null {
  if (entry.type === 'Desarrollo') {
    const parent = DEVELOPMENT_DETAIL_SLUGS[entry.category];

    return parent ? `/dev/${parent}/${entry.id}` : null;
  }

  if (entry.type === 'Diseño Gráfico') {
    const category = GRAPHIC_DESIGN_DETAIL_SLUGS[entry.category];

    return category ? `/graphic-design/${category}/${entry.id}` : null;
  }

  return null;
}
