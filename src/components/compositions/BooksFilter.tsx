import { useState, useEffect, useMemo } from 'react';
import type { Book } from '../../types';
import type { BooksFilterProps } from '../../interfaces/books';

/**
 * Filtros reutilizables para libros: título, autor, serie y género.
 * Controlado por el padre para máxima flexibilidad.
 */
export default function BooksFilter({ books, onFiltered }: BooksFilterProps) {
  const [filterTitle, setFilterTitle] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterSeries, setFilterSeries] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  useEffect(() => {
    // Lógica de filtrado movida aquí
    const filtered = books.filter((b) => {
      const matchesTitle =
        filterTitle.trim() === '' ||
        b.title.toLowerCase().includes(filterTitle.trim().toLowerCase());
      let matchesAuthor = filterAuthor === '' || b.author === filterAuthor;
      if (filterAuthor === 'OTROS') {
        // Solo autores que aparecen una vez
        const count: Record<string, number> = {};
        books.forEach((book) => {
          if (book.author) count[book.author] = (count[book.author] || 0) + 1;
        });
        matchesAuthor = count[b.author] === 1;
      }
      const matchesSeries = filterSeries === '' || b.series === filterSeries;
      const matchesGenre = filterGenre === '' || b.genre === filterGenre;
      return matchesTitle && matchesAuthor && matchesSeries && matchesGenre;
    });
    onFiltered(filtered);
  }, [books, filterTitle, filterAuthor, filterSeries, filterGenre, onFiltered]);

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

  return (
    <div className="flex flex-wrap gap-4 w-full mb-10 items-end" data-id="books-filter-wrapper">
      <div className="flex-[1.5_1.5_0%] min-w-[16rem] md:order-1 order-1 w-full md:w-auto">
        <label className="block text-xs font-semibold text-muted mb-1" htmlFor="filter-title">
          Título
        </label>
        <input
          id="filter-title"
          type="text"
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent w-full"
          style={{ background: 'var(--color-bg-btn)', color: 'var(--color-text-btn)' }}
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
          style={{ background: 'var(--color-bg-btn)', color: 'var(--color-text-btn)' }}
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
          style={{ background: 'var(--color-bg-btn)', color: 'var(--color-text-btn)' }}
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
          style={{ background: 'var(--color-bg-btn)', color: 'var(--color-text-btn)' }}
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
  );
}
