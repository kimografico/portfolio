import type { Meta, StoryObj } from '@storybook/react-vite';

import ProjectCarousel from '../../compositions/ProjectCarousel';
import carouselData from '../../../data/carousel.json';
import type { CarouselImage } from '../../../interfaces/carousel';

const meta = {
  title: 'compositions/ProjectCarousel',
  component: ProjectCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    dataId: { table: { disable: true } },
  },
} satisfies Meta<typeof ProjectCarousel>;

export default meta;

type Story = StoryObj<typeof ProjectCarousel>;

const images = carouselData as CarouselImage[];

export const Default: Story = {
  args: {
    images,
    height: 320,
  },
};

export const FullWidth: Story = {
  args: {
    images,
    height: 320,
    fullWidth: true,
  },
};

export const SingleImage: Story = {
  args: {
    images: [images[0]],
    height: 320,
  },
};
