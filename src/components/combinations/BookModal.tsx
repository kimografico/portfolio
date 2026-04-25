import { useCallback, useEffect, useRef, useState } from 'react';
import type { BookModalProps } from '../../interfaces/books';
import './BookModal.css';
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
    <div className="bookmodal-root" aria-modal="true" role="dialog">
      {/* Overlay oscuro y desenfoque */}
      <div
        className="modal-overlay"
        data-visible={modalVisible}
        onClick={handleClose}
        aria-hidden="true"
        style={{
          transitionDuration: `${OVERLAY_DURATION}ms`,
        }}
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
      >
        {/* Botón cerrar */}
        <button onClick={handleClose} className="modal-close" aria-label="Cerrar">
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
        />
        {/* Info */}
        <h2 className="modal-title">{book.title}</h2>
        <div className="modal-author">{book.author}</div>
        <div className="modal-info">
          <div>
            <span className="modal-label">Fecha de lectura:</span>{' '}
            {book.dateRead && book.dateRead.trim() !== ''
              ? formatYearMonth(book.dateRead.trim())
              : 'Desconocida'}{' '}
            {getFlag(book.language) && <span className="ml-1">{getFlag(book.language)}</span>}
          </div>
          {book.series && book.series.trim() !== '' && (
            <div>
              <span className="modal-label">Serie:</span> {book.series}
            </div>
          )}
          <div>
            <span className="modal-label">Género:</span> {book.genre}
          </div>
          <hr />
          {book.synopsis && (
            <div>
              <span className="modal-label">Sinopsis:</span> {book.synopsis}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookModal;
