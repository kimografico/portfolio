import type { Meta, StoryObj } from '@storybook/react-vite';
import ProjectLine from '../../ui/ProjectLine';

const meta: Meta<typeof ProjectLine> = {
  title: 'ui/ProjectLine',
  component: ProjectLine,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof ProjectLine>;

export const Default: Story = {
  args: {
    num: '01',
    title: 'Proyecto de ejemplo',
    tipo: 'Web',
    year: '2024',
    href: '#',
  },
};
