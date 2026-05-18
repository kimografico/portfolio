// import eliminado, ver abajo

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

import { IconSave } from '../iconos/IconSave';
import { IconAdd } from '../iconos/IconAdd';

type UIButtonBaseProps = {
  children: ReactNode;
  icon?: ReactNode;
  arrow?: boolean;
  arrowBack?: boolean;
  dataId?: string;
  disabled?: boolean;
  color?: 'accent' | 'cta' | 'text' | 'muted';
  solid?: boolean;
  saveBtn?: boolean;
  addBtn?: boolean;
  link?: boolean;
  mobileFullWidth?: boolean;
  fullWidth?: boolean;
};

type UIButtonProps =
  | (UIButtonBaseProps & {
      href: string;
      onClick?: never;
      type?: never;
    })
  | (UIButtonBaseProps & {
      href?: undefined;
      onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
      type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    });

/**
 * UIButton: Botón de acción reutilizable para enlaces.
 * Usa el estilo btn-outline por defecto, pero permite override de clase.
 */
export default function UIButton(props: UIButtonProps) {
  const {
    children,
    icon,
    arrow = false,
    arrowBack = false,
    dataId,
    disabled = false,
    color,
    solid = false,
    saveBtn = false,
    addBtn = false,
    link = false,
    mobileFullWidth = false,
    fullWidth = false,
    ...rest
  } = props as UIButtonBaseProps & Record<string, unknown>;

  // Icon, color, solid, dataId pueden ser sobrescritos si saveBtn
  let buttonIcon = icon;
  let buttonColor = color;
  let buttonSolid = solid;
  let buttonDataId = dataId;

  if (saveBtn) {
    if (!buttonIcon) buttonIcon = <IconSave size={26} strokeWidth={1.5} />;
    if (!buttonSolid) buttonSolid = true;
    buttonColor = 'cta';
    if (!buttonDataId) buttonDataId = 'btn-save';
  }
  if (addBtn) {
    if (!buttonIcon) buttonIcon = <IconAdd size={20} />;
    if (!buttonSolid) buttonSolid = true;
    buttonColor = 'cta';
    if (!buttonDataId) buttonDataId = 'btn-add';
  }
  if (!buttonColor) buttonColor = 'text';

  // If disabled, force muted color and outlined dashed style
  const isDisabled = Boolean(disabled);
  if (isDisabled) {
    buttonColor = 'muted';
    // force outlined (not solid) to show dashed outline
    buttonSolid = false;
  }

  const colorMap = {
    accent: 'var(--color-accent)',
    cta: 'var(--color-cta)',
    text: 'var(--color-text)',
    muted: 'var(--color-muted)',
  } as const;

  const resolvedButtonColor = colorMap[buttonColor];
  // Clases base
  const sharedClassName = link
    ? 'group inline-flex items-center justify-center text-sm text-muted hover:text-ink transition-colors duration-150 bg-transparent border-0 p-0 font-normal rounded-none'
    : 'group inline-flex items-center justify-center text-sm leading-none h-10 rounded-md border px-4 py-2 font-semibold transition-colors duration-150';
  const colorClasses = link
    ? ''
    : buttonSolid
      ? 'border-[color:var(--button-color)] bg-[color:var(--button-color)] text-[color:var(--color-bg)] hover:bg-transparent hover:text-[color:var(--button-color)]'
      : 'border-[color:var(--button-color)] text-[color:var(--button-color)] hover:bg-[color:var(--button-color)] hover:text-[color:var(--color-bg)]';
  const disabledExtra = isDisabled
    ? 'border-dashed border-2 opacity-50 hover:opacity-70 hover:bg-transparent hover:text-[color:var(--color-text)] cursor-not-allowed'
    : '';
  const style = {
    '--button-color': resolvedButtonColor,
  } as CSSProperties;

  const content = (
    <>
      {arrowBack && (
        <span
          className="mr-2 inline-block align-middle transition-transform duration-150 group-hover:-translate-x-2"
          aria-hidden="true"
        >
          ←
        </span>
      )}
      {buttonIcon && (
        <span
          className="mr-2 inline-flex align-middle"
          style={{ fontSize: '1.35em', lineHeight: 1 }}
          aria-hidden="true"
        >
          {buttonIcon}
        </span>
      )}
      {children}
      {arrow && (
        <span
          className="ml-2 inline-block align-middle transition-transform duration-150 group-hover:translate-x-2"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </>
  );

  // Merge any incoming className (from rest) instead of letting it overwrite internal classes
  const restProps = rest as Record<string, unknown>;
  const incomingClass = (restProps.className as string) ?? '';
  // remove className from restProps so it isn't applied twice
  if ('className' in restProps) delete restProps.className;

  const mobileClass = mobileFullWidth ? 'w-full md:w-auto' : '';
  const fullWidthClass = fullWidth ? 'w-full' : '';

  const finalClassName =
    `${sharedClassName} ${colorClasses} ${disabledExtra} ${mobileClass} ${fullWidthClass} ${incomingClass}`.trim();

  if ('href' in props && props.href) {
    return (
      <a
        href={props.href}
        className={finalClassName}
        data-id={buttonDataId}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        style={style}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
        {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={finalClassName}
      data-id={buttonDataId}
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={disabled}
      style={style}
      {...(restProps as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
