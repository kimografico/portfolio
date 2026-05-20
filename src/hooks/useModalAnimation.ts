import { useCallback, useEffect, useRef, useState } from 'react';

interface UseModalAnimationOptions {
  /**
   * Duración de la animación del overlay (ms).
   * @default 400
   */
  overlayDuration?: number;

  /**
   * Duración de la animación del modal (ms).
   * @default 200
   */
  modalDuration?: number;

  /**
   * Si true, bloquea el scroll del body mientras el modal está abierto.
   * @default false
   */
  lockBodyScroll?: boolean;

  /**
   * Callback que se ejecuta al cerrar el modal (después de la animación).
   */
  onClose: () => void;
}

interface UseModalAnimationResult {
  /**
   * Ref a asignar al contenedor del modal para focus trap.
   */
  modalRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Si true, el modal debe ser visible en el DOM (para renderizado condicional).
   */
  visible: boolean;

  /**
   * Si true, el contenido animado debe tener su clase de "activo/visible".
   */
  modalVisible: boolean;

  /**
   * Función para cerrar el modal con animación.
   */
  handleClose: () => void;
}

/**
 * useModalAnimation
 *
 * Hook que unifica la lógica de animación de modales:
 * - Animación de entrada/salida (overlay y contenido)
 * - Focus trap (Tab/Shift+Tab)
 * - Cierre con Escape
 * - Restauración del foco al elemento previo
 * - Bloqueo opcional del scroll del body
 *
 * @example
 * ```tsx
 * function MyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
 *   const { modalRef, visible, modalVisible, handleClose } = useModalAnimation({
 *     onClose,
 *     overlayDuration: 300,
 *     modalDuration: 200,
 *     lockBodyScroll: true,
 *   });
 *
 *   // Sincronizar con prop "open" (para modales tipo lightbox)
 *   useEffect(() => {
 *     if (open) {
 *       // iniciar animación de apertura...
 *     } else {
 *       handleClose();
 *     }
 *   }, [open, handleClose]);
 *
 *   if (!visible) return null;
 *
 *   return (
 *     <div ref={modalRef} className={modalVisible ? 'active' : ''}>
 *       <button onClick={handleClose}>Cerrar</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useModalAnimation({
  overlayDuration = 400,
  modalDuration = 200,
  lockBodyScroll = false,
  onClose,
}: UseModalAnimationOptions): UseModalAnimationResult {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // visible: controla renderizado del overlay
  // modalVisible: controla animación del contenido
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Iniciar animación de apertura.
   * Llamar cuando el modal debe abrirse.
   */
  const startOpenAnimation = useCallback(() => {
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (lockBodyScroll) {
      document.body.classList.add('modal-open');
    }

    // Pequeño delay para que el DOM se actualice antes de iniciar la animación
    setTimeout(() => setVisible(true), 0);
    setTimeout(() => setModalVisible(true), 10);
  }, [lockBodyScroll]);

  // Efecto para iniciar apertura al montar (útil para modales siempre montados)
  useEffect(() => {
    startOpenAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Cerrar el modal con animación.
   */
  const handleClose = useCallback(() => {
    setModalVisible(false);

    if (lockBodyScroll) {
      document.body.classList.remove('modal-open');
    }

    closeTimeoutRef.current = setTimeout(
      () => {
        setVisible(false);
        closeTimeoutRef.current = null;
        previouslyFocusedElementRef.current?.focus();
        onClose();
      },
      Math.max(overlayDuration, modalDuration),
    );
  }, [lockBodyScroll, overlayDuration, modalDuration, onClose]);

  // Focus trap: al hacer visible, enfocar el modal
  useEffect(() => {
    if (modalVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalVisible]);

  // Focus trap: atrapar Tab dentro del modal
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
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalVisible, handleClose]);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return {
    modalRef,
    visible,
    modalVisible,
    handleClose,
  };
}
