import * as React from 'react';

export function IconWorld({
  size = 24,
  color = 'currentColor',
  stroke = 2,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number; color?: string; stroke?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 8h-2a2 2 0 0 0 -2 2a2 2 0 1 1 -4 0v-1a2 2 0 0 0 -2 -2h-1a2 2 0 0 1 -2 -2v-.5" />
      <path d="M3 12h3a2 2 0 0 1 2 2v.5a1.5 1.5 0 0 0 1.5 1.5a1.5 1.5 0 0 1 1.5 1.5v3.25" />
      <path d="M15 20.5v-3.5a2 2 0 0 1 2 -2h3.5" />
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    </svg>
  );
}
