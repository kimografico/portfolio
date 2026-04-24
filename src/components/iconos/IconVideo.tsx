import React from 'react';
export type IconVideoProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};
export function IconVideo({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}: IconVideoProps) {
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
      className={`icon icon-tabler icon-tabler-video ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 7v10" />
      <path d="M17 7v10" />
      <path d="M10 10l4 2l-4 2z" />
    </svg>
  );
}
