import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { IconCode } from '../../iconos/IconCode';
import { IconPlant } from '../../iconos/IconPlant';
import { CategoryCard } from '../../ui/CategoryCard';

const meta = {
  title: 'ui/CategoryCard',
  component: CategoryCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    to: {
      control: 'text',
    },
    hoverColor: {
      control: 'text',
    },
  },
} satisfies Meta<typeof CategoryCard>;

export default meta;

type Story = StoryObj<typeof CategoryCard>;

export const Design: Story = {
  args: {
    icon: IconPlant,
    title: 'Diseño Gráfico',
    description: 'Cartelería, editorial, packaging y piezas visuales.',
    to: '/graphic-design',
    hoverColor: 'var(--color-design)',
  },
};

export const Development: Story = {
  args: {
    icon: IconCode,
    title: 'Desarrollo',
    description: 'Proyectos web, frontend y soluciones digitales.',
    to: '/developer',
    hoverColor: 'var(--color-dev)',
  },
};
