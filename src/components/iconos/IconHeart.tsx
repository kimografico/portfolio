import React from 'react';
export type IconHeartProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};
export function IconHeart({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}: IconHeartProps) {
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
      className={`icon icon-tabler icon-tabler-heart ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 20l-8 -7a5 5 0 0 1 8 -7a5 5 0 0 1 8 7z" />
    </svg>
  );
}
