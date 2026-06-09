import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MyClients from '../../../src/components/compositions/MyClients';
import type { ClientEntry } from '../../../src/components/compositions/MyClients';

// ─── Mock de clients.json ─────────────────────────────────────────────────────
// Evita que el test dependa de los datos reales del JSON.

vi.mock('../../../src/data/clients.json', () => ({
  default: [
    { name: 'Alpha.jpg', rate: 1 },
    { name: 'Beta.jpg', rate: 1 },
    { name: 'Gamma.jpg', rate: 0 }, // rate=0: nunca debe aparecer
  ],
}));

// ─── Datos de prueba ──────────────────────────────────────────────────────────

const mockClients: ClientEntry[] = [
  { name: 'Logo-A.jpg', rate: 1 },
  { name: 'Logo-B.jpg', rate: 1 },
  { name: 'Logo-C.jpg', rate: 0 }, // excluido
  { name: 'Logo-D.jpg', rate: 3 }, // alta frecuencia en random
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MyClients', () => {
  beforeEach(() => {
    // Resetear mocks entre tests para evitar contaminación entre ellos
    vi.clearAllMocks();
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renderiza el contenedor principal con data-id', () => {
    // El proyecto usa data-id en vez de data-testid → usamos querySelector
    const { container } = render(<MyClients clients={mockClients} />);
    expect(container.querySelector('[data-id="my-clients"]')).not.toBeNull();
  });

  it('renderiza el track con data-id', () => {
    const { container } = render(<MyClients clients={mockClients} />);
    expect(container.querySelector('[data-id="my-clients-track"]')).not.toBeNull();
  });

  it('excluye logos con rate=0 de la lista visible', () => {
    render(<MyClients clients={mockClients} />);
    // Logo-C tiene rate=0 → su alt no debe aparecer en el DOM
    const images = screen.getAllByRole('img');
    const alts = images.map((img) => img.getAttribute('alt'));
    expect(alts.every((alt) => alt !== 'Logo C')).toBe(true);
  });

  it('duplica los logos para el loop infinito', () => {
    // 3 logos visibles (A, B, D) × 2 copias = 6 imágenes en el DOM
    render(<MyClients clients={mockClients} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(6);
  });

  it('pausa la animación al hacer mouseenter en el contenedor', () => {
    const { container } = render(<MyClients clients={mockClients} />);
    const track = container.querySelector('[data-id="my-clients-track"]') as HTMLElement;
    const wrapper = container.querySelector('[data-id="my-clients"]') as HTMLElement;

    // Estado inicial: animación corriendo
    expect(track.style.animationPlayState).toBe('running');

    // Hover sobre el componente
    fireEvent.mouseEnter(wrapper);
    expect(track.style.animationPlayState).toBe('paused');
  });

  it('reanuda la animación al hacer mouseleave', () => {
    const { container } = render(<MyClients clients={mockClients} />);
    const track = container.querySelector('[data-id="my-clients-track"]') as HTMLElement;
    const wrapper = container.querySelector('[data-id="my-clients"]') as HTMLElement;

    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);
    expect(track.style.animationPlayState).toBe('running');
  });

  it('aplica animationDirection "reverse" cuando rewind=true', () => {
    const { container } = render(<MyClients clients={mockClients} rewind />);
    const track = container.querySelector('[data-id="my-clients-track"]') as HTMLElement;
    expect(track.style.animationDirection).toBe('reverse');
  });

  it('aplica animationDirection "normal" cuando rewind=false (default)', () => {
    const { container } = render(<MyClients clients={mockClients} />);
    const track = container.querySelector('[data-id="my-clients-track"]') as HTMLElement;
    expect(track.style.animationDirection).toBe('normal');
  });

  it('todas las imágenes tienen loading="lazy"', () => {
    render(<MyClients clients={mockClients} />);
    const images = screen.getAllByRole('img');
    expect(images.every((img) => img.getAttribute('loading') === 'lazy')).toBe(true);
  });

  it('ninguna imagen es arrastrable', () => {
    render(<MyClients clients={mockClients} />);
    const images = screen.getAllByRole('img');
    expect(images.every((img) => img.getAttribute('draggable') === 'false')).toBe(true);
  });

  it('usa los datos del JSON mockeado si no se pasan clientes por prop', () => {
    render(<MyClients />);
    // Alpha (rate=1) y Beta (rate=1) visibles; Gamma (rate=0) excluido
    // 2 logos × 2 copias = 4 imágenes
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
  });

  it('en modo random no hay logos duplicados', () => {
    // Logo-D tiene rate=3 pero con weighted shuffle aparece solo una vez
    // 3 logos visibles (A, B, D) × 2 copias de loop = 6 imágenes; sin triplicados
    render(<MyClients clients={mockClients} randomize />);
    const images = screen.getAllByRole('img');
    // Primera mitad = lista única de logos visibles
    const firstHalfAlts = Array.from(images)
      .slice(0, images.length / 2)
      .map((img) => img.getAttribute('alt'));
    const uniqueAlts = new Set(firstHalfAlts);
    expect(uniqueAlts.size).toBe(firstHalfAlts.length);
  });

  it('en modo random los logos con rate=0 no aparecen', () => {
    render(<MyClients clients={mockClients} randomize />);
    const images = screen.getAllByRole('img');
    const alts = images.map((img) => img.getAttribute('alt'));
    expect(alts.every((alt) => alt !== 'Logo C')).toBe(true);
  });

  it('aplica filter none en light mode', () => {
    window.localStorage.setItem('theme', 'light');
    const { container } = render(<MyClients clients={mockClients} />);
    const logo = container.querySelector('img');
    expect(logo?.style.filter).toBe('none');
  });

  it('aplica filter invert en dark mode', () => {
    window.localStorage.setItem('theme', 'dark');
    const { container } = render(<MyClients clients={mockClients} />);
    const logo = container.querySelector('img');
    expect(logo?.style.filter).toBe('invert(1)');
  });

  it('aplica opacity personalizada a los logos', () => {
    const { container } = render(<MyClients clients={mockClients} opacity={0.5} />);
    const logo = container.querySelector('img');
    expect(logo?.style.opacity).toBe('0.5');
  });

  it('opacity por defecto es 1', () => {
    const { container } = render(<MyClients clients={mockClients} />);
    const logo = container.querySelector('img');
    expect(logo?.style.opacity).toBe('1');
  });

  it('acepta speed sin decimales', () => {
    expect(() => render(<MyClients clients={mockClients} speed={60} />)).not.toThrow();
  });
});
