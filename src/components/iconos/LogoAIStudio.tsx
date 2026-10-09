import type { IconProps } from '../../interfaces/ui';

export function LogoAIStudio({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (461.4 / 464.4)}
      viewBox="0 0 464.4 461.4"
      {...props}
    >
      <defs>
        <radialGradient
          id="logoAIStudioA"
          cx="44.9524"
          cy="407.0074"
          r="309.5949"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#3186FF" />
          <stop offset="0.1058" stopColor="#3686FA" />
          <stop offset="0.2382" stopColor="#4386EA" />
          <stop offset="0.3848" stopColor="#5A87D1" />
          <stop offset="0.5418" stopColor="#7A87AD" />
          <stop offset="0.707" stopColor="#A2887F" />
          <stop offset="0.8764" stopColor="#D38848" />
          <stop offset="1" stopColor="#FB891B" />
        </radialGradient>
        <radialGradient
          id="logoAIStudioB"
          cx="382.9524"
          cy="38.0075"
          r="247.5237"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#3186FF" />
          <stop offset="1" stopColor="#00B95C" />
        </radialGradient>
      </defs>
      <path
        fill="url(#logoAIStudioA)"
        d="M282,224.2L30.2,355.3c-51.9,27-32.8,106,25.6,106l283.5,0.1c69,0,125-56.2,125-125.7 C464.4,241.5,365.2,180.8,282,224.2z"
      />
      <path
        fill="url(#logoAIStudioB)"
        d="M182.4,237.2l251.8-131.1 c51.9-27,32.8-106-25.6-106L125,0C56,0,0,56.2,0,125.7C0,219.9,99.3,280.5,182.4,237.2z"
      />
    </svg>
  );
}
