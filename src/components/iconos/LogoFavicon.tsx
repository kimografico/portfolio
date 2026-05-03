export default LogoFavicon;
import type { IconProps } from '../../types/icons';

export function LogoFavicon({ size = 48, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100.1 58.8 40.7 38.3"
      width={size}
      height={size}
      fill="none"
      {...props}
    >
      <style>
        {`
          .brand-color { 
            fill: var(--color-accent, #BF5627); 
          }
          .text-color { 
            fill: var(--color-text, #1D1D1B); 
          }
          @media (prefers-color-scheme: dark) {
            .brand-color { 
              fill: var(--color-accent, #E67E4D); 
            }
            .text-color { 
              fill: var(--color-text, #FFFFFF); 
            }
          }
        `}
      </style>

      <g className="text-color">
        <path d="M116.4 89.8h-6.2v-24h6.2v9.4h3.1l5.4-9.4h6.5l-6.7 11.8l6.7 12.2h-6.5l-5.3-9.8h-3.1v9.8z" />
      </g>

      <g className="brand-color">
        <polygon points="100.1 97.1 100.1 58.8 110.3 58.8 110.3 61.3 104 61.3 104 94.6 110.3 94.6 110.3 97.1" />
        <polygon points="131.4 97.1 131.4 94.6 137 94.6 137 61.3 131.4 61.3 131.4 58.8 140.8 58.8 140.8 97.1" />
      </g>
    </svg>
  );
}
