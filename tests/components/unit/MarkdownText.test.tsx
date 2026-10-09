import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkdownText } from '../../../src/components/ui/MarkdownText';

describe('MarkdownText', () => {
  it('renderiza párrafos con formato básico', () => {
    render(<MarkdownText text={'Texto **importante** y *enfatizado*.'} />);

    expect(screen.getByText('importante').tagName).toBe('STRONG');
    expect(screen.getByText('enfatizado').tagName).toBe('EM');
  });

  it('renderiza enlaces http en pestaña nueva con rel seguro', () => {
    render(<MarkdownText text={'Visita [mi web](https://example.com).'} />);

    const link = screen.getByRole('link', { name: 'mi web' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('neutraliza enlaces con protocolos distintos de http/https', () => {
    const { container } = render(<MarkdownText text={'[peligro](javascript:alert)'} />);

    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link).toHaveTextContent('peligro');
    expect(link).not.toHaveAttribute('href', 'javascript:alert');
    expect(link).toHaveAttribute('href', '');
  });

  it('convierte los saltos de línea simples en <br />', () => {
    const { container } = render(<MarkdownText text={'Línea 1\nLínea 2'} />);

    expect(container.querySelectorAll('br').length).toBeGreaterThan(0);
  });

  it('devuelve null cuando no hay texto', () => {
    const { container } = render(<MarkdownText />);

    expect(container).toBeEmptyDOMElement();
  });
});
