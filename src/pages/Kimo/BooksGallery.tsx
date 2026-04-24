import { useState, useMemo } from 'react';
import type { Book } from '../../types';
import BookModal from '../../components/combinations/BookModal';
import BooksFilter from '../../components/combinations/BooksFilter';

interface BooksGalleryProps {
  books: Book[];
}

export default function BooksGallery({ books }: BooksGalleryProps) {
  const [selected, setSelected] = useState<Book | null>(null);
  const closeModal = () => setSelected(null);
  const [imgErrors, setImgErrors] = useState<{ [id: string]: boolean }>({});

  // Estado para libros filtrados
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  // Opciones únicas para selects (idéntico a BooksTable)
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
    <>
      {/* Modal reutilizable: solo se monta si hay libro seleccionado */}
      {selected && <BookModal book={selected} onClose={closeModal} />}
      {/* Filtros reutilizables */}
      <BooksFilter
        books={books}
        onFiltered={setFilteredBooks}
        authorOptions={authorOptions}
        seriesOptions={seriesOptions}
        genreOptions={genreOptions}
      />
      {/* Galería de portadas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[...filteredBooks]
          .slice()
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
              className="group aspect-[2/3] w-full bg-muted rounded-lg overflow-hidden shadow transition-transform duration-300 hover:rotate-2 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent"
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
                className="object-cover w-full h-full transition-transform duration-200"
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
