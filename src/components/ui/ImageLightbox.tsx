import { useCallback, useEffect, useRef, useState } from 'react';
import './ImageLightbox.css';
import { IconClose } from '../../components/iconos';

interface ImageLightboxProps {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageLightbox({ open, src, alt, onClose }: ImageLightboxProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const OVERLAY_DURATION = 400;
  const MODAL_DURATION = 200;

  // Animación de entrada
  useEffect(() => {
    if (open) {
      setVisible(true);
      const timeout = setTimeout(() => setModalVisible(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setModalVisible(false);
      const timeout = setTimeout(() => setVisible(false), OVERLAY_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Cerrar con animación
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
    <div className="imagelightbox-root" aria-modal="true" role="dialog">
      <div
        className="modal-overlay"
        data-visible={modalVisible}
        onClick={handleOverlayClick}
        aria-hidden="true"
        style={{ transitionDuration: `${OVERLAY_DURATION}ms` }}
      >
        <div
          ref={modalRef}
          tabIndex={-1}
          className="modal-content imagelightbox-content"
          data-visible={modalVisible}
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
              aria-label="Cerrar"
            >
              <IconClose size={24} strokeWidth={1} color="var(--color-muted)" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
