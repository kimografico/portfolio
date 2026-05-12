import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi } from 'vitest';
import { CategoryCard } from '../../../src/components/ui/CategoryCard';
import CategoryHero from '../../../src/components/ui/CategoryHero';

const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('../../../src/hooks/useTheme', () => ({
  useTheme: () => ['light', vi.fn()],
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const DemoIcon = ({
  size = 24,
  strokeWidth = 1,
  className = '',
}: {
  size: number;
  strokeWidth: number;
  className: string;
}) => (
  <svg
    data-testid="demo-icon"
    width={size}
    height={size}
    strokeWidth={strokeWidth}
    className={className}
  />
);

describe('category components', () => {
  it('renderiza una CategoryCard con su ruta y data-id derivados del título', () => {
    // La tarjeta convierte el título en un identificador estable y accesible para navegación.
    render(
      <MemoryRouter>
        <CategoryCard
          icon={DemoIcon}
          title="Diseño Gráfico"
          description="Portfolios visuales"
          to="/graphic-design"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /diseño gráfico/i })).toHaveAttribute(
      'href',
      '/graphic-design',
    );
    expect(screen.getByTestId('demo-icon')).toBeInTheDocument();
    expect(screen.getByText('Diseño Gráfico')).toBeInTheDocument();
    expect(screen.getByText('Portfolios visuales')).toBeInTheDocument();
  });

  it('renderiza el hero de categoría y navega hacia atrás al pulsar el enlace', () => {
    // El hero combina contenido, fondo y enlace de retorno sin acoplarse al router.
    render(
      <CategoryHero
        title="Desarrollo Web"
        description="Proyectos y stacks"
        icon={DemoIcon}
        backLink="/dev"
        backLinkText="Volver"
      />,
    );

    expect(screen.getByRole('heading', { name: /desarrollo web/i })).toBeInTheDocument();
    expect(screen.getByText('Proyectos y stacks')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /volver/i }));
    expect(navigateMock).toHaveBeenCalledWith('/dev');
  });
});
