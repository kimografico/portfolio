import type { Meta, StoryObj } from '@storybook/react-vite';
import DataActionBar from '../../compositions/DataActionBar';

const meta = {
  title: 'compositions/DataActionBar',
  component: DataActionBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DataActionBar>;

export default meta;

type Story = StoryObj<typeof DataActionBar>;

export const Default: Story = {
  args: {
    selectedCount: 3,
    loading: false,
    error: '',
    onMarkHidden: () => undefined,
    onMarkVisible: () => undefined,
    onDelete: () => undefined,
    onCancel: () => undefined,
  },
};

export const WithError: Story = {
  args: {
    selectedCount: 1,
    loading: false,
    error: 'Error al actualizar',
    onMarkHidden: () => undefined,
    onMarkVisible: () => undefined,
    onDelete: () => undefined,
    onCancel: () => undefined,
  },
};
