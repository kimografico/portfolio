import type { ColumnMeta, BooksTableProps } from '../../interfaces/books';
import { useState } from 'react';
import BookModal from '../../components/combinations/BookModal';
import './books.css';
import BooksFilter from '../../components/combinations/BooksFilter';
import type { Book } from '../../types';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import '../../styles/tableStyles.css';

const columnHelper = createColumnHelper<Book>();

const columns = [
  columnHelper.accessor('title', {
    header: 'Título',
    cell: (info) => <span className="font-semibold text-lg">{info.getValue()}</span>,
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
      return lang === 'Español' ? ' ' : lang === 'Inglés' ? '🇬🇧' : lang;
    },
    meta: { align: 'center' } as ColumnMeta,
  }),
];

export default function BooksTable({ books }: BooksTableProps) {
  // Estado para modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  // Estado para libros filtrados
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  // Componente interno para la tabla filtrada
  function BooksTableInner({
    books,
    sorting,
    setSorting,
  }: {
    books: Book[];
    sorting: Array<{ id: string; desc: boolean }>;
    setSorting: (
      s:
        | Array<{ id: string; desc: boolean }>
        | ((prev: Array<{ id: string; desc: boolean }>) => Array<{ id: string; desc: boolean }>),
    ) => void;
  }) {
    const table = useReactTable({
      data: books,
      columns,
      state: { sorting },
      onSortingChange: (updater) => {
        // TanStack Table puede pasar una función updater o un valor directo
        const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
        setSorting(newSorting);
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
    return (
      <table className="table-main">
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
                      'table-header-cell' +
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
                    <span className="table-header-label">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span
                          className={
                            'table-sort-arrow ' + (isSorted ? 'arrow-accent' : 'arrow-grey')
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
              className={
                'table-row cursor-pointer group hover:bg-accent hover:text-white transition-colors'
              }
              onClick={() => setSelectedBook(row.original)}
              tabIndex={0}
              aria-label={`Ver detalles de ${row.original.title}`}
            >
              {row.getVisibleCells().map((cell, cellIdx) => {
                const align = (cell.column.columnDef.meta as ColumnMeta)?.align;
                const wide = (cell.column.columnDef.meta as ColumnMeta)?.wide;
                // Primera columna: título
                const isTitle = cellIdx === 0;
                return (
                  <td
                    key={cell.id}
                    className={
                      'table-cell' +
                      (align === 'center' ? ' text-center' : ' text-left') +
                      (wide ? ' min-w-[9rem]' : '') +
                      (isTitle ? ' group-hover:text-white font-semibold transition-colors' : '')
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
    );
  }

  // Estado de ordenación para la tabla filtrada
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([
    { id: 'dateRead', desc: true },
  ]);

  // Renderizado de filtros
  return (
    <>
      <BooksFilter books={books} onFiltered={setFilteredBooks} />

      {/* Tabla y mensaje de vacío */}
      {filteredBooks.length === 0 ? (
        <div className="text-muted text-center py-16">
          <p>No hay libros para mostrar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <BooksTableInner books={filteredBooks} sorting={sorting} setSorting={setSorting} />
        </div>
      )}

      {/* Modal reutilizable para detalles: solo se monta si hay libro seleccionado */}
      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </>
  );
}
