import type { IconProps } from '../../interfaces/ui';

export function LogoOpencode({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (300 / 240)}
      viewBox="0 0 240 300"
      fill="none"
      {...props}
    >
      <g clipPath="url(#logoOpencodeClip)">
        <mask
          id="logoOpencodeMask"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="240"
          height="300"
        >
          <path d="M240 0H0V300H240V0Z" fill="white" />
        </mask>
        <g mask="url(#logoOpencodeMask)">
          <path d="M180 240H60V120H180V240Z" fill="#4B4646" />
          <path d="M180 60H60V240H180V60ZM240 300H0V0H240V300Z" fill="#F1ECEC" />
        </g>
      </g>
      <defs>
        <clipPath id="logoOpencodeClip">
          <rect width="240" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
