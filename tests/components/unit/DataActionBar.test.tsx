import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DataActionBar from '../../../src/components/compositions/DataActionBar';

describe('DataActionBar', () => {
  it('muestra el contador correcto y dispara las acciones principales', async () => {
    const onMarkHidden = vi.fn();
    const onMarkVisible = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <DataActionBar
        selectedCount={1}
        loading={false}
        error=""
        onMarkHidden={onMarkHidden}
        onMarkVisible={onMarkVisible}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByText('1 proyecto seleccionado')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ocultos/i }));
    fireEvent.click(screen.getByRole('button', { name: /visibles/i }));
    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(onMarkHidden).toHaveBeenCalledOnce();
    expect(onMarkVisible).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('muestra el estado de carga y el mensaje de error cuando corresponde', () => {
    render(
      <DataActionBar
        selectedCount={3}
        loading
        error="No se pudo guardar"
        onMarkHidden={vi.fn()}
        onMarkVisible={vi.fn()}
        onDelete={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('3 proyectos seleccionados')).toBeInTheDocument();
    expect(screen.getByText('Guardando…')).toBeInTheDocument();
    expect(screen.getByText(/no se pudo guardar/i)).toBeInTheDocument();
  });
});
