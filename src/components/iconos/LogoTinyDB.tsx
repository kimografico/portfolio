import type { IconProps } from '../../interfaces/ui';

export function LogoTinyDB({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (108.6 / 87)}
      viewBox="0 0 87 108.6"
      {...props}
    >
      <rect x="11.2" y="9.5" width="75.8" height="99.1" fill="#343F4A" />
      <rect width="75.8" height="99.1" fill="#587896" />
    </svg>
  );
}
