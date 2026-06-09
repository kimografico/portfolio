import type { Meta, StoryObj } from '@storybook/react-vite';

import CarouselManager from '../../compositions/CarouselManager';
import carouselData from '../../../data/carousel.json';

/**
 * CarouselManager — panel de administración del carrusel de la home.
 *
 * Gracias a la prop `initialImages`, las stories no necesitan mockear fetch ni
 * tener el backend arrancado: el componente usa esos datos directamente.
 */
const meta = {
  title: 'compositions/CarouselManager',
  component: CarouselManager,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CarouselManager>;

export default meta;
type Story = StoryObj<typeof CarouselManager>;

/** Carga las imágenes actuales del carousel.json */
export const Default: Story = {
  args: {
    initialImages: carouselData,
  },
};

/** Sin imágenes — muestra el estado inicial vacío */
export const Empty: Story = {
  args: {
    initialImages: [],
  },
};

/** Tres imágenes de ejemplo para ver el componente en funcionamiento */
export const ThreeExamples: Story = {
  args: {
    initialImages: [
      {
        src: '/portfolio/images/portfolio/design/etiquetas/rediseno002.jpg',
        alt: 'Odin Doble Miel',
      },
      {
        src: '/portfolio/images/portfolio/design/proyectos-especiales/baraja-lbg002.jpg',
        alt: 'Baraja LBG',
      },
      {
        src: '/portfolio/images/portfolio/web/wordpress/colordmar001.jpg',
        alt: 'Web ColorDeMar',
      },
    ],
  },
};
