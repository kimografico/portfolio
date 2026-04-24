import type { IconProps } from '../../types/icons';

export function IconCamera({
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
      className={`icon icon-tabler icon-tabler-camera ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 8l.01 0" />
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M9 21h6" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
