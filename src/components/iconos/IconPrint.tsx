import React from 'react';
export type IconPrintProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};
export function IconPrint({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}: IconPrintProps) {
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
      className={`icon icon-tabler icon-tabler-printer ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 9v-4a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4" />
      <rect x="6" y="13" width="12" height="8" rx="2" />
      <path d="M6 17h12" />
    </svg>
  );
}
