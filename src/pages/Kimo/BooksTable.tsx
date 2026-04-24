type ColumnMeta = {
  align?: 'left' | 'center';
  wide?: boolean;
};
import { useState, useMemo } from 'react';
import BookModal from '../../components/combinations/BookModal';
import BooksFilter from '../../components/combinations/BooksFilter';
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

  // Opciones únicas para selects

  // Devuelve autores frecuentes y añade 'OTROS' al final
  function getAuthorOptions(books: Book[]): string[] {
    const count: Record<string, number> = {};
    books.forEach((b) => {
      if (b.author) count[b.author] = (count[b.author] || 0) + 1;
    });
    const frequent = Object.entries(count)
      .filter(([_, n]) => n > 1)
      .map(([a]) => a)
      .sort();
    if (Object.entries(count).some(([_, n]) => n === 1)) {
      frequent.push('OTROS');
    }
    return frequent;
  }

  const authorOptions = useMemo(() => getAuthorOptions(books), [books]);

  const seriesOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.series && set.add(b.series));
    return Array.from(set).sort();
  }, [books]);

  const genreOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.genre && set.add(b.genre));
    return Array.from(set).sort();
  }, [books]);

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
            <tr
              key={row.id}
              className={
                TABLE_ROW_CLASS +
                ' cursor-pointer group hover:bg-accent hover:text-white transition-colors'
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
                      TABLE_CELL_CLASS +
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
      <BooksFilter
        books={books}
        onFiltered={setFilteredBooks}
        authorOptions={authorOptions}
        seriesOptions={seriesOptions}
        genreOptions={genreOptions}
      />

      <style>{`
        @media (max-width: 767px) {
          /* En móvil: todos los filtros apilados verticalmente */
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          /* En md: Título arriba (100%), los otros tres en una fila debajo */
          .mb-4.items-end > .order-1 { flex-basis: 100%; max-width: 100%; }
          .mb-4.items-end > .order-2,
          .mb-4.items-end > .order-3,
          .mb-4.items-end > .order-4 { flex-basis: 0; min-width: 0; }
        }
      `}</style>
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
