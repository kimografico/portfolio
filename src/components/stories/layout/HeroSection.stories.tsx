import type { Meta, StoryObj } from '@storybook/react-vite';
import HeroSection from '../../layout/HeroSection';

const meta = {
  title: 'layout/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroSection>;

export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    label: 'Portfolio — 2026',
    title: 'Kimografico',
    description: 'Diseño gráfico y desarrollo web con una mirada visual cuidada.',
    ctas: [
      { label: 'Ver diseño gráfico', href: '/graphic-design' },
      { label: 'Ver desarrollo', href: '/dev' },
    ],
    decorator: '01',
    image: '/images/storybook/project-card-demo.svg',
    separator: 'var(--color-border)',
  },
};

export const WithoutImage: Story = {
  args: {
    label: 'Portfolio — 2026',
    title: 'Kimografico',
    description: 'Una versión sin imagen para ver el decorator.',
    ctas: [{ label: 'Ir al inicio', href: '/' }],
    decorator: '02',
  },
};
