import React from 'react';
export type IconSkullProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};
export function IconSkull({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}: IconSkullProps) {
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
      className={`icon icon-tabler icon-tabler-skull ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 4c4.418 0 8 3.358 8 7.5c0 1.901 -.755 3.637 -2 4.96l0 2.54a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-2.54c-1.245 -1.322 -2 -3.058 -2 -4.96c0 -4.142 3.582 -7.5 8 -7.5" />
      <path d="M10 17v3" />
      <path d="M14 17v3" />
      <path d="M8 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M14 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    </svg>
  );
}
