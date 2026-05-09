import type { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from '../../ui/EmptyState';

const meta = {
  title: 'ui/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    description: {
      control: 'text',
    },
    emoji: {
      control: 'text',
    },
    dataId: {
      control: 'text',
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    description: 'Esta sección se está preparando y estará disponible muy pronto.',
    emoji: '🚧',
    dataId: 'empty-state-story',
  },
};

export const WithCustomEmoji: Story = {
  args: {
    description: 'Aquí se mostrarán los contenidos cuando estén listos.',
    emoji: '✨',
    dataId: 'empty-state-custom-emoji',
  },
};
