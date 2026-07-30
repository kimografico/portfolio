import { useState } from 'react';
import type { BooksTableProps } from '../../../interfaces/book';
import BookModal from '../../../components/compositions/BookModal';
import BooksFilter from '../../../components/compositions/BooksFilter';
import BaseTable from '../../../components/compositions/BaseTable';
import type { Book } from '../../../interfaces/book';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Book>();

const columns: ColumnDef<Book, string>[] = [
  columnHelper.accessor('title', {
    header: 'Título',
    cell: (info) => <span className="font-semibold text-lg">{info.getValue()}</span>,
  }),
  columnHelper.accessor('author', {
    header: 'Autor',
  }),
  columnHelper.accessor('dateRead', {
    header: 'Fecha',
    cell: (info) => info.getValue() || <span className="text-muted">—</span>,
  }),
  columnHelper.accessor('series', {
    header: 'Serie',
    cell: (info) => info.getValue() || <span className="text-muted">—</span>,
  }),
  columnHelper.accessor('genre', {
    header: 'Género',
  }),
  columnHelper.accessor('language', {
    header: 'Idioma',
    cell: (info) => {
      const lang = info.getValue();
      return lang === 'Español' ? '' : lang === 'Inglés' ? '🇬🇧' : lang;
    },
  }),
];

export default function BooksTable({ books }: BooksTableProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const sortedBooks = [...filteredBooks]
    .map((book, index) => ({ book, index }))
    .sort((a, b) => {
      const aDate = a.book.dateRead?.trim() ?? '';
      const bDate = b.book.dateRead?.trim() ?? '';
      if (aDate && bDate) {
        const cmp = bDate.localeCompare(aDate);
        if (cmp !== 0) return cmp;
        return b.index - a.index;
      }
      if (aDate) return -1;
      if (bDate) return 1;
      return b.index - a.index;
    })
    .map(({ book }) => book);

  const handleRowClick = (book: Book) => {
    setSelectedBook(book);
  };

  return (
    <>
      <div data-id="books-filter">
        <BooksFilter books={books} onFiltered={setFilteredBooks} />
      </div>

      <div data-id="books-table">
        <BaseTable<Book, string>
          data={sortedBooks}
          columns={columns}
          initialSorting={[{ id: 'dateRead', desc: true }]}
          onRowClick={handleRowClick}
          emptyMessage="No hay libros para mostrar."
          caption="Lista de libros leídos, ordenable por título, autor, fecha, serie, género e idioma."
        />
      </div>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </>
  );
}
