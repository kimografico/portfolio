type ColumnMeta = {
  align?: 'left' | 'center';
  wide?: boolean;
};
import { useState, useMemo } from 'react';
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
  // Estado para filtros
  const [filterTitle, setFilterTitle] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterSeries, setFilterSeries] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  // Opciones únicas para selects
  const authorOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.author && set.add(b.author));
    return Array.from(set).sort();
  }, [books]);

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
    setSorting: (s: Array<{ id: string; desc: boolean }>) => void;
  }) {
    const table = useReactTable({
      data: books,
      columns,
      state: { sorting },
      onSortingChange: setSorting,
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
    );
  }

  // Estado de ordenación para la tabla filtrada
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([
    { id: 'dateRead', desc: true },
  ]);

  // Filtrado de libros según los filtros activos
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesTitle =
        filterTitle.trim() === '' ||
        b.title.toLowerCase().includes(filterTitle.trim().toLowerCase());
      const matchesAuthor = filterAuthor === '' || b.author === filterAuthor;
      const matchesSeries = filterSeries === '' || b.series === filterSeries;
      const matchesGenre = filterGenre === '' || b.genre === filterGenre;
      return matchesTitle && matchesAuthor && matchesSeries && matchesGenre;
    });
  }, [books, filterTitle, filterAuthor, filterSeries, filterGenre]);

  // Renderizado de filtros
  return (
    <>
      <div className="flex flex-wrap gap-4 w-full mb-4 items-end">
        <div className="flex-[1.5_1.5_0%] min-w-[16rem] md:order-1 order-1 w-full md:w-auto">
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-title">
            Título
          </label>
          <input
            id="filter-title"
            type="text"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent w-full"
            placeholder="Buscar título..."
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[10rem] md:order-2 order-2 w-full md:w-auto">
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-author">
            Autor
          </label>
          <select
            id="filter-author"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-w-[8rem] w-full"
            value={filterAuthor}
            onChange={(e) => {
              setFilterAuthor(e.target.value);
              setFilterSeries('');
              setFilterGenre('');
            }}
          >
            <option value="">Todos</option>
            {authorOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[10rem] md:order-3 order-3 w-full md:w-auto">
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-series">
            Serie
          </label>
          <select
            id="filter-series"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-w-[8rem] w-full"
            value={filterSeries}
            onChange={(e) => {
              setFilterSeries(e.target.value);
              setFilterAuthor('');
              setFilterGenre('');
            }}
          >
            <option value="">Todas</option>
            {seriesOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[10rem] md:order-4 order-4 w-full md:w-auto">
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-genre">
            Género
          </label>
          <select
            id="filter-genre"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-w-[8rem] w-full"
            value={filterGenre}
            onChange={(e) => {
              setFilterGenre(e.target.value);
              setFilterAuthor('');
              setFilterSeries('');
            }}
          >
            <option value="">Todos</option>
            {genreOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

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
    </>
  );
}
