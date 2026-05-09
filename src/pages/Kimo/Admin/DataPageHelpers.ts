/**
 * DataPageHelpers.ts
 * Lógica centralizada para DataPage: tipos, fuentes de datos, cálculos y filtros.
 */

// --- Importación de todos los JSON ---
import carteleria from '../../../data/graphic-design/carteleria.json';
import editorial from '../../../data/graphic-design/editorial.json';
import etiquetas from '../../../data/graphic-design/etiquetas.json';
import logotipos from '../../../data/graphic-design/logotipos.json';
import multimedia from '../../../data/graphic-design/multimedia.json';
import packaging from '../../../data/graphic-design/packaging.json';
import papeleria from '../../../data/graphic-design/papeleria.json';
import proyectosEspeciales from '../../../data/graphic-design/proyectos-especiales.json';
import frameworks from '../../../data/development/frameworks.json';
import vanilla from '../../../data/development/vanilla.json';
import wordpress from '../../../data/development/wordpress.json';
import { processProjectsImages } from '../../../data/config/imagePathHelper';

/**
 * DataEntry: tipo normalizado para todas las entradas de todos los JSON.
 * Añadimos `type` y `category` para poder filtrar por origen del proyecto.
 */
export interface DataEntry {
  id: number | string;
  date: string;
  title: string;
  cliente: string;
  type: string;
  category: string;
  visible: boolean;
}

/**
 * Entrada preparada para la sección Pendiente.
 * Añade el número de elementos en extras.
 */
export interface PendingEntry extends DataEntry {
  extrasCount: number;
}

/**
 * Interfaz para las opciones de filtro active
 */
export interface FilterOptions {
  filterType: string;
  filterCategory: string;
  filterCliente: string;
  filterVisibility: 'all' | 'visible' | 'hidden';
  localVisibility: Record<string | number, boolean>;
}

/**
 * Definición de las fuentes de datos.
 * Para añadir un nuevo JSON, solo hay que añadir un objeto aquí.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const SOURCES: Array<{ data: any[]; type: string; category: string }> = [
  // Diseño Gráfico
  {
    data: processProjectsImages(carteleria as any[]),
    type: 'Diseño Gráfico',
    category: 'Cartelería',
  },
  {
    data: processProjectsImages(editorial as any[]),
    type: 'Diseño Gráfico',
    category: 'Editorial',
  },
  {
    data: processProjectsImages(etiquetas as any[]),
    type: 'Diseño Gráfico',
    category: 'Etiquetas',
  },
  {
    data: processProjectsImages(logotipos as any[]),
    type: 'Diseño Gráfico',
    category: 'Logotipos',
  },
  {
    data: processProjectsImages(multimedia as any[]),
    type: 'Diseño Gráfico',
    category: 'Multimedia',
  },
  {
    data: processProjectsImages(packaging as any[]),
    type: 'Diseño Gráfico',
    category: 'Packaging',
  },
  {
    data: processProjectsImages(papeleria as any[]),
    type: 'Diseño Gráfico',
    category: 'Papelería',
  },
  {
    data: processProjectsImages(proyectosEspeciales as any[]),
    type: 'Diseño Gráfico',
    category: 'Proyectos especiales',
  },
  // Desarrollo
  { data: processProjectsImages(frameworks as any[]), type: 'Desarrollo', category: 'Frameworks' },
  { data: processProjectsImages(vanilla as any[]), type: 'Desarrollo', category: 'Vanilla' },
  { data: processProjectsImages(wordpress as any[]), type: 'Desarrollo', category: 'WordPress' },
];
/* eslint-enable @typescript-eslint/no-explicit-any */

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

/**
 * Combina todos los JSON en un único array normalizado.
 * Se calcula una sola vez, no necesita recalcularse en cada render.
 */
export const ALL_ENTRIES: DataEntry[] = SOURCES.flatMap(({ data, type, category }) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data as any[]).map((item) => ({
    id: item.id,
    date: item.date ?? '',
    title: item.title ?? '',
    cliente: item.cliente ?? '',
    type,
    category,
    visible: item.visible !== false,
  })),
);

/**
 * Construye la ruta pública de detalle del proyecto según su tipo y categoría.
 */
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

/**
 * Devuelve solo los proyectos que tienen extras no vacío.
 */
export function getPendingEntries(): PendingEntry[] {
  const pendingEntries = SOURCES.flatMap(({ data, type, category }) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any[])
      .filter((item) => item.extras && Array.isArray(item.extras) && item.extras.length > 0)
      .map((item) => ({
        id: item.id,
        date: item.date ?? '',
        title: item.title ?? '',
        cliente: item.cliente ?? '',
        type,
        category,
        visible: item.visible !== false,
        extrasCount: item.extras.length,
      })),
  );

  return pendingEntries.sort((a, b) => {
    const dateComparison = String(b.date).localeCompare(String(a.date));
    if (dateComparison !== 0) return dateComparison;

    const numA = Number(a.id);
    const numB = Number(b.id);
    return isNaN(numA) || isNaN(numB) ? String(a.id).localeCompare(String(b.id)) : numA - numB;
  });
}

/**
 * Obtiene las opciones de categoría disponibles según el tipo seleccionado.
 */
export function getCategoryOptions(filterType: string): string[] {
  const categories = SOURCES.filter((s) => !filterType || s.type === filterType).map(
    (s) => s.category,
  );
  return Array.from(new Set(categories)).sort();
}

/**
 * Obtiene las opciones de cliente disponibles según tipo + categoría.
 */
export function getClienteOptions(filterType: string, filterCategory: string): string[] {
  const filtered = ALL_ENTRIES.filter(
    (e) =>
      (!filterType || e.type === filterType) && (!filterCategory || e.category === filterCategory),
  );
  // Contar ocurrencias de cada cliente
  const count: Record<string, number> = {};
  filtered.forEach((e) => {
    if (e.cliente) count[e.cliente] = (count[e.cliente] || 0) + 1;
  });
  // Clientes frecuentes (más de 1 proyecto)
  const frequent = Object.entries(count)
    .filter(([_, n]) => n > 1)
    .map(([c]) => c)
    .sort();
  // Si hay clientes únicos, añadir 'OTROS'
  if (Object.values(count).some((n) => n === 1)) {
    frequent.push('OTROS');
  }
  return frequent;
}

/**
 * Filtra el array de entradas según los filtros activos.
 */
export function applyFilters(entries: DataEntry[], options: FilterOptions): DataEntry[] {
  const { filterVisibility, filterType, filterCategory, filterCliente, localVisibility } = options;

  return entries.filter((e) => {
    // La visibilidad real incluye posibles cambios locales
    const isVisible = e.id in localVisibility ? localVisibility[e.id] : e.visible;
    // Si el filtro de cliente es 'OTROS', solo mostrar clientes únicos
    if (filterCliente === 'OTROS') {
      // Recalcular el subconjunto filtrado para contar clientes únicos
      const subset = entries.filter(
        (x) =>
          (!filterType || x.type === filterType) &&
          (!filterCategory || x.category === filterCategory),
      );
      const count: Record<string, number> = {};
      subset.forEach((x) => {
        if (x.cliente) count[x.cliente] = (count[x.cliente] || 0) + 1;
      });
      return (
        (filterVisibility === 'all' ||
          (filterVisibility === 'visible' && isVisible) ||
          (filterVisibility === 'hidden' && !isVisible)) &&
        (!filterType || e.type === filterType) &&
        (!filterCategory || e.category === filterCategory) &&
        count[e.cliente] === 1
      );
    }
    // Filtro normal
    return (
      (filterVisibility === 'all' ||
        (filterVisibility === 'visible' && isVisible) ||
        (filterVisibility === 'hidden' && !isVisible)) &&
      (!filterType || e.type === filterType) &&
      (!filterCategory || e.category === filterCategory) &&
      (!filterCliente || e.cliente === filterCliente)
    );
  });
}

/**
 * Calcula los IDs que aparecen más de una vez en el dataset completo.
 */
export function calculateDuplicateIds(entries: DataEntry[] = ALL_ENTRIES): (string | number)[] {
  const idCount: Record<string | number, number> = {};
  entries.forEach((entry) => {
    idCount[entry.id] = (idCount[entry.id] || 0) + 1;
  });
  return Object.entries(idCount)
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort((a, b) => {
      const numA = Number(a);
      const numB = Number(b);
      return isNaN(numA) || isNaN(numB) ? String(a).localeCompare(String(b)) : numA - numB;
    });
}

/**
 * Obtiene los IDs de las entradas que tienen extras no vacío.
 * Busca en los JSON originales para verificar si el array extras existe y no está vacío.
 */
export function getEntriesWithExtras(): (string | number)[] {
  const idsWithExtras: (string | number)[] = [];

  SOURCES.forEach(({ data }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any[]).forEach((item) => {
      if (item.extras && Array.isArray(item.extras) && item.extras.length > 0) {
        idsWithExtras.push(item.id);
      }
    });
  });

  // Ordenar numéricamente
  return idsWithExtras.sort((a, b) => {
    const numA = Number(a);
    const numB = Number(b);
    return isNaN(numA) || isNaN(numB) ? String(a).localeCompare(String(b)) : numA - numB;
  });
}
