import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard, BaseProject } from '../src/components/ui/ProjectCard';
import { BrowserRouter } from 'react-router-dom';
import type { IconProps } from '../src/types/icons';

describe('ProjectCard', () => {
  const DummyIcon = ({ size = 24 }: IconProps) => (
    <svg data-testid="dummy-icon" width={size} height={size} />
  );
  const stackIconMap = { REACT: DummyIcon };

  const baseProject: BaseProject = {
    id: '123',
    date: '2024-01-01',
    title: 'Test Project',
    cliente: 'Test Client',
    imagenes: [{ image: '/portfolio/images/portfolio/original.jpg' }],
    stack: ['REACT'],
  };

  function renderCard(project = baseProject, props = {}) {
    return render(
      <BrowserRouter>
        <ProjectCard
          project={project}
          to="/project/123"
          stackIconMap={stackIconMap}
          IconFallback={DummyIcon}
          {...props}
        />
      </BrowserRouter>,
    );
  }

  it('muestra la miniatura si existe', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('thumbs/123.jpg'));
  });

  it('usa la imagen original si la miniatura falla', () => {
    // En entorno real, el navegador dispara onError si la miniatura no existe.
    // En test, hay que simularlo manualmente:
    const project = {
      ...baseProject,
      id: 'no-thumb',
      imagenes: [{ image: '/portfolio/images/portfolio/original.jpg' }],
    };
    renderCard(project);
    const img = screen.getByRole('img');
    // Simula error de carga de la miniatura
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', expect.stringContaining('original.jpg'));
  });

  it('usa el fallback si la miniatura falla', () => {
    const project = {
      ...baseProject,
      id: 'broken-thumb',
      imagenes: [{ image: '/portfolio/images/portfolio/original.jpg' }],
    };
    renderCard(project);
    const img = screen.getByRole('img');
    // Simula error de carga
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', expect.stringContaining('original.jpg'));
  });

  it('añade data-id a la imagen', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('data-id', 'project-card-123-thumb');
  });
});
