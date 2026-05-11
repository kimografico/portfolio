import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

describe('PendientePage', () => {
  beforeEach(() => {
    window.localStorage.setItem('kimo-authenticated', 'true');
  });

  it('renderiza la sección y la tabla de proyectos pendientes', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/kimo/pendiente']}>
        <App />
      </MemoryRouter>,
    );

    expect(container.querySelector('[data-id="pending-page"]')).toBeInTheDocument();
    expect(container.querySelector('[data-id="pending-table"]')).toBeInTheDocument();
    expect(container.querySelector('[data-id^="pending-detail-btn-"]')).toBeInTheDocument();
  });
});
