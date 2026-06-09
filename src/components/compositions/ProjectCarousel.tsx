import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectCarouselProps } from '../../interfaces/carousel';
import '../../styles/components/projectCarousel.css';

const AUTOPLAY_INTERVAL_MS = 4500;
const TRANSITION_DURATION_MS = 900;

export default function ProjectCarousel({
  images,
  fullWidth = false,
  height,
  ariaLabel = 'Carrusel de proyectos',
  dataId = 'project-carousel',
}: ProjectCarouselProps) {
  const validImages = useMemo(() => images.filter((image) => image.src.trim() !== ''), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isCurrentVisible, setIsCurrentVisible] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (validImages.length <= 1) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(currentIndex);
      setCurrentIndex((currentIndex + 1) % validImages.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentIndex, validImages.length]);

  useEffect(() => {
    if (previousIndex === null) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(null);
    }, TRANSITION_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [previousIndex]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    setIsCurrentVisible(false);

    const animationFrameId = window.requestAnimationFrame(() => {
      setIsCurrentVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [currentIndex]);

  if (validImages.length === 0) {
    return null;
  }

  const currentSlideIndex = currentIndex % validImages.length;
  const previousSlideIndex = previousIndex === null ? null : previousIndex % validImages.length;

  const shellClassName = fullWidth ? 'w-full' : 'w-full max-w-7xl mx-auto px-6 md:px-12';
  const frameClassName = fullWidth
    ? 'w-full'
    : 'w-full rounded-[24px] bg-white p-3 shadow-[0_18px_45px_rgba(0,0,0,0.08)] ring-1 ring-black/5';
  const viewportClassName = fullWidth
    ? 'project-carousel__viewport rounded-none'
    : 'project-carousel__viewport rounded-[18px]';
  const sectionClassName = fullWidth ? '' : 'my-6 md:my-8';

  const displayedIndices =
    previousSlideIndex === null || previousSlideIndex === currentSlideIndex
      ? [currentSlideIndex]
      : [previousSlideIndex, currentSlideIndex];

  return (
    <section aria-label={ariaLabel} className={sectionClassName} data-id={dataId}>
      <div className={shellClassName} data-id={`${dataId}-shell`}>
        <div className={frameClassName} data-id={`${dataId}-frame`}>
          <div
            className={viewportClassName}
            style={{ height: `${height}px` }}
            data-id={`${dataId}-viewport`}
          >
            {displayedIndices.map((index, position) => {
              const image = validImages[index];
              const isActive = index === currentSlideIndex;
              const shouldAnimateIn = isActive && !isCurrentVisible;

              return (
                <img
                  key={`${image.src}-${index}`}
                  src={image.src}
                  alt={image.alt}
                  draggable={false}
                  decoding="async"
                  className={`project-carousel__image ${
                    isActive
                      ? shouldAnimateIn
                        ? 'project-carousel__image--active project-carousel__image--entering'
                        : 'project-carousel__image--active'
                      : 'project-carousel__image--exiting'
                  }`}
                  data-id={`${dataId}-image-${position}`}
                  data-carousel-state={isActive ? 'active' : 'exiting'}
                  loading={isActive ? 'eager' : 'lazy'}
                  style={{ zIndex: isActive ? 1 : 2 }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
