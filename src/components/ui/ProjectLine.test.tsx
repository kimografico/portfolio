import { render, screen } from '@testing-library/react';
import ProjectLine from './ProjectLine';

describe('ProjectLine', () => {
  it('renderiza los datos del proyecto correctamente', () => {
    render(
      <ProjectLine
        num="01"
        title="Proyecto de prueba"
        tipo="Web"
        year="2024"
        href="/proyecto-prueba"
        animationDelay="120ms"
      />,
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Proyecto de prueba')).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    // El icono flecha debe estar presente
    expect(screen.getByText('→')).toBeInTheDocument();
    // El enlace debe tener el href correcto
    expect(screen.getByRole('link')).toHaveAttribute('href', '/proyecto-prueba');
  });
});
