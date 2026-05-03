import { useState } from 'react';
import type { Book } from '../../types';
import BookModal from '../../components/compositions/BookModal';
import BooksFilter from '../../components/compositions/BooksFilter';
import '../../styles/books.css';

import type { BooksGalleryProps } from '../../interfaces/books';

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
          .sort((a, b) => {
            if (a.dateRead && a.dateRead.trim() !== '' && b.dateRead && b.dateRead.trim() !== '') {
              return b.dateRead.localeCompare(a.dateRead);
            }
            if (a.dateRead && a.dateRead.trim() !== '') return -1;
            if (b.dateRead && b.dateRead.trim() !== '') return 1;
            return 0;
          })
          .map((book) => (
            <button
              key={book.id}
              className="book-cover"
              onClick={() => setSelected(book)}
              aria-label={`Ver detalles de ${book.title}`}
              tabIndex={0}
              title={book.title}
            >
              <img
                src={(() => {
                  const coverName =
                    book.cover && book.cover.trim() !== '' ? book.cover.trim() : book.id + '.jpg';
                  const blankImage = `${import.meta.env.VITE_BOOK_COVERS_PATH}/_blank.jpg`;
                  const path = imgErrors[book.id]
                    ? blankImage
                    : `${import.meta.env.VITE_BOOK_COVERS_PATH}/${coverName}`;
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
