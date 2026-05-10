import type { Meta, StoryObj } from '@storybook/react-vite';
import ImageLightbox from '../../ui/ImageLightbox';
import { useState } from 'react';

type PlaygroundArgs = StoryObj<typeof ImageLightbox>['args'];
function PlaygroundStory(args?: PlaygroundArgs) {
  const [open, setOpen] = useState(false);
  const src = args?.src ?? '/images/books/el-quinto-dia.jpg';
  const alt = args?.alt ?? 'El quinto día';
  return (
    <div style={{ minHeight: 300 }}>
      <button
        type="button"
        style={{
          padding: '0.5rem 1rem',
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          margin: 32,
        }}
        onClick={() => setOpen(true)}
      >
        Abrir lightbox
      </button>
      <ImageLightbox {...args} src={src} alt={alt} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

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
    src: '/images/books/el-quinto-dia.jpg',
    alt: 'El quinto día',
    onClose: () => undefined,
  },
};

export const Playground = {
  render: PlaygroundStory,
  args: {
    src: '/images/books/el-quinto-dia.jpg',
    alt: 'El quinto día',
  },
};
