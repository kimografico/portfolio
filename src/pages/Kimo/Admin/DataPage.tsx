import { useCallback, useMemo, useState } from 'react';
import UIButton from '../../../components/ui/UIButton';
import IconVisible from '../../../components/iconos/IconVisible';
import IconHidden from '../../../components/iconos/IconHidden';
import { useNavigate } from 'react-router-dom';
import { useBackendStatus } from '../../../contexts/BackendStatusContext';
import RecentWorksManagerPage from './RecentWorksManagerPage';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../../components/compositions/BaseTable';
import { useShowHidden } from '../../../hooks/useShowHidden';
import { updateVisibilityBatch, deleteProjectsBatch } from '../../../api/apiClient';
import { APP_BASENAME } from '../../../data/config/app';
import { ALL_ENTRIES } from './data/normalization';
import type { DataEntry } from '../../../interfaces/adminData';
import {
  applyFilters as applyDataFilters,
  getCategoryOptions as getAdminCategoryOptions,
  getClienteOptions as getAdminClienteOptions,
} from './data/filters';
import { calculateDuplicateIds as calculateAdminDuplicateIds } from './data/duplicates';
import DataActionBar from '../../../components/compositions/DataActionBar';
import CarouselManager from '../../../components/compositions/CarouselManager';

// Necesario para crear columnas tipadas
const columnHelper = createColumnHelper<DataEntry>();

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
 * - Visibilidad: todos / solo visibles / solo ocultos
 *
 * Selección de filas:
 * - Checkbox en cada fila para seleccionarla
 * - Barra de acciones al seleccionar: marcar visible/oculto
 * - Los cambios se aplican vía API y se reflejan inmediatamente en la tabla
 *   (sin necesidad de recargar la página)
 */
// Opciones del filtro de visibilidad de la tabla
type VisibilityFilter = 'all' | 'visible' | 'hidden';

export default function DataPage() {
  const navigate = useNavigate();
  const { alive } = useBackendStatus();
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCliente, setFilterCliente] = useState('KIMO');
  const [filterVisibility, setFilterVisibility] = useState<VisibilityFilter>('all');
  // showHidden controla la galería (persiste en localStorage); no afecta a esta tabla
  const [showHidden, setShowHidden] = useShowHidden();

  /**
   * Registro de overrides locales de visibilidad.
   * Cuando el usuario cambia la visibilidad de un proyecto vía API, guardamos
   * el nuevo valor aquí para que la tabla lo refleje sin recargar.
   * Estructura: { [projectId]: boolean }
   */
  const [localVisibility, setLocalVisibility] = useState<Record<string | number, boolean>>({});

  /**
   * IDs seleccionados actualmente en la tabla.
   * Usamos Set para búsquedas eficientes de O(1).
   */
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  /** Estado de la operación bulk (loading / error) */
  const [bulkStatus, setBulkStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [bulkError, setBulkError] = useState('');

  /** IDs de proyectos que han sido eliminados localmente */
  const [deletedIds, setDeletedIds] = useState<Set<string | number>>(new Set());

  // Opciones de categoría: dependen del tipo seleccionado
  const categoryOptions = useMemo(() => getAdminCategoryOptions(filterType), [filterType]);

  // Opciones de cliente: dependen del tipo + categoría seleccionados
  const clienteOptions = useMemo(
    () => getAdminClienteOptions(filterType, filterCategory),
    [filterType, filterCategory],
  );

  // Datos finales tras aplicar todos los filtros, con overrides de visibilidad y excluyendo eliminados
  const filteredEntries = useMemo(() => {
    const withoutDeleted = ALL_ENTRIES.filter((e) => !deletedIds.has(e.id));
    return applyDataFilters(withoutDeleted, {
      filterVisibility,
      filterType,
      filterCategory,
      filterCliente,
      localVisibility,
    });
  }, [filterVisibility, filterType, filterCategory, filterCliente, localVisibility, deletedIds]);

  // Calcular IDs duplicados en todo el dataset (no solo filtrados)
  const duplicateIds = useMemo(() => calculateAdminDuplicateIds(), []);

  // --- Handlers de selección ---

  const handleSelectRow = useCallback((id: string | number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  /** Seleccionar / deseleccionar todos los visibles en la tabla actual */
  const allCurrentSelected =
    filteredEntries.length > 0 && filteredEntries.every((e) => selectedIds.has(e.id));

  const toggleSelectAll = useCallback(() => {
    if (allCurrentSelected) {
      // Deseleccionar todos los de la vista actual
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredEntries.forEach((e) => next.delete(e.id));
        return next;
      });
    } else {
      // Seleccionar todos los de la vista actual
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredEntries.forEach((e) => next.add(e.id));
        return next;
      });
    }
  }, [allCurrentSelected, filteredEntries]);

  // --- Acción bulk: cambiar visibilidad ---

  async function handleBulkVisibility(visible: boolean) {
    if (selectedIds.size === 0) return;
    setBulkStatus('loading');
    setBulkError('');

    try {
      // Convertir a array de números (los IDs son numéricos en los JSON)
      const ids = Array.from(selectedIds)
        .map(Number)
        .filter((n) => !isNaN(n));
      await updateVisibilityBatch(ids, visible);

      // Aplicar override local para reflejar el cambio sin recargar
      setLocalVisibility((prev) => {
        const next = { ...prev };
        ids.forEach((id) => (next[id] = visible));
        return next;
      });

      // Limpiar selección
      setSelectedIds(new Set());
      setBulkStatus('idle');
    } catch (err) {
      setBulkStatus('error');
      setBulkError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  }

  // --- Acción bulk: eliminar proyectos ---

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;

    // Pedir confirmación al usuario
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar ${selectedIds.size} proyecto${selectedIds.size === 1 ? '' : 's'}? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    setBulkStatus('loading');
    setBulkError('');

    try {
      // Convertir a array de números
      const ids = Array.from(selectedIds)
        .map(Number)
        .filter((n) => !isNaN(n));
      await deleteProjectsBatch(ids);

      // Marcar los IDs como eliminados localmente
      setDeletedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        return next;
      });

      // Limpiar selección
      setSelectedIds(new Set());
      setBulkStatus('idle');
    } catch (err) {
      setBulkStatus('error');
      setBulkError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  // --- Helpers de filtros ---

  function handleTypeChange(value: string) {
    setFilterType(value);
    setFilterCategory('');
    setFilterCliente('');
  }

  function handleCategoryChange(value: string) {
    setFilterCategory(value);
    setFilterCliente('');
  }

  const hasActiveFilters =
    filterType || filterCategory || filterCliente || filterVisibility !== 'all';

  /**
   * Columnas de la tabla.
   * Las definimos dentro del componente con useMemo para poder incluir
   * el estado de selección (selectedIds) y los overrides de visibilidad.
   *
   * Usamos ColumnDef<DataEntry, unknown> porque la columna de checkbox y la de
   * visible no devuelven string, y TanStack permite widening del tipo TValue.
   */
  const columns = useMemo(
    (): ColumnDef<DataEntry, unknown>[] =>
      [
        // Columna de selección: checkbox
        {
          id: 'select',
          header: () => (
            <input
              type="checkbox"
              checked={allCurrentSelected}
              onChange={toggleSelectAll}
              aria-label="Seleccionar todos"
              className="w-6 h-6"
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              checked={selectedIds.has(row.original.id)}
              onChange={(e) => {
                e.stopPropagation();
                handleSelectRow(row.original.id, e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Seleccionar ${row.original.title}`}
              className="w-6 h-6"
            />
          ),
          enableSorting: false,
        },
        // Columna de visibilidad actual
        columnHelper.display({
          id: 'visible',
          header: 'Vis.',
          cell: ({ row }) => {
            const id = row.original.id;
            const isVisible = id in localVisibility ? localVisibility[id] : row.original.visible;
            return (
              <span
                className={`text-xs font-bold ${isVisible ? 'text-green-500' : 'text-red-400'}`}
                title={isVisible ? 'Visible' : 'Oculto'}
              >
                {isVisible ? '●' : '○'}
              </span>
            );
          },
          enableSorting: false,
        }),
        columnHelper.accessor('id', {
          header: 'ID',
          cell: (info) => <span className="text-muted text-sm">{String(info.getValue())}</span>,
        }),
        columnHelper.accessor('title', {
          header: 'Título',
          cell: (info) => <span className="font-semibold">{info.getValue() as string}</span>,
        }),
        columnHelper.accessor('cliente', {
          header: 'Cliente',
          cell: (info) => {
            const value = info.getValue() as string;
            return value ? (
              <span className="text-xs">{value}</span>
            ) : (
              <span className="text-muted text-xs">—</span>
            );
          },
        }),
        columnHelper.accessor('date', {
          header: 'Fecha',
          cell: (info) => {
            const raw = info.getValue() as string;
            if (!raw) return <span className="text-muted text-xs">—</span>;
            // Formato: YYYY-MM-DD o YYYY-MM-DD HH:mm
            // Queremos DD/MM/YYYY
            const dateStr = String(raw).slice(0, 10).replace(/-/g, '/');
            const [y, m, d] = dateStr.split('/');
            const formatted = d && m && y ? `${d}/${m}/${y}` : dateStr;
            return <span className="text-xs whitespace-nowrap">{formatted}</span>;
          },
        }),
        columnHelper.accessor('type', {
          header: 'Tipo',
          cell: (info) => <span className="text-sm">{info.getValue() as string}</span>,
        }),
        columnHelper.accessor('category', {
          header: 'Categoría',
          cell: (info) => <span className="text-xs">{info.getValue() as string}</span>,
        }),
      ] as ColumnDef<DataEntry>[],
    [selectedIds, localVisibility, allCurrentSelected, handleSelectRow, toggleSelectAll],
  );

  if (!alive) {
    return null;
  }

  return (
    <section data-id="data-page">
      <div className="flex flex-col md:flex-row md:items-center mb-8 gap-2 md:gap-4 w-full">
        <h2 className="text-xl w-full md:flex-1">
          Todos los proyectos{' '}
          <span className="text-muted text-base font-normal">({filteredEntries.length})</span>
        </h2>
        {/* Toggle privado para la visibilidad en las GALERÍAS (no afecta a esta tabla) */}
        <UIButton
          onClick={() => setShowHidden(!showHidden)}
          dataId="data-show-hidden-btn"
          link
          aria-pressed={showHidden}
        >
          {showHidden ? 'Mostrando todos los proyectos' : 'Mostrando proyectos visibles'}
          {showHidden ? (
            <IconVisible size={20} className="ml-2" />
          ) : (
            <IconHidden size={20} className="ml-2" />
          )}
        </UIButton>
        {/* Botón: + Añadir Proyecto (UIButton color cta, solid) */}
        <UIButton
          color="cta"
          addBtn
          onClick={() => window.open(`${APP_BASENAME}/kimo/add-project`, '_blank')}
          dataId="data-add-project-btn"
          disabled={!alive}
        >
          Añadir Proyecto
        </UIButton>
        {/* Botón: Pendientes (UIButton color accent, solid) */}
        <UIButton
          color="accent"
          solid
          onClick={() => navigate('/kimo/pendiente')}
          data-id="data-pending-btn"
        >
          Pendientes
        </UIButton>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 items-end" data-id="data-filter">
        {/* Filtro Tipo */}
        <div className="flex flex-col min-w-[12rem]">
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-type">
            Tipo
          </label>
          <select
            id="filter-type"
            data-id="data-filter-type"
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
            data-id="data-filter-category"
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
            data-id="data-filter-cliente"
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
            data-id="data-filter-visibility"
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
          <UIButton
            link
            onClick={() => {
              setFilterType('');
              setFilterCategory('');
              setFilterCliente('');
              setFilterVisibility('all');
            }}
            dataId="data-filter-reset-btn"
          >
            Limpiar filtros
          </UIButton>
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

      {/* Barra de acciones (solo visible al seleccionar filas) */}
      {selectedIds.size > 0 && (
        <DataActionBar
          selectedCount={selectedIds.size}
          loading={bulkStatus === 'loading'}
          error={bulkStatus === 'error' ? bulkError : ''}
          onMarkHidden={() => handleBulkVisibility(false)}
          onMarkVisible={() => handleBulkVisibility(true)}
          onDelete={handleBulkDelete}
          onCancel={() => setSelectedIds(new Set())}
        />
      )}

      {/* Tabla */}
      <div data-id="data-table">
        <BaseTable<DataEntry, unknown>
          data={filteredEntries}
          columns={columns}
          initialSorting={[{ id: 'date', desc: true }]}
          // onRowClick={(row) => navigate(`/kimo/edit-project/${row.id}`)}
          onRowClick={(row) => {
            window.open(`${APP_BASENAME}/kimo/edit-project/${row.id}`, '_blank');
          }}
          emptyMessage="No hay proyectos que coincidan con los filtros."
          caption="Tabla de todos los proyectos, con filtros por tipo, categoría, cliente y visibilidad."
        />
      </div>

      {/* Bloque de administración de trabajos recientes */}
      <div className="mt-12">
        <RecentWorksManagerPage />
      </div>

      {/* Bloque de administración del carrusel de la home */}
      <CarouselManager />
    </section>
  );
}
