import type { IconProps } from '../../types/icons';

export function LogoAjax({ size = 24, color = 'url(#SVGID_1_)', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 170.1 170.1"
      fill={color}
      {...props}
    >
      <defs>
        <linearGradient
          id="SVGID_1_"
          gradientUnits="userSpaceOnUse"
          x1="85.0394"
          y1="167.5069"
          x2="85.0394"
          y2="6.9248"
          gradientTransform="matrix(1 0 0 -1 0 171.3682)"
        >
          <stop offset="0" style={{ stopColor: '#70B0DF' }} />
          <stop offset="0.5" style={{ stopColor: '#1B81C5' }} />
          <stop offset="1" style={{ stopColor: '#4A98CE' }} />
        </linearGradient>
      </defs>
      <path
        d="M71.5,5.1c-14,0-25.3,11.3-25.3,25.3v62.7l-0.8,0L32.9,82.6l-9.7,10.1l32,32l32.6-32L76.5,82.6L65.9,93.2
	l-1.2,0V32.1c0-7.8,6.3-14,14-14h11.1c7.8,0,14,6.3,14,14v6.5h21.7v-8.1c0-14-11.3-25.3-25.3-25.3H71.5z M114.9,45.3l-32.6,32
	l11.2,10.1l10.6-10.7l1.2,0V138c0,7.8-6.3,14-14,14H80.2c-7.8,0-14-6.3-14-14v-6.5H44.5v8.1c0,14,11.3,25.3,25.3,25.3h28.8
	c14,0,25.3-11.3,25.3-25.3V76.9l0.8,0l12.4,10.6l9.7-10.1L114.9,45.3L114.9,45.3z"
      />
    </svg>
  );
}
