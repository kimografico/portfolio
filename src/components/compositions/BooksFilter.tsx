import { useState, useEffect, useMemo } from 'react';
import type { Book, BooksFilterProps } from '../../interfaces/book';

function buildAuthorCounts(books: Book[]): Record<string, number> {
  const counts: Record<string, number> = {};

  books.forEach((book) => {
    if (book.author) {
      counts[book.author] = (counts[book.author] ?? 0) + 1;
    }
  });

  return counts;
}

function getUniqueSortedValues(books: Book[], key: 'series' | 'genre'): string[] {
  const values = new Set<string>();

  books.forEach((book) => {
    const value = book[key];
    if (value) {
      values.add(value);
    }
  });

  return Array.from(values).sort();
}

function getAuthorOptions(books: Book[]): string[] {
  const counts = buildAuthorCounts(books);
  const frequentAuthors = Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([author]) => author)
    .sort();

  if (Object.values(counts).some((count) => count === 1)) {
    frequentAuthors.push('OTROS');
  }

  return frequentAuthors;
}

function filterBooks(
  books: Book[],
  filterTitle: string,
  filterAuthor: string,
  filterSeries: string,
  filterGenre: string,
): Book[] {
  const normalizedTitle = filterTitle.trim().toLowerCase();
  const authorCounts = buildAuthorCounts(books);

  return books.filter((book) => {
    const matchesTitle =
      normalizedTitle === '' || book.title.toLowerCase().includes(normalizedTitle);

    const matchesAuthor =
      filterAuthor === ''
        ? true
        : filterAuthor === 'OTROS'
          ? authorCounts[book.author] === 1
          : book.author === filterAuthor;

    const matchesSeries = filterSeries === '' || book.series === filterSeries;
    const matchesGenre = filterGenre === '' || book.genre === filterGenre;

    return matchesTitle && matchesAuthor && matchesSeries && matchesGenre;
  });
}

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
    onFiltered(filterBooks(books, filterTitle, filterAuthor, filterSeries, filterGenre));
  }, [books, filterTitle, filterAuthor, filterSeries, filterGenre, onFiltered]);

  const authorOptions = useMemo(() => getAuthorOptions(books), [books]);
  const seriesOptions = useMemo(() => getUniqueSortedValues(books, 'series'), [books]);
  const genreOptions = useMemo(() => getUniqueSortedValues(books, 'genre'), [books]);

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
          data-id="books-filter-title-input"
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
          data-id="books-filter-author-select"
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
          data-id="books-filter-series-select"
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
          data-id="books-filter-genre-select"
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
