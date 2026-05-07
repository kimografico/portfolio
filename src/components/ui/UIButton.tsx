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
    arrow = false,
    arrowBack = false,
    disabled = false,
    saveBtn = false,
    ...rest
  } = props;

  // Icon, color, solid, dataId pueden ser sobrescritos si saveBtn
  let icon = props.icon;
  let color = props.color;
  let solid = props.solid ?? false;
  let dataId = props.dataId;

  if (saveBtn) {
    if (!icon) icon = <IconSave size={26} strokeWidth={1.5} />;
    if (!solid) solid = true;
    color = 'cta';
    if (!dataId) dataId = 'btn-save';
  }
  if (!color) color = 'text';

  const colorMap = {
    accent: 'var(--color-accent)',
    cta: 'var(--color-cta)',
    text: 'var(--color-text)',
  } as const;

  const buttonColor = colorMap[color];
  const sharedClassName =
    'group inline-flex items-center justify-center rounded-md border px-4 py-2 font-semibold transition-colors duration-150';
  const colorClasses = solid
    ? 'border-[color:var(--button-color)] bg-[color:var(--button-color)] text-[color:var(--color-bg)] hover:bg-transparent hover:text-[color:var(--button-color)]'
    : 'border-[color:var(--button-color)] text-[color:var(--button-color)] hover:bg-[color:var(--button-color)] hover:text-[color:var(--color-bg)]';
  const style = {
    '--button-color': buttonColor,
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
      {icon && (
        <span
          className="mr-2 inline-flex align-middle"
          style={{ fontSize: '1.35em', lineHeight: 1 }}
          aria-hidden="true"
        >
          {icon}
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
        data-id={dataId}
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
      data-id={dataId}
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
