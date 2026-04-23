// Devuelve la bandera según el idioma
function getFlag(lang: string): string {
  if (!lang) return '';
  const l = lang.toLowerCase();
  if (l.startsWith('es')) return '🇪🇸';
  if (l.startsWith('en')) return '🇬🇧';
  if (l.startsWith('fr')) return '🇫🇷';
  if (l.startsWith('de')) return '🇩🇪';
  if (l.startsWith('it')) return '🇮🇹';
  if (l.startsWith('pt')) return '🇵🇹';
  // Puedes añadir más idiomas si lo necesitas
  return '';
}
// Formatea fechas 'YYYY-MM' a 'Mes de YYYY' en español
function formatYearMonth(fecha: string): string {
  if (!fecha) return '';
  const match = fecha.match(/^(\d{4})-(\d{2})$/);
  if (!match) return fecha;
  const [_, year, month] = match;
  const meses = [
    '',
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const mesNum = parseInt(month, 10);
  if (mesNum < 1 || mesNum > 12) return fecha;
  return `${meses[mesNum]} de ${year}`;
}
import { useState } from 'react';
import type { Book } from '../../types';
import noCover from '../../assets/images/books/_blank.jpg';
import BookModal from '../../components/combinations/BookModal';

interface BooksGalleryProps {
  books: Book[];
}

export default function BooksGallery({ books }: BooksGalleryProps) {
  const [selected, setSelected] = useState<Book | null>(null);

  // Modal control helpers
  const closeModal = () => setSelected(null);

  // Estado para errores de imagen en la galería
  const [imgErrors, setImgErrors] = useState<{ [id: string]: boolean }>({});

  return (
    <>
      {/* Modal reutilizable */}
      <BookModal book={selected} open={!!selected} onClose={closeModal} />
      {/* Galería de portadas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[...books]
          .slice()
          .sort((a, b) => {
            // Si ambos tienen fecha, ordenar descendente
            if (a.dateRead && a.dateRead.trim() !== '' && b.dateRead && b.dateRead.trim() !== '') {
              // ISO date o YYYY-MM-DD, compara como string
              return b.dateRead.localeCompare(a.dateRead);
            }
            // Si solo uno tiene fecha, ese va primero
            if (a.dateRead && a.dateRead.trim() !== '') return -1;
            if (b.dateRead && b.dateRead.trim() !== '') return 1;
            // Ninguno tiene fecha, mantener orden
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
                  const path = imgErrors[book.id]
                    ? noCover
                    : `${import.meta.env.BASE_URL}src/assets/images/books/${coverName}`;
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
