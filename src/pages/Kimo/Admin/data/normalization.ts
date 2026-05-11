import carteleria from '../../../../data/graphic-design/carteleria.json';
import editorial from '../../../../data/graphic-design/editorial.json';
import etiquetas from '../../../../data/graphic-design/etiquetas.json';
import logotipos from '../../../../data/graphic-design/logotipos.json';
import multimedia from '../../../../data/graphic-design/multimedia.json';
import packaging from '../../../../data/graphic-design/packaging.json';
import papeleria from '../../../../data/graphic-design/papeleria.json';
import proyectosEspeciales from '../../../../data/graphic-design/proyectos-especiales.json';
import frameworks from '../../../../data/development/frameworks.json';
import vanilla from '../../../../data/development/vanilla.json';
import wordpress from '../../../../data/development/wordpress.json';
import { processProjectsImages } from '../../../../data/config/imagePathHelper';
import type {
  AdminDataSource,
  AdminEntryId,
  AdminSourceEntry,
  DataEntry,
  PendingEntry,
} from '../../../../interfaces/adminData';

const toAdminEntries = (
  items: AdminSourceEntry[],
  type: AdminDataSource['type'],
  category: string,
) =>
  processProjectsImages(items).map((item) => ({
    id: item.id,
    date: item.date ?? '',
    title: item.title ?? '',
    cliente: item.cliente ?? '',
    type,
    category,
    visible: item.visible !== false,
  }));

export const DATA_SOURCES: ReadonlyArray<AdminDataSource> = [
  // Diseño Gráfico
  {
    data: carteleria as AdminSourceEntry[],
    type: 'Diseño Gráfico',
    category: 'Cartelería',
  },
  {
    data: editorial as AdminSourceEntry[],
    type: 'Diseño Gráfico',
    category: 'Editorial',
  },
  {
    data: etiquetas as AdminSourceEntry[],
    type: 'Diseño Gráfico',
    category: 'Etiquetas',
  },
  {
    data: logotipos as AdminSourceEntry[],
    type: 'Diseño Gráfico',
    category: 'Logotipos',
  },
  {
    data: multimedia as AdminSourceEntry[],
    type: 'Diseño Gráfico',
    category: 'Multimedia',
  },
  {
    data: packaging as AdminSourceEntry[],
    type: 'Diseño Gráfico',
    category: 'Packaging',
  },
  {
    data: papeleria as AdminSourceEntry[],
    type: 'Diseño Gráfico',
    category: 'Papelería',
  },
  {
    data: proyectosEspeciales as AdminSourceEntry[],
    type: 'Diseño Gráfico',
    category: 'Proyectos especiales',
  },
  // Desarrollo
  {
    data: frameworks as AdminSourceEntry[],
    type: 'Desarrollo',
    category: 'Frameworks',
  },
  {
    data: vanilla as AdminSourceEntry[],
    type: 'Desarrollo',
    category: 'Vanilla',
  },
  {
    data: wordpress as AdminSourceEntry[],
    type: 'Desarrollo',
    category: 'WordPress',
  },
];

export const ALL_ENTRIES: DataEntry[] = DATA_SOURCES.flatMap(({ data, type, category }) =>
  toAdminEntries(data, type, category),
);

const compareEntryIds = (left: AdminEntryId, right: AdminEntryId): number => {
  const numericLeft = Number(left);
  const numericRight = Number(right);

  if (Number.isNaN(numericLeft) || Number.isNaN(numericRight)) {
    return String(left).localeCompare(String(right));
  }

  return numericLeft - numericRight;
};

export function getPendingEntries(): PendingEntry[] {
  const pendingEntries = DATA_SOURCES.flatMap(({ data, type, category }) =>
    data
      .filter((item) => Array.isArray(item.extras) && item.extras.length > 0)
      .map((item) => ({
        id: item.id,
        date: item.date ?? '',
        title: item.title ?? '',
        cliente: item.cliente ?? '',
        type,
        category,
        visible: item.visible !== false,
        extrasCount: item.extras?.length ?? 0,
        extras: item.extras ?? [],
      })),
  );

  return pendingEntries.sort((left, right) => {
    const dateComparison = String(right.date).localeCompare(String(left.date));
    if (dateComparison !== 0) {
      return dateComparison;
    }

    return compareEntryIds(left.id, right.id);
  });
}

export function getEntriesWithExtras(): AdminEntryId[] {
  const idsWithExtras = DATA_SOURCES.flatMap(({ data }) =>
    data
      .filter((item) => Array.isArray(item.extras) && item.extras.length > 0)
      .map((item) => item.id),
  );

  return idsWithExtras.sort(compareEntryIds);
}
