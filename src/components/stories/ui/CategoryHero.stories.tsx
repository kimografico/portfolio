import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import CategoryHero from '../../ui/CategoryHero';
import { IconPlant } from '../../iconos/IconPlant';

const meta = {
  title: 'ui/CategoryHero',
  component: CategoryHero,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    backgroundImage: {
      control: 'text',
    },
    color: {
      control: 'text',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    backLink: {
      control: 'text',
    },
    backLinkText: {
      control: 'text',
    },
  },
} satisfies Meta<typeof CategoryHero>;

export default meta;

type Story = StoryObj<typeof CategoryHero>;

export const Default: Story = {
  args: {
    title: 'Diseño Gráfico',
    description: 'Explora una selección de trabajos visuales y proyectos editoriales.',
    icon: IconPlant,
    backLink: '/kimo',
    backLinkText: 'Volver al espacio Kimo',
    dataId: 'category-hero-story',
  },
};

export const WithoutBackLink: Story = {
  args: {
    title: 'Desarrollo',
    description: 'Proyectos web, aplicaciones y experimentación técnica.',
    icon: IconPlant,
    dataId: 'category-hero-no-back-link',
  },
};
