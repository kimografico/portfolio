// import eliminado, ver abajo

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

import { IconSave } from '../iconos/IconSave';

type UIButtonBaseProps = {
  children: ReactNode;
  icon?: ReactNode;
  arrow?: boolean;
  arrowBack?: boolean;
  dataId?: string;
  disabled?: boolean;
  color?: 'accent' | 'cta' | 'text';
  solid?: boolean;
  saveBtn?: boolean;
  link?: boolean;
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
    link = false,
    ...rest
  } = props;

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
  if (!buttonColor) buttonColor = 'text';

  const colorMap = {
    accent: 'var(--color-accent)',
    cta: 'var(--color-cta)',
    text: 'var(--color-text)',
  } as const;

  const resolvedButtonColor = colorMap[buttonColor];
  // Clases base
  const sharedClassName = link
    ? 'group inline-flex items-center justify-center text-sm text-muted hover:text-ink transition-colors duration-150 bg-transparent border-0 p-0 font-normal rounded-none'
    : 'group inline-flex items-center justify-center rounded-md border px-4 py-2 font-semibold transition-colors duration-150';
  const colorClasses = link
    ? ''
    : buttonSolid
      ? 'border-[color:var(--button-color)] bg-[color:var(--button-color)] text-[color:var(--color-bg)] hover:bg-transparent hover:text-[color:var(--button-color)]'
      : 'border-[color:var(--button-color)] text-[color:var(--button-color)] hover:bg-[color:var(--button-color)] hover:text-[color:var(--color-bg)]';
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

  if ('href' in props && props.href) {
    return (
      <a
        href={props.href}
        className={`${sharedClassName} ${colorClasses} ${disabled ? 'pointer-events-none opacity-50' : ''}`}
        data-id={buttonDataId}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        style={style}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      className={`${sharedClassName} ${colorClasses}`}
      data-id={buttonDataId}
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={disabled}
      style={style}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
