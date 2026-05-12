import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import '../../styles/components/table.css';

interface BaseTableProps<T, TValue> {
  data: T[];
  columns: ColumnDef<T, TValue>[];
  initialSorting?: SortingState;
  onRowClick?: (row: T) => void;
  onSortingChange?: (sorting: SortingState) => void;
  emptyMessage?: ReactNode;
  rowClassName?: string;
  caption?: ReactNode;
}

/**
 * Componente base para tablas reutilizables con TanStack Table.
 * Maneja renderizado, sorting y estilos consistentes.
 *
 * Uso:
 * ```tsx
 * <BaseTable
 *   data={books}
 *   columns={bookColumns}
 *   initialSorting={[{ id: 'fecha', desc: true }]}
 *   onRowClick={handleRowClick}
 * />
 * ```
 */
export default function BaseTable<T extends object, TValue = unknown>({
  data,
  columns,
  initialSorting = [],
  onRowClick,
  onSortingChange,
  emptyMessage = 'No hay datos para mostrar.',
  rowClassName = '',
  caption,
}: BaseTableProps<T, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      setSorting((currentSorting) => {
        const newSorting = typeof updater === 'function' ? updater(currentSorting) : updater;
        onSortingChange?.(newSorting);
        return newSorting;
      });
    },
    // Desactiva el tercer estado "sin ordenar": al hacer clic alterna solo entre asc y desc
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (data.length === 0) {
    return (
      <div className="text-muted text-center py-16">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-id="base-table">
      <table className="table-main">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();
                const sortState =
                  isSorted === 'asc' ? 'ascending' : isSorted === 'desc' ? 'descending' : 'none';

                return (
                  <th
                    key={header.id}
                    className="table-header-cell"
                    scope="col"
                    aria-sort={canSort ? sortState : undefined}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        className="table-header-button"
                        onClick={header.column.getToggleSortingHandler()}
                        data-id={`table-sort-btn-${header.id}`}
                      >
                        <span className="table-header-label">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span
                            className={`table-sort-arrow ${
                              isSorted ? 'sort-arrow-active' : 'sort-arrow-inactive'
                            }`}
                            aria-hidden="true"
                          >
                            {isSorted === 'desc' ? '▼' : '▲'}
                          </span>
                        </span>
                      </button>
                    ) : (
                      <span className="table-header-label">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`table-row ${onRowClick ? 'table-row-interactive' : ''} ${rowClassName}`}
              onClick={() => onRowClick?.(row.original)}
              tabIndex={onRowClick ? 0 : -1}
              data-id={onRowClick ? `table-row-${row.id}` : undefined}
              onKeyDown={(event) => {
                if (!onRowClick) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick(row.original);
                }
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="table-cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
