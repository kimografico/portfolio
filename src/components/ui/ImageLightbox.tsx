import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/components/ImageLightbox.css';
import { IconClose } from '../../components/iconos';

interface ImageLightboxProps {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
  dataId?: string;
  IconFallback?: React.FC<{ size?: number; color?: string }>;
  buildImagePath?: (filename: string) => string;
}

export default function ImageLightbox({ open, src, alt, onClose, dataId }: ImageLightboxProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false); // controla el renderizado
  const [modalVisible, setModalVisible] = useState(false); // controla la animación
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const OVERLAY_DURATION = 400;
  const MODAL_DURATION = 200;
  useEffect(() => {
    if (open) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
      // Si se abre, cancelar cualquier cierre pendiente y mostrar el modal
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setTimeout(() => setVisible(true), 0);
      setTimeout(() => setModalVisible(true), 10);
    } else {
      setTimeout(() => setModalVisible(false), 0);
      closeTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        closeTimeoutRef.current = null;
      }, OVERLAY_DURATION);
    }
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [open]);

  // Cerrar con animación (al pulsar botón o fondo)
  const handleClose = useCallback(() => {
    setModalVisible(false);
    closeTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      closeTimeoutRef.current = null;
      previouslyFocusedElementRef.current?.focus();
    }, OVERLAY_DURATION);
    // Llama a onClose inmediatamente para que el padre cierre el modal
    onClose();
  }, [onClose, OVERLAY_DURATION]);

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

  // Cerrar con Escape
  useEffect(() => {
    if (!modalVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalVisible, handleClose]);

  if (!visible) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className="imagelightbox-root"
      aria-modal="true"
      role="dialog"
      aria-label={alt || 'Vista ampliada de la imagen'}
      data-id={dataId || 'image-lightbox-overlay'}
    >
      <div
        className="modal-overlay"
        data-visible={modalVisible}
        onClick={handleOverlayClick}
        aria-hidden="true"
        style={{ transitionDuration: `${OVERLAY_DURATION}ms` }}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className="modal-content imagelightbox-content"
        data-visible={modalVisible}
        onClick={handleOverlayClick}
        style={{
          transitionDuration: `${MODAL_DURATION}ms`,
          position: 'relative',
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: 'auto',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="imagelightbox-imgwrap">
          <img src={src} alt={alt} className="imagelightbox-image" draggable={false} />
          <button
            onClick={handleClose}
            className="modal-close imagelightbox-close"
            aria-label="Cerrar vista ampliada"
          >
            <IconClose size={24} strokeWidth={1} color="var(--color-muted)" />
          </button>
        </div>
      </div>
    </div>
  );
}
