import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from '../../../src/components/ui/ProjectCard';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

function DemoIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <svg data-testid="demo-icon" className={className} width={size} height={size} />;
}

describe('ProjectCard', () => {
  it('renderiza el proyecto como enlace con su miniatura y stack', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ProjectCard
          project={{
            id: 7,
            date: '2026-01-15',
            title: 'Proyecto destacado',
            cliente: 'Cliente demo',
            thumb: '/thumbs/demo.jpg',
            stack: ['React'],
          }}
          to="/demo/proyecto-destacado"
          webProject
          stackIconMap={{ REACT: DemoIcon }}
          IconFallback={DemoIcon}
          dataId="project-card-demo"
        />
        ,
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /proyecto destacado/i });
    expect(link).toHaveAttribute('href', '/demo/proyecto-destacado');
    expect(link).toHaveAttribute('data-id', 'project-card-demo');

    expect(screen.getByAltText('Proyecto destacado')).toBeInTheDocument();
    expect(screen.getByText('Proyecto destacado')).toBeInTheDocument();
    expect(screen.getByText(/cliente demo/i)).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
    expect(screen.getByTestId('demo-icon')).toBeInTheDocument();
  });
});
