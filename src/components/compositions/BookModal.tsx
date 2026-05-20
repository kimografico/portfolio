import { useCallback, useEffect, useRef, useState } from 'react';
import type { BookModalProps } from '../../interfaces/book';
import '../../styles/components/BookModal.css';
import { IconClose } from '../../components/iconos';

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
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  // visible: controla el overlay (velo)
  // modalVisible: controla la caja modal
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // Duraciones de animación (ms)
  const OVERLAY_DURATION = 1000;
  const MODAL_DURATION = 500;

  // Animación de entrada al montar + bloquear scroll del body
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add('modal-open');
    const timeout = setTimeout(() => setModalVisible(true), 10);
    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Animación de salida y desmontaje + desbloquear scroll del body
  const handleClose = useCallback(() => {
    setModalVisible(false);
    document.body.classList.remove('modal-open');
    setTimeout(() => setVisible(false), MODAL_DURATION);
    setTimeout(() => {
      previouslyFocusedElementRef.current?.focus();
      onClose();
    }, OVERLAY_DURATION);
  }, [MODAL_DURATION, OVERLAY_DURATION, onClose]);

  // Focus trap simple
  useEffect(() => {
    if (modalVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (!modalVisible) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
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
      className="bookmodal-root"
      aria-modal="true"
      role="dialog"
      aria-labelledby="book-modal-title"
      data-id="book-modal"
    >
      {/* Overlay oscuro y desenfoque */}
      <div
        className="modal-overlay"
        data-visible={modalVisible}
        onClick={handleClose}
        aria-hidden="true"
        style={{
          transitionDuration: `${OVERLAY_DURATION}ms`,
        }}
        data-id="book-modal-overlay"
      />
      {/* Modal animada: fade+scale */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="modal-content"
        data-visible={modalVisible}
        style={{
          transitionDuration: `${MODAL_DURATION}ms`,
        }}
        data-id="book-modal-content"
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="modal-close"
          aria-label="Cerrar modal"
          data-id="book-modal-close-btn"
        >
          <IconClose size={24} strokeWidth={1} color="var(--color-muted)" />
        </button>
        {/* Portada */}
        <img
          src={(() => {
            const coverName =
              book.cover && book.cover.trim() !== '' ? book.cover.trim() : book.id + '.jpg';
            const path = `${import.meta.env.VITE_BOOK_COVERS_PATH}/${coverName}`;
            return path;
          })()}
          alt={`Portada de ${book.title}`}
          className="modal-cover"
          draggable={false}
          onError={(e) => {
            const target = e.currentTarget;
            const blankImage = `${import.meta.env.VITE_BOOK_COVERS_PATH}/_blank.jpg`;
            if (target.src !== blankImage) target.src = blankImage;
          }}
          data-id="book-modal-cover"
        />
        {/* Info */}
        <h2 id="book-modal-title" className="modal-title">
          {book.title}
        </h2>
        <div className="modal-author" data-id="book-modal-author">
          {book.author}
        </div>
        <div className="modal-info" data-id="book-modal-info">
          <div data-id="book-modal-reading-date">
            <span className="modal-label">Fecha de lectura:</span>{' '}
            {book.dateRead && book.dateRead.trim() !== ''
              ? formatYearMonth(book.dateRead.trim())
              : 'Desconocida'}{' '}
            {getFlag(book.language) && <span className="ml-1">{getFlag(book.language)}</span>}
          </div>
          {book.series && book.series.trim() !== '' && (
            <div data-id="book-modal-series">
              <span className="modal-label">Serie:</span> {book.series}
            </div>
          )}
          <div data-id="book-modal-genre">
            <span className="modal-label">Género:</span> {book.genre}
          </div>
          <hr />
          {book.synopsis && (
            <div data-id="book-modal-synopsis">
              <span className="modal-label">Sinopsis:</span> {book.synopsis}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookModal;
