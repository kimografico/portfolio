import type { IconProps } from '../../interfaces/ui';

export function IconSpots({
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
      <path d="M9 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M14 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M4 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    </svg>
  );
}
