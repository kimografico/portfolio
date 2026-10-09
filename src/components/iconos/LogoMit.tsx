import type { IconProps } from '../../interfaces/ui';

export function LogoMit({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 500 500"
      {...props}
    >
      <defs>
        <clipPath id="logoMitClip">
          <path d="M147 212h206v77H147v-77z" />
        </clipPath>
      </defs>
      <path d="m250 212 52 30 51 29v119l-51 30-52 30-52-30-51-30V271l51-29z" fill="#f78d35" />
      <path
        d="m146 51 52 30 51 29v119l-51 30-51 29c-14-18-38-31-67-37l-37-22V110l51-29 52-30z"
        fill="#92267c"
      />
      <path
        d="m352 51 52 30 51 29v119l-38 22c-28 6-51 20-65 38l-51-30-52-30V110l52-29 51-30z"
        fill="#a4ce47"
      />
      <path
        d="M50 229c73 0 132 45 132 101 0 41-32 76-78 92l-11-19c41-12 69-41 69-75 0-44-50-80-112-80-14 0-28 2-40 5L0 237c16-5 33-8 50-8z"
        fill="#f78d35"
      />
      <path
        d="M160 181h43l7 14 14 24h-16l-14-23h-26zM338 181h-42l-8 14-14 24h16l14-23h26z"
        fill="#fff"
      />
      <path
        d="M450 229c-73 0-132 45-132 101 0 41 32 76 78 92l11-19c-41-12-69-41-69-75 0-44 50-80 112-80 14 0 28 2 40 5l10-16c-16-5-33-8-50-8z"
        fill="#f78d35"
      />
      <g clipPath="url(#logoMitClip)">
        <ellipse cx="250" cy="289" rx="103" ry="77" fill="#fff" />
      </g>
      <path d="M147 212h206v77H147z" fill="none" />
      <circle cx="224" cy="258" r="10" fill="#59585a" />
      <circle cx="275" cy="258" r="10" fill="#59585a" />
      <path d="M147 309h206.173v20.1954H147zM147 349h206.173v20.1954H147z" fill="#59585a" />
    </svg>
  );
}
