import type { Meta, StoryObj } from '@storybook/react-vite';
import ScrollToTop from '../../layout/ScrollToTop';

const meta = {
  title: 'layout/ScrollToTop',
  component: ScrollToTop,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ScrollToTop>;

export default meta;

type Story = StoryObj<typeof ScrollToTop>;

export const Default: Story = {
  render: () => <div className="p-8 text-sm text-muted">ScrollToTop no renderiza UI visible.</div>,
};
