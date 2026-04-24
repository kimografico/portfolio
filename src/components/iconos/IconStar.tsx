import type { IconProps } from '../../types/icons';

export function IconStar({
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
      className={`icon icon-tabler icon-tabler-star ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 17.75l-6.172 3.247l1.179-6.873l-5-4.873l6.9-1l3.093-6.26l3.093 6.26l6.9 1l-5 4.873l1.179 6.873z" />
    </svg>
  );
}
