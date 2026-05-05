import type { IconProps } from '../../types/icons';

export function IconMap({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
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
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
      <path d="M9 12v.01" />
      <path d="M6 13v.01" />
      <path d="M17 15l-4 -4" />
      <path d="M13 15l4 -4" />
    </svg>
  );
}
