import type { Meta, StoryObj } from '@storybook/react-vite';
import ImageLightbox from '../../ui/ImageLightbox';

const meta = {
  title: 'ui/ImageLightbox',
  component: ImageLightbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
  },
} satisfies Meta<typeof ImageLightbox>;

export default meta;

type Story = StoryObj<typeof ImageLightbox>;

export const Open: Story = {
  args: {
    open: true,
    src: '/images/portfolio/no-cover.jpg',
    alt: 'Imagen de ejemplo',
    onClose: () => undefined,
  },
};

export const Closed: Story = {
  args: {
    open: false,
    src: '/images/portfolio/no-cover.jpg',
    alt: 'Imagen de ejemplo',
    onClose: () => undefined,
  },
};
