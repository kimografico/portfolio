import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ContactMe from '../../../src/pages/ContactMe/ContactMe';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

describe('ContactMe', () => {
  it('muestra el hero y las tres cards de contacto', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ContactMe />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /hablemos de.*tu próximo proyecto/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /abrir formulario/i })).toHaveAttribute(
      'href',
      'https://forms.gle/jvyMugYjDNhX1f1fA',
    );
    expect(screen.getByRole('link', { name: /ver currículum de diseño/i })).toHaveAttribute(
      'href',
      '/resume/design',
    );
    expect(screen.getByRole('link', { name: /ver currículum de desarrollo/i })).toHaveAttribute(
      'href',
      '/resume/development',
    );
  });
});
