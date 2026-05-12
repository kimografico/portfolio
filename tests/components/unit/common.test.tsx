import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from '../../../src/components/ui/EmptyState';
import UIButton from '../../../src/components/ui/UIButton';
import ProjectLine from '../../../src/components/ui/ProjectLine';
import PrevNextBtns from '../../../src/components/ui/PrevNextBtns';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

describe('common UI components', () => {
  it('renderiza el estado vacío con contenido didáctico', () => {
    // Este componente se usa cuando una sección todavía no tiene datos.
    render(<EmptyState description="No hay contenido todavía" emoji="🧪" />);

    expect(screen.getByText('🧪')).toBeInTheDocument();
    expect(screen.getByText('Próximamente')).toBeInTheDocument();
    expect(screen.getByText('No hay contenido todavía')).toBeInTheDocument();
  });

  it('renderiza UIButton como botón o enlace según la prop href', () => {
    // UIButton cambia entre botón y enlace sin obligar al consumidor a duplicar estilos.
    const onClick = vi.fn();

    render(
      <>
        <UIButton onClick={onClick}>Acción</UIButton>
        <MemoryRouter future={routerFuture}>
          <UIButton href="/destino" link>
            Ir
          </UIButton>
        </MemoryRouter>
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Acción' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Ir' })).toHaveAttribute('href', '/destino');
  });

  it('aplica la variante saveBtn con icono y data-id por defecto', () => {
    // saveBtn centraliza el estilo del botón de guardar para evitar repetir configuración.
    render(
      <UIButton onClick={vi.fn()} saveBtn>
        Guardar
      </UIButton>,
    );

    expect(screen.getByRole('button', { name: /guardar/i })).toHaveAttribute('data-id', 'btn-save');
  });

  it('muestra una línea de proyecto y dispara navegación visualmente accesible', () => {
    // ProjectLine presenta el proyecto reciente como un enlace semántico.
    render(<ProjectLine num="01" title="Proyecto demo" tipo="Web" year="2026" href="/demo" />);

    expect(screen.getByRole('link', { name: /proyecto demo/i })).toHaveAttribute('href', '/demo');
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('renderiza los botones anterior/siguiente y respeta el estado disabled', () => {
    // Estos botones encapsulan la navegación secuencial sin repetir SVG ni estilos.
    const onPrev = vi.fn();
    const onNext = vi.fn();

    render(<PrevNextBtns onPrev={onPrev} onNext={onNext} disabledPrev disabledNext={false} />);

    const prev = screen.getByRole('button', { name: /anterior ilustración/i });
    const next = screen.getByRole('button', { name: /siguiente ilustración/i });

    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();

    fireEvent.click(next);
    expect(onNext).toHaveBeenCalledOnce();
  });
});
