import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import MainFooter from '../../layout/MainFooter';

const meta = {
  title: 'layout/MainFooter',
  component: MainFooter,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MainFooter>;

export default meta;

type Story = StoryObj<typeof MainFooter>;

export const Default: Story = {};
