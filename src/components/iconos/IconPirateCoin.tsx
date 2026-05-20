import type { IconProps } from '../../interfaces/ui';

export function IconPirateCoin({
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
      <path d="M14.8,19.5c1.1-0.4,2-1,2.8-1.8c0.8-0.8,1.4-1.8,1.8-2.8" />
      <path d="M9.2,4.5c-1.1,0.4-2,1-2.8,1.8S4.9,8.2,4.5,9.2" />
      <path d="M19.5,9.2c-0.4-1.1-1-2-1.8-2.8s-1.8-1.5-2.8-1.8" />
      <path d="M4.5,14.8c0.4,1.1,1,2,1.8,2.8c0.8,0.8,1.8,1.4,2.8,1.8" />
      <g>
        <path
          d="M19.6,4.4c-4.2-4.2-11-4.2-15.3,0c-4.2,4.2-4.2,11,0,15.3c4.2,4.2,11,4.2,15.3,0C23.9,15.4,23.9,8.6,19.6,4.4
			z M16.8,12c0,1.3-0.5,2.5-1.4,3.4l2.3,2.3l-2.3-2.3c-0.9,0.9-2.1,1.4-3.4,1.4c-1.3,0-2.5-0.5-3.4-1.4l-2.3,2.3l2.3-2.3
			c-0.9-0.9-1.4-2.1-1.4-3.4s0.5-2.5,1.4-3.4L6.3,6.3l2.3,2.3c0.9-0.9,2.1-1.4,3.4-1.4s2.5,0.5,3.4,1.4l2.3-2.3l-2.3,2.3
			C16.3,9.5,16.8,10.7,16.8,12z"
        />
      </g>
      <circle cx="10.1" cy="11.4" r="0.8" />
      <circle cx="13.9" cy="11.4" r="0.8" />
      <line x1="7.7" y1="14.2" x2="16.3" y2="14.2" />
      <circle cx="12" cy="4.1" r="0.4" />
      <circle cx="12" cy="19.9" r="0.4" />
      <circle cx="19.9" cy="12" r="0.4" />
      <circle cx="4.1" cy="12" r="0.4" />
      <line x1="13.1" y1="14.2" x2="13.1" y2="16.7" />
      <line x1="10.9" y1="14.2" x2="10.9" y2="16.7" />
    </svg>
  );
}
