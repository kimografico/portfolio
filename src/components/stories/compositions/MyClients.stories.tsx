import type { Meta, StoryObj } from '@storybook/react-vite';
import MyClients from '../../compositions/MyClients';
import type { ClientEntry } from '../../compositions/MyClients';

// ─── Mock data ───────────────────────────────────────────────────────────────

/**
 * Lista reducida de clientes para las stories.
 * En producción el componente lee src/data/clients.json automáticamente.
 */
const mockClients: ClientEntry[] = [
  { name: 'Decathlon.jpg', rate: 3 },
  { name: 'Leroy-Merlin.jpg', rate: 1 },
  { name: 'UPV.jpg', rate: 1 },
  { name: 'Generalitat.jpg', rate: 1 },
  { name: 'La-Salle.jpg', rate: 0 },
  { name: 'Port-Valencia.jpg', rate: 1 },
  { name: 'Tragsa.jpg', rate: 1 },
  { name: 'Saica.jpg', rate: 1 },
  { name: 'Tyris.jpg', rate: 1 },
  { name: 'Casmara.jpg', rate: 1 },
  { name: 'Norauto.jpg', rate: 1 },
  { name: 'Yunsey.jpg', rate: 1 },
];

/**
 * Lista con rates variados para demostrar la ponderación en modo random.
 * - Decathlon (rate=3) → aparece 3 veces en el pool aleatorio
 * - Saica     (rate=0) → nunca aparece
 */
const weightedClients: ClientEntry[] = [
  { name: 'Decathlon.jpg', rate: 3 },
  { name: 'Leroy-Merlin.jpg', rate: 2 },
  { name: 'UPV.jpg', rate: 1 },
  { name: 'Generalitat.jpg', rate: 1 },
  { name: 'La-Salle.jpg', rate: 2 },
  { name: 'Saica.jpg', rate: 0 }, // rate=0: excluido siempre
  { name: 'Tyris.jpg', rate: 1 },
  { name: 'Casmara.jpg', rate: 3 },
  { name: 'Norauto.jpg', rate: 1 },
  { name: 'Port-Valencia.jpg', rate: 2 },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<typeof MyClients> = {
  title: 'compositions/MyClients',
  component: MyClients,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Carrusel horizontal infinito de logos de clientes.

**Props:**
- \`speed\` — píxeles/segundo (default: 30). Más alto = más rápido.
- \`randomize\` — mezcla aleatoria ponderada por \`rate\` (default: false).
- \`rewind\` — invierte la dirección del scroll (default: false).
- \`clients\` — array de clientes; si se omite usa \`clients.json\`.

**rate:**  0 = nunca · 1 = normal · 2-3 = más frecuente (sólo en modo random)
        `,
      },
    },
  },
  // Wrapper con padding y fondo neutro para que los logos se vean bien
  decorators: [
    (Story) => (
      <div className="bg-[var(--color-bg)] p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MyClients>;

// ─── Stories ─────────────────────────────────────────────────────────────────

/**
 * Configuración por defecto: velocidad 30 px/s, orden original, izquierda → derecha.
 */
export const Default: Story = {
  args: {
    speed: 30,
    randomize: false,
    rewind: false,
    clients: mockClients,
  },
};

/**
 * Dirección invertida: los logos se mueven de izquierda a derecha.
 * Útil para apilar dos carruseles en sentidos opuestos.
 */
export const Rewind: Story = {
  args: {
    speed: 30,
    randomize: false,
    rewind: true,
    clients: mockClients,
  },
};

/**
 * Modo aleatorio con ponderación por rate.
 * Decathlon (rate=3) y Casmara (rate=3) aparecen más.
 * Saica (rate=0) queda excluido.
 * Cada render del story produce un orden distinto.
 */
export const Randomize: Story = {
  args: {
    speed: 30,
    randomize: true,
    rewind: false,
    clients: weightedClients,
  },
};

/**
 * Velocidad alta (120 px/s): ideal para ver el efecto de pausa en hover.
 */
export const HighSpeed: Story = {
  args: {
    speed: 120,
    randomize: false,
    rewind: false,
    clients: mockClients,
  },
};
