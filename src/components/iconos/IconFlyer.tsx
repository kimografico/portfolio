import type { IconProps } from '../../interfaces/ui';

export function IconFlyer({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon-tabler icon-tabler-brand-superhuman ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 12l4 3l-8 7l-8 -7l4 -3" />
      <path d="M12 3l-8 6l8 6l8 -6l-8 -6" />
      <path d="M12 15h8" />
    </svg>
  );
}
