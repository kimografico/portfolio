import { useState } from 'react';
import type { Book } from '../../../interfaces/book';
import BookModal from '../../../components/compositions/BookModal';
import BooksFilter from '../../../components/compositions/BooksFilter';
import '../../../styles/books.css';
import { APP_BASENAME } from '../../../data/config/app';

import type { BooksGalleryProps } from '../../../interfaces/book';

export default function BooksGallery({ books }: BooksGalleryProps) {
  const [selected, setSelected] = useState<Book | null>(null);
  const closeModal = () => setSelected(null);
  const [imgErrors, setImgErrors] = useState<{ [id: string]: boolean }>({});

  // Estado para libros filtrados
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  return (
    <>
      {/* Modal reutilizable: solo se monta si hay libro seleccionado */}
      {selected && <BookModal book={selected} onClose={closeModal} />}
      {/* Filtros reutilizables */}
      <div data-id="books-filter">
        <BooksFilter books={books} onFiltered={setFilteredBooks} />
      </div>
      {/* Galería de portadas */}
      <div className="bookshelf-grid" data-id="books-gallery-grid">
        {[...filteredBooks]
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
          .map(({ book }) => book)
          .map((book) => (
            <button
              key={book.id}
              className="book-cover"
              data-id={`book-cover-${book.id}`}
              onClick={() => setSelected(book)}
              aria-label={`Ver detalles de ${book.title}`}
              title={book.title}
            >
              <img
                src={(() => {
                  const coverName =
                    book.cover && book.cover.trim() !== '' ? book.cover.trim() : book.id + '.jpg';
                  const blankImage = `${APP_BASENAME}${import.meta.env.VITE_BOOK_COVERS_PATH}/_blank.jpg`;
                  const path = imgErrors[book.id]
                    ? blankImage
                    : `${APP_BASENAME}${import.meta.env.VITE_BOOK_COVERS_PATH}/${coverName}`;
                  return path;
                })()}
                alt={`Portada de ${book.title}`}
                draggable={false}
                loading="lazy"
                onError={() => setImgErrors((prev) => ({ ...prev, [book.id]: true }))}
              />
            </button>
          ))}
      </div>
    </>
  );
}
