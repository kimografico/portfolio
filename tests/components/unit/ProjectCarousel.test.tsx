import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import ProjectCarousel from '../../../src/components/compositions/ProjectCarousel';

const images = [
  { src: '/portfolio/images/portfolio/thumbs/270.jpg', alt: 'Proyecto 1' },
  { src: '/portfolio/images/portfolio/thumbs/261.jpg', alt: 'Proyecto 2' },
  { src: '/portfolio/images/portfolio/thumbs/213.jpg', alt: 'Proyecto 3' },
];

describe('ProjectCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza el carrusel enmarcado con su data-id', () => {
    const { container } = render(<ProjectCarousel images={images} height={320} />);

    expect(container.querySelector('[data-id="project-carousel"]')).toBeInTheDocument();
    expect(container.querySelector('[data-id="project-carousel-frame"]')).toBeInTheDocument();
  });

  it('permite el modo full-width sin marco blanco', () => {
    const { container } = render(<ProjectCarousel images={images} height={320} fullWidth />);

    const frame = container.querySelector('[data-id="project-carousel-frame"]');
    expect(frame).toHaveClass('w-full');
    expect(frame).not.toHaveClass('p-3');
  });

  it('rota las imágenes en bucle', () => {
    render(<ProjectCarousel images={images} height={320} />);

    expect(screen.getByRole('img', { name: 'Proyecto 1' })).toHaveAttribute(
      'data-carousel-state',
      'active',
    );

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.getByRole('img', { name: 'Proyecto 2' })).toHaveAttribute(
      'data-carousel-state',
      'active',
    );

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.getByRole('img', { name: 'Proyecto 3' })).toHaveAttribute(
      'data-carousel-state',
      'active',
    );
  });
});
