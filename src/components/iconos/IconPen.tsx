import type { IconProps } from '../../types/icons';

export function IconPen({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.3139,
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
      <circle cx="2.8" cy="2.8" r="0.8" />
      <circle cx="21.2" cy="2.8" r="0.8" />
      <line x1="3.6" y1="2.8" x2="20.4" y2="2.8" />
      <rect x="2" y="11" width="1.7" height="1.7" />
      <rect x="20.3" y="11" width="1.7" height="1.7" />
      <path d="M21.2,12c0-5.1-4.1-9.2-9.2-9.2S2.8,6.9,2.8,12" />
      <path d="M11.7,12.7c-0.3,0.1-0.5,0.4-0.5,0.7c0,0.5,0.4,0.8,0.8,0.8s0.8-0.4,0.8-0.8c0-0.3-0.2-0.6-0.5-0.7" />
      <path d="M14.4,19.4c0.5,0,0.8-0.4,0.8-0.8v0c0-0.5-0.4-0.8-0.8-0.8l1.8-4.3l-3.8-6.7l0,6" />
      <path d="M9.6,19.4c-0.5,0-0.8-0.4-0.8-0.8v0c0-0.5,0.4-0.8,0.8-0.8l-1.8-4.3l3.8-6.7l0,6" />
      <rect x="9.6" y="19.4" width="4.8" height="2.6" />
      <line x1="9.6" y1="17.7" x2="14.4" y2="17.7" />
    </svg>
  );
}
