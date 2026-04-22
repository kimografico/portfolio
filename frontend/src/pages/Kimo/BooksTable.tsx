type ColumnMeta = {
  align?: 'left' | 'center';
  wide?: boolean;
};
import * as React from 'react';
import type { Book } from '../../types';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

interface BooksTableProps {
  books: Book[];
}

const columnHelper = createColumnHelper<Book>();

const columns = [
  columnHelper.accessor('title', {
    header: 'Título',
    cell: (info) => <span className="font-semibold text-ink text-lg">{info.getValue()}</span>,
    meta: { align: 'left' } as ColumnMeta,
  }),
  columnHelper.accessor('author', {
    header: 'Autor',
    cell: (info) => info.getValue(),
    meta: { align: 'center' } as ColumnMeta,
  }),
  columnHelper.accessor('dateRead', {
    header: 'Fecha',
    cell: (info) => info.getValue() || <span className="text-muted">—</span>,
    meta: { align: 'center', wide: true } as ColumnMeta,
  }),
  columnHelper.accessor('series', {
    header: 'Serie',
    cell: (info) => info.getValue() || <span className="text-muted">—</span>,
    meta: { align: 'center' } as ColumnMeta,
  }),
  columnHelper.accessor('genre', {
    header: 'Género',
    cell: (info) => info.getValue(),
    meta: { align: 'center' } as ColumnMeta,
  }),
  columnHelper.accessor('language', {
    header: 'Idioma',
    cell: (info) => {
      const lang = info.getValue();
      return lang === 'Español' ? '🇪🇸' : lang === 'Inglés' ? '🇬🇧' : lang;
    },
    meta: { align: 'center' } as ColumnMeta,
  }),
];

export default function BooksTable({ books }: BooksTableProps) {
  const [sorting, setSorting] = React.useState<Array<{ id: string; desc: boolean }>>([
    { id: 'dateRead', desc: true },
  ]);

  const table = useReactTable({
    data: books,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // enableSorting: true por defecto
  });

  if (!books.length) {
    return (
      <div className="text-muted text-center py-16">
        <p>No hay libros para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-border rounded-lg text-sm">
        <thead className="bg-surface">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className={
                      'px-4 py-2 font-semibold text-ink border-b border-border ' +
                      ((header.column.columnDef.meta as ColumnMeta)?.align === 'center'
                        ? 'text-center'
                        : 'text-left') +
                      ((header.column.columnDef.meta as ColumnMeta)?.wide ? ' min-w-[9rem]' : '') +
                      (header.column.getCanSort() ? ' cursor-pointer select-none group' : '')
                    }
                    scope="col"
                    onClick={header.column.getToggleSortingHandler()}
                    aria-sort={
                      isSorted === 'asc'
                        ? 'ascending'
                        : isSorted === 'desc'
                          ? 'descending'
                          : undefined
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="ml-1 text-xs text-muted group-hover:text-ink transition-colors">
                          {isSorted === 'asc' && '▲'}
                          {isSorted === 'desc' && '▼'}
                          {!isSorted && <span className="opacity-30">⇅</span>}
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
            <tr key={row.id} className="even:bg-bg">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={
                    'px-4 py-2 border-b border-border ' +
                    ((cell.column.columnDef.meta as ColumnMeta)?.align === 'center'
                      ? 'text-center'
                      : 'text-left') +
                    ((cell.column.columnDef.meta as ColumnMeta)?.wide ? ' min-w-[9rem]' : '')
                  }
                >
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
