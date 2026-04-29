import { useMemo, useState } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../components/compositions/BaseTable';
import { useShowHidden } from '../../hooks/useShowHidden';

// --- Importación de todos los JSON de diseño gráfico y desarrollo ---
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
interface DataEntry {
  id: number | string;
  date: string;
  title: string;
  cliente: string;
  type: string;
  category: string;
  visible: boolean;
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
  { data: vanilla, type: 'Desarrollo', category: 'Vanilla JS' },
  { data: wordpress, type: 'Desarrollo', category: 'WordPress' },
];

/**
 * Combina todos los JSON en un único array normalizado.
 * Se hace fuera del componente para que no se recalcule en cada render.
 */
const ALL_ENTRIES: DataEntry[] = SOURCES.flatMap(({ data, type, category }) =>
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

// --- Columnas de la tabla ---
const columnHelper = createColumnHelper<DataEntry>();

const columns: ColumnDef<DataEntry, string>[] = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => <span className="text-muted text-sm">{String(info.getValue())}</span>,
  }),
  columnHelper.accessor('title', {
    header: 'Título',
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
  }),
  columnHelper.accessor('cliente', {
    header: 'Cliente',
    cell: (info) => info.getValue() || <span className="text-muted">—</span>,
  }),
  columnHelper.accessor('date', {
    header: 'Fecha',
    cell: (info) => {
      // Las fechas vienen como "YYYY-MM-DD HH:MM", mostramos solo la parte de fecha
      const raw = info.getValue();
      return raw ? raw.slice(0, 10) : <span className="text-muted">—</span>;
    },
  }),
  columnHelper.accessor('type', {
    header: 'Tipo',
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor('category', {
    header: 'Categoría',
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
  }),
];

/**
 * DataPage
 *
 * Página del espacio personal que centraliza todos los proyectos de diseño
 * gráfico y desarrollo en una única tabla filtrable y ordenable.
 *
 * Filtros disponibles:
 * - Tipo: "Diseño Gráfico" | "Desarrollo" (selector exclusivo)
 * - Categoría: subcategoría del tipo seleccionado
 * - Cliente: clientes únicos del subconjunto filtrado
 */
// Opciones del filtro de visibilidad de la tabla
type VisibilityFilter = 'all' | 'visible' | 'hidden';

export default function DataPage() {
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<VisibilityFilter>('all');
  // showHidden controla la galería (persiste en localStorage); no afecta a esta tabla
  const [showHidden, setShowHidden] = useShowHidden();

  // Opciones de categoría: dependen del tipo seleccionado
  const categoryOptions = useMemo(() => {
    const categories = SOURCES.filter((s) => !filterType || s.type === filterType).map(
      (s) => s.category,
    );
    return Array.from(new Set(categories)).sort();
  }, [filterType]);

  // Opciones de cliente: dependen del tipo + categoría seleccionados
  const clienteOptions = useMemo(() => {
    const filtered = ALL_ENTRIES.filter(
      (e) =>
        (!filterType || e.type === filterType) &&
        (!filterCategory || e.category === filterCategory),
    );
    const clients = filtered.map((e) => e.cliente).filter(Boolean);
    return Array.from(new Set(clients)).sort();
  }, [filterType, filterCategory]);

  // Datos finales tras aplicar todos los filtros
  const filteredEntries = useMemo(() => {
    return ALL_ENTRIES.filter(
      (e) =>
        (filterVisibility === 'all' ||
          (filterVisibility === 'visible' && e.visible) ||
          (filterVisibility === 'hidden' && !e.visible)) &&
        (!filterType || e.type === filterType) &&
        (!filterCategory || e.category === filterCategory) &&
        (!filterCliente || e.cliente === filterCliente),
    );
  }, [filterVisibility, filterType, filterCategory, filterCliente]);

  // Calcular IDs duplicados en todo el dataset (no solo filtrados)
  const duplicateIds = useMemo(() => {
    const idCount: Record<string | number, number> = {};
    ALL_ENTRIES.forEach((entry) => {
      idCount[entry.id] = (idCount[entry.id] || 0) + 1;
    });
    return Object.entries(idCount)
      .filter(([, count]) => count > 1)
      .map(([id]) => id)
      .sort((a, b) => {
        // Ordenar numéricamente si son números
        const numA = Number(a);
        const numB = Number(b);
        return isNaN(numA) || isNaN(numB) ? String(a).localeCompare(String(b)) : numA - numB;
      });
  }, []);

  // Si cambia el tipo, resetear categoría y cliente
  function handleTypeChange(value: string) {
    setFilterType(value);
    setFilterCategory('');
    setFilterCliente('');
  }

  const hasActiveFilters =
    filterType || filterCategory || filterCliente || filterVisibility !== 'all';

  // Si cambia la categoría, resetear cliente
  function handleCategoryChange(value: string) {
    setFilterCategory(value);
    setFilterCliente('');
  }

  return (
    <section data-id="data-page">
      <div className="flex items-center mb-8 gap-4">
        <h2 className="text-xl flex-1">
          Todos los proyectos{' '}
          <span className="text-muted text-base font-normal">({filteredEntries.length})</span>
        </h2>
        {/* Toggle privado para la visibilidad en las GALERÍAS (no afecta a esta tabla) */}
        <button
          onClick={() => setShowHidden(!showHidden)}
          className={`text-xs px-3 py-1 rounded border transition-colors ${
            showHidden
              ? 'bg-amber-100 border-amber-400 text-amber-700'
              : 'border-gray-300 text-muted hover:border-gray-400'
          }`}
          data-id="data-show-hidden-btn"
          title={showHidden ? 'Galerías: mostrando todos' : 'Galerías: solo visibles'}
        >
          {showHidden ? '🖼 Galerías: todos' : '🖼 Galerías: visibles'}
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8 items-end" data-id="data-filter">
        {/* Filtro Tipo */}
        <div className="flex flex-col min-w-[12rem]">
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-type">
            Tipo
          </label>
          <select
            id="filter-type"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            value={filterType}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Diseño Gráfico">Diseño Gráfico</option>
            <option value="Desarrollo">Desarrollo</option>
          </select>
        </div>

        {/* Filtro Categoría */}
        <div className="flex flex-col min-w-[12rem]">
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-category">
            Categoría
          </label>
          <select
            id="filter-category"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            value={filterCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Todas</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Cliente */}
        <div className="flex flex-col min-w-[12rem]">
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-cliente">
            Cliente
          </label>
          <select
            id="filter-cliente"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            value={filterCliente}
            onChange={(e) => setFilterCliente(e.target.value)}
          >
            <option value="">Todos</option>
            {clienteOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Visibilidad */}
        <div className="flex flex-col min-w-[10rem]">
          <label
            className="block text-xs font-semibold text-muted mb-1"
            htmlFor="filter-visibility"
          >
            Visibilidad
          </label>
          <select
            id="filter-visibility"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value as VisibilityFilter)}
          >
            <option value="all">Todos</option>
            <option value="visible">Solo visibles</option>
            <option value="hidden">Solo ocultos</option>
          </select>
        </div>

        {/* Botón de reset */}
        {hasActiveFilters && (
          <button
            className="text-sm text-muted underline self-end pb-[5px] hover:text-accent transition-colors"
            onClick={() => {
              setFilterType('');
              setFilterCategory('');
              setFilterCliente('');
              setFilterVisibility('all');
            }}
            data-id="data-filter-reset-btn"
          >
            Limpiar filtros
          </button>
        )}

        {/* Duplicados */}
        <div className="ml-auto self-end pb-[5px] text-sm text-muted" data-id="data-duplicates">
          Duplicados:{' '}
          {duplicateIds.length === 0 ? (
            <span className="font-semibold">NINGUNO 👍</span>
          ) : (
            <span className="font-mono">{duplicateIds.join(', ')}</span>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div data-id="data-table">
        <BaseTable<DataEntry, string>
          data={filteredEntries}
          columns={columns}
          initialSorting={[{ id: 'date', desc: true }]}
          emptyMessage="No hay proyectos que coincidan con los filtros."
        />
      </div>
    </section>
  );
}
