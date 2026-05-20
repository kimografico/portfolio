import type { ReactNode } from 'react';

type FormStatusAlertVariant = 'success' | 'error';

interface FormStatusAlertProps {
  /** Tipo de alerta: success (verde) o error (rojo) */
  variant: FormStatusAlertVariant;
  /** Contenido del mensaje */
  children: ReactNode;
  /** data-id para testing */
  dataId?: string;
}

/**
 * Estilos base compartidos por todas las variantes.
 */
const BASE_CLASSES = 'rounded-lg border p-4';

/**
 * Estilos específicos por variante.
 */
const VARIANT_CLASSES: Record<FormStatusAlertVariant, string> = {
  success: 'border-green-300 bg-green-50 text-green-800',
  error: 'border-red-300 bg-red-50 text-red-800',
};

/**
 * Iconos por variante.
 */
const VARIANT_ICONS: Record<FormStatusAlertVariant, string> = {
  success: '✅',
  error: '❌',
};

/**
 * FormStatusAlert
 *
 * Componente reutilizable para mostrar mensajes de estado en formularios.
 * Soporta dos variantes: success (verde) y error (rojo).
 *
 * @example
 * ```tsx
 * <FormStatusAlert variant="success" dataId="form-success">
 *   Libro creado correctamente
 * </FormStatusAlert>
 *
 * <FormStatusAlert variant="error" dataId="form-error">
 *   {errorMsg}
 * </FormStatusAlert>
 * ```
 */
export default function FormStatusAlert({ variant, children, dataId }: FormStatusAlertProps) {
  return (
    <div className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]}`} data-id={dataId}>
      {VARIANT_ICONS[variant]} {children}
    </div>
  );
}
