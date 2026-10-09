import type { IconProps } from '../../interfaces/ui';

export function LogoKotlin({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      {...props}
    >
      <defs>
        <linearGradient
          id="logoKotlinGradient"
          x1="500.003"
          x2="-0.097"
          y1="579.106"
          y2="1079.206"
          gradientTransform="translate(15.534 -96.774) scale(.1939)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.003" stopColor="#e44857" />
          <stop offset="0.469" stopColor="#c711e1" />
          <stop offset="1" stopColor="#7f52ff" />
        </linearGradient>
      </defs>
      <path fill="url(#logoKotlinGradient)" d="M112.484 112.484H15.516V15.516h96.968L64 64Zm0 0" />
    </svg>
  );
}
