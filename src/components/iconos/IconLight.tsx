import React from 'react';
export type IconLightProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};
export function IconLight({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}: IconLightProps) {
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
      className={`icon icon-tabler icon-tabler-bulb ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="10" r="6" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
