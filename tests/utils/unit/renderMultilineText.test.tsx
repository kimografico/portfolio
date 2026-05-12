import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderMultilineText } from '../../../src/utils/renderMultilineText';

describe('renderMultilineText', () => {
  it('separa el texto en varias líneas usando <br />', () => {
    // El helper transforma saltos de línea en fragmentos JSX para reutilizarlo en la interfaz.
    render(<div>{renderMultilineText('Línea 1\nLínea 2\nLínea 3')}</div>);

    expect(screen.getByText('Línea 1')).toBeInTheDocument();
    expect(screen.getByText('Línea 2')).toBeInTheDocument();
    expect(screen.getByText('Línea 3')).toBeInTheDocument();
  });

  it('devuelve null cuando no hay texto', () => {
    // Si no llega contenido, el helper no renderiza nada y evita ruido en el DOM.
    const { container } = render(<>{renderMultilineText()}</>);

    expect(container).toBeEmptyDOMElement();
  });
});
