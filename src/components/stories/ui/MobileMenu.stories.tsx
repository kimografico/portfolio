import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import MobileMenu from '../../ui/MobileMenu';

const meta = {
  title: 'ui/MobileMenu',
  component: MobileMenu,
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
} satisfies Meta<typeof MobileMenu>;

export default meta;

type Story = StoryObj<typeof MobileMenu>;

export const Default: Story = {
  args: {
    navLinks: [
      { label: 'Inicio', href: '/' },
      { label: 'Diseño Gráfico', href: '/graphic-design' },
      { label: 'Desarrollo', href: '/developer' },
    ],
  },
};
