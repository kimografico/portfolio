import { useCallback, useEffect, useRef, useState } from 'react';
import type { Book } from '../../types';
import noCover from '../../assets/images/books/_blank.jpg';

interface BookModalProps {
  book: Book;
  onClose: () => void;
}

// Devuelve la bandera según el idioma
function getFlag(lang: string): string {
  if (!lang) return '';
  const l = lang.toLowerCase();
  if (l.startsWith('en')) return '🇬🇧';
  return '';
}

// Formatea fechas 'YYYY-MM' o 'YYYY-MM-DD' a 'Mes de YYYY' en español
function formatYearMonth(fecha: string): string {
  if (!fecha) return '';
  // Soporta 'YYYY-MM' o 'YYYY-MM-DD'
  const match = fecha.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
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

function BookModal({ book, onClose }: BookModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  // visible: controla el overlay (velo)
  // modalVisible: controla la caja modal
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // Duraciones de animación (ms)
  const OVERLAY_DURATION = 1000;
  const MODAL_DURATION = 500;

  // Animación de entrada al montar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const timeout = setTimeout(() => setModalVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  // Animación de salida y desmontaje
  const handleClose = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setVisible(false), MODAL_DURATION);
    setTimeout(() => onClose(), OVERLAY_DURATION);
  }, [MODAL_DURATION, OVERLAY_DURATION, onClose]);

  // Focus trap simple
  useEffect(() => {
    if (modalVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalVisible]);

  // Cerrar modal con Escape
  useEffect(() => {
    if (!modalVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalVisible, handleClose]);

  if (!visible) return null;

  // Overlay animado
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay oscuro y desenfoque */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-[${OVERLAY_DURATION}ms] ${modalVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
        aria-hidden="true"
        style={{
          transitionProperty: 'opacity, backdrop-filter',
          transitionDuration: `${OVERLAY_DURATION}ms`,
        }}
      />
      {/* Modal animada: fade+scale */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative z-50 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 outline-none flex flex-col items-center transition-all duration-[${MODAL_DURATION}ms] ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{
          transitionProperty: 'opacity, transform',
          transitionDuration: `${MODAL_DURATION}ms`,
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-xl text-muted hover:text-accent focus:outline-none"
          aria-label="Cerrar"
        >
          ×
        </button>
        {/* Portada */}
        <img
          src={(() => {
            const coverName =
              book.cover && book.cover.trim() !== '' ? book.cover.trim() : book.id + '.jpg';
            const path = `${import.meta.env.BASE_URL}src/assets/images/books/${coverName}`;
            return path;
          })()}
          alt={`Portada de ${book.title}`}
          className="object-cover w-64 h-96 rounded mb-4 shadow"
          draggable={false}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== noCover) target.src = noCover;
          }}
        />
        {/* Info */}
        <h2 className="text-2xl font-bold mb-1 text-center">{book.title}</h2>
        <div className="text-lg font-medium text-center mb-2">{book.author}</div>
        <div className="w-full flex flex-col gap-1 text-sm text-muted mt-2">
          <div>
            <span className="font-semibold">Fecha de lectura:</span>{' '}
            {book.dateRead && book.dateRead.trim() !== ''
              ? formatYearMonth(book.dateRead.trim())
              : 'Desconocida'}{' '}
            {getFlag(book.language) && <span className="ml-1">{getFlag(book.language)}</span>}
          </div>
          {book.series && book.series.trim() !== '' && (
            <div>
              <span className="font-semibold">Serie:</span> {book.series}
            </div>
          )}
          <div>
            <span className="font-semibold">Género:</span> {book.genre}
          </div>
          {book.synopsis && (
            <div>
              <span className="font-semibold">Sinopsis:</span> {book.synopsis}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookModal;
