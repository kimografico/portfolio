import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import KimoLogin from '../../../src/components/compositions/KimoLogin';

describe('KimoLogin', () => {
  it('muestra el formulario con mensajes opcionales', () => {
    // Este componente concentra el acceso a la zona privada de forma clara y accesible.
    render(
      <KimoLogin
        password=""
        notice="Recuerda el hash correcto"
        error=""
        isSubmitting={false}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: /acceso a kimo/i })).toBeInTheDocument();
    expect(screen.getByText('Recuerda el hash correcto')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument();
  });

  it('propaga cambios de contraseña y submit', () => {
    // El test verifica el flujo básico del formulario: escribir y enviar.
    const onPasswordChange = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());

    render(
      <KimoLogin
        password=""
        error="Error"
        isSubmitting
        onPasswordChange={onPasswordChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'abc' } });
    expect(onPasswordChange).toHaveBeenCalledWith('abc');
    expect(screen.getByRole('button', { name: /comprobando/i })).toBeDisabled();
  });
});
