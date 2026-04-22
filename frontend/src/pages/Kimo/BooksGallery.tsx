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
import { useState, useRef, useEffect } from 'react';
import type { Book } from '../../types';
import noCover from '../../assets/images/books/_blank.jpg';

interface BooksGalleryProps {
  books: Book[];
}

export default function BooksGallery({ books }: BooksGalleryProps) {
  const [selected, setSelected] = useState<Book | null>(null);
  const [showOverlay, setShowOverlay] = useState(false); // controla el montaje del overlay
  const [overlayVisible, setOverlayVisible] = useState(false); // controla la opacidad
  const modalRef = useRef<HTMLDivElement>(null);

  // Abrir modal: montar overlay y activar animación en el siguiente tick
  useEffect(() => {
    if (selected) {
      setShowOverlay(true);
      // Esperar al siguiente tick para activar la opacidad
      setTimeout(() => setOverlayVisible(true), 10);
    }
  }, [selected]);

  // Cerrar modal: animar opacidad y desmontar tras la transición
  const closeModal = () => {
    setOverlayVisible(false);
    setTimeout(() => {
      setShowOverlay(false);
      setSelected(null);
    }, 500); // igual a duration-500
  };

  // Cerrar modal con Escape
  useEffect(() => {
    if (!showOverlay) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showOverlay]);

  // Focus trap simple
  useEffect(() => {
    if (showOverlay && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showOverlay]);

  // Estado para errores de imagen en la galería
  const [imgErrors, setImgErrors] = useState<{ [id: string]: boolean }>({});

  return (
    <>
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
              className="group aspect-[2/3] w-full bg-muted rounded-lg overflow-hidden shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              onClick={() => setSelected(book)}
              aria-label={`Ver detalles de ${book.title}`}
              tabIndex={0}
              title={book.title}
            >
              <img
                src={imgErrors[book.id] || !book.cover ? noCover : book.cover}
                alt={`Portada de ${book.title}`}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200"
                draggable={false}
                loading="lazy"
                onError={() => setImgErrors((prev) => ({ ...prev, [book.id]: true }))}
              />
            </button>
          ))}
      </div>

      {/* Modal de detalles con overlay animado */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Overlay oscuro y desenfoque */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${overlayVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={closeModal}
            aria-hidden="true"
          />
          {selected && overlayVisible && (
            <div
              ref={modalRef}
              tabIndex={-1}
              className="relative z-50 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 outline-none flex flex-col items-center"
            >
              {/* Botón cerrar */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-xl text-muted hover:text-accent focus:outline-none"
                aria-label="Cerrar"
              >
                ×
              </button>
              {/* Portada */}
              <img
                src={selected.cover || noCover}
                alt={`Portada de ${selected.title}`}
                className="object-cover w-40 h-60 rounded mb-4 shadow"
                draggable={false}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== noCover) target.src = noCover;
                }}
              />
              {/* Info */}
              <h2 className="text-2xl font-bold mb-1 text-center">{selected.title}</h2>
              <div className="text-lg font-medium text-center mb-2">{selected.author}</div>
              <div className="w-full flex flex-col gap-1 text-sm text-muted mt-2">
                <div>
                  <span className="font-semibold">Fecha de lectura:</span>{' '}
                  {selected.dateRead && selected.dateRead.trim() !== ''
                    ? formatYearMonth(selected.dateRead.trim())
                    : 'Desconocida'}{' '}
                  {getFlag(selected.language) && (
                    <span className="ml-1">{getFlag(selected.language)}</span>
                  )}
                </div>
                {selected.series && selected.series.trim() !== '' && (
                  <div>
                    <span className="font-semibold">Serie:</span> {selected.series}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Género:</span> {selected.genre}
                </div>
                {selected.synopsis && (
                  <div>
                    <span className="font-semibold">Sinopsis:</span> {selected.synopsis}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
