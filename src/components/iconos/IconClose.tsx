import React from 'react';
import type { IconProps } from '../../types/icons';

/**
 * IconClose: Círculo con una X en el centro, para botones de cerrar.
 * Props: size (px), color (stroke), strokeWidth, className
 */
export default function IconClose({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </svg>
  );
}
