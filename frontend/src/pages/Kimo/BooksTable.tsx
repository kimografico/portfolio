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
import {
  TABLE_CLASS,
  TABLE_ROW_CLASS,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CELL_CLASS,
} from '../../styles/tableStyles';

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
      <table className={TABLE_CLASS}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                const align = (header.column.columnDef.meta as ColumnMeta)?.align;
                const wide = (header.column.columnDef.meta as ColumnMeta)?.wide;
                return (
                  <th
                    key={header.id}
                    className={
                      TABLE_HEADER_CELL_CLASS +
                      (align === 'center' ? ' text-center' : ' text-left') +
                      (wide ? ' min-w-[9rem]' : '')
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
                        <span
                          className={
                            'ml-1 text-xs transition-colors ' +
                            (isSorted ? 'text-accent' : 'text-gray-300 group-hover:text-gray-400')
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
            <tr key={row.id} className={TABLE_ROW_CLASS}>
              {row.getVisibleCells().map((cell) => {
                const align = (cell.column.columnDef.meta as ColumnMeta)?.align;
                const wide = (cell.column.columnDef.meta as ColumnMeta)?.wide;
                return (
                  <td
                    key={cell.id}
                    className={
                      TABLE_CELL_CLASS +
                      (align === 'center' ? ' text-center' : ' text-left') +
                      (wide ? ' min-w-[9rem]' : '')
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
