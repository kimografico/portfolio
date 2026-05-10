import type { Meta, StoryObj } from '@storybook/react-vite';
import VisitedWorldMap from '../../compositions/VisitedWorldMap';

const meta = {
  title: 'compositions/VisitedWorldMap',
  component: VisitedWorldMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof VisitedWorldMap>;

export default meta;

type Story = StoryObj<typeof VisitedWorldMap>;

export const Default: Story = {
  args: {
    height: 480,
    highlightedCountries: ['ES'],
    points: [
      { name: 'Valencia', lat: 39.4699, lon: -0.3763 },
      { name: 'París', lat: 48.8566, lon: 2.3522 },
    ],
  },
};
