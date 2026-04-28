import type { IconProps } from '../../types/icons';

export function IconPieceOfEight({
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
      <path d="M12,1.2C6,1.2,1.2,6,1.2,12S6,22.8,12,22.8S22.8,18,22.8,12S18,1.2,12,1.2z" />
      <path d="M19.3,15.3c0.5-1,0.7-2.1,0.7-3.3s-0.3-2.3-0.7-3.3" />
      <path d="M4.7,8.7C4.2,9.7,4,10.8,4,12s0.3,2.3,0.7,3.3" />
      <path d="M15.3,4.7C14.3,4.2,13.2,4,12,4S9.7,4.2,8.7,4.7" />
      <path d="M8.7,19.3c1,0.5,2.1,0.7,3.3,0.7s2.3-0.3,3.3-0.7" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="20" y1="12" x2="4" y2="12" />
      <path d="M7.4,8.4c0,0.6,0.4,1,1,1s1-0.4,1-1s-0.4-1-1-1S7.4,7.9,7.4,8.4" />
      <path d="M14.6,15.6c0,0.6,0.4,1,1,1s1-0.4,1-1s-0.4-1-1-1S14.6,15,14.6,15.6" />
      <rect x="14.5" y="7.4" width="2.1" height="2.1" />
      <rect x="7.4" y="14.5" width="2.1" height="2.1" />
    </svg>
  );
}
