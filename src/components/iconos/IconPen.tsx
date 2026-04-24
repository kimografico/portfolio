import React from 'react';
export type IconPenProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};
export function IconPen({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}: IconPenProps) {
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
      className={`icon icon-tabler icon-tabler-pencil ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 6l3 3l-9 9h-3v-3z" />
      <path d="M18.5 5.5a2.121 2.121 0 1 1 3 3a2.121 2.121 0 0 1 -3 -3" />
    </svg>
  );
}
