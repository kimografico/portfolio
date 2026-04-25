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
import '../../styles/table.css';

interface BaseTableProps<T, TValue> {
  data: T[];
  columns: ColumnDef<T, TValue>[];
  initialSorting?: SortingState;
  onRowClick?: (row: T) => void;
  emptyMessage?: ReactNode;
  rowClassName?: string;
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
  emptyMessage = 'No hay datos para mostrar.',
  rowClassName = '',
}: BaseTableProps<T, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
    },
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
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();

                return (
                  <th
                    key={header.id}
                    className={`table-header-cell ${canSort ? 'cursor-pointer' : ''}`}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    aria-sort={
                      isSorted === 'asc'
                        ? 'ascending'
                        : isSorted === 'desc'
                          ? 'descending'
                          : undefined
                    }
                  >
                    <span className="table-header-label">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {canSort && (
                        <span
                          className={`table-sort-arrow ${
                            isSorted ? 'sort-arrow-active' : 'sort-arrow-inactive'
                          }`}
                          aria-label={
                            isSorted === 'asc'
                              ? 'Ordenado ascendente'
                              : isSorted === 'desc'
                                ? 'Ordenado descendente'
                                : 'Sin ordenar'
                          }
                        >
                          {isSorted === 'asc' && '▲'}
                          {isSorted === 'desc' && '▼'}
                          {isSorted === false && '▲'}
                        </span>
                      )}
                    </span>
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
