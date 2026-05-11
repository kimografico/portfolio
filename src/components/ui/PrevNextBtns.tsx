interface PrevNextBtnsProps {
  onPrev: () => void;
  onNext: () => void;
  disabledPrev?: boolean;
  disabledNext?: boolean;
}

/**
 * Botones redondos para navegación anterior/siguiente.
 * Se usan en IllustrationDetailPage, pero son reutilizables.
 */
export default function PrevNextBtns({
  onPrev,
  onNext,
  disabledPrev = false,
  disabledNext = false,
}: PrevNextBtnsProps) {
  return (
    <div className="flex gap-2 ml-auto" data-id="prev-next-btns-wrapper">
      <button
        type="button"
        aria-label="Anterior ilustración"
        disabled={disabledPrev}
        onClick={onPrev}
        className={`w-10 h-10 aspect-square rounded-full flex items-center justify-center transition-colors duration-150 border border-border text-lg ${disabledPrev ? 'opacity-20 cursor-not-allowed' : 'hover:bg-accent/10 text-accent'}`}
        data-id="prev-btn"
      >
        {/* Flecha izquierda SVG */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16L8 10L13 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Siguiente ilustración"
        disabled={disabledNext}
        onClick={onNext}
        className={`w-10 h-10 aspect-square rounded-full flex items-center justify-center transition-colors duration-150 border border-border text-lg ${disabledNext ? 'opacity-20 cursor-not-allowed' : 'hover:bg-accent/10 text-accent'}`}
        data-id="next-btn"
      >
        {/* Flecha derecha SVG */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 4L12 10L7 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
