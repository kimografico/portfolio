/**
 * DataPageHelpers.ts
 * Lógica centralizada para DataPage: tipos, fuentes de datos, cálculos y filtros.
 */

// --- Importación de todos los JSON ---
import carteleria from '../../data/graphic-design/carteleria.json';
import editorial from '../../data/graphic-design/editorial.json';
import etiquetas from '../../data/graphic-design/etiquetas.json';
import logotipos from '../../data/graphic-design/logotipos.json';
import multimedia from '../../data/graphic-design/multimedia.json';
import packaging from '../../data/graphic-design/packaging.json';
import papeleria from '../../data/graphic-design/papeleria.json';
import proyectosEspeciales from '../../data/graphic-design/proyectos-especiales.json';
import frameworks from '../../data/development/frameworks.json';
import vanilla from '../../data/development/vanilla.json';
import wordpress from '../../data/development/wordpress.json';

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
const SOURCES = [
  // Diseño Gráfico
  { data: carteleria, type: 'Diseño Gráfico', category: 'Cartelería' },
  { data: editorial, type: 'Diseño Gráfico', category: 'Editorial' },
  { data: etiquetas, type: 'Diseño Gráfico', category: 'Etiquetas' },
  { data: logotipos, type: 'Diseño Gráfico', category: 'Logotipos' },
  { data: multimedia, type: 'Diseño Gráfico', category: 'Multimedia' },
  { data: packaging, type: 'Diseño Gráfico', category: 'Packaging' },
  { data: papeleria, type: 'Diseño Gráfico', category: 'Papelería' },
  { data: proyectosEspeciales, type: 'Diseño Gráfico', category: 'Proyectos especiales' },
  // Desarrollo
  { data: frameworks, type: 'Desarrollo', category: 'Frameworks' },
  { data: vanilla, type: 'Desarrollo', category: 'Vanilla' },
  { data: wordpress, type: 'Desarrollo', category: 'WordPress' },
];

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
  const clients = filtered.map((e) => e.cliente).filter(Boolean);
  return Array.from(new Set(clients)).sort();
}

/**
 * Filtra el array de entradas según los filtros activos.
 */
export function applyFilters(entries: DataEntry[], options: FilterOptions): DataEntry[] {
  const { filterVisibility, filterType, filterCategory, filterCliente, localVisibility } = options;

  return entries.filter((e) => {
    // La visibilidad real incluye posibles cambios locales
    const isVisible = e.id in localVisibility ? localVisibility[e.id] : e.visible;
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
