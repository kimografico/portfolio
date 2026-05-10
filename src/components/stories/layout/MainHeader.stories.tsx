import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import MainHeader from '../../layout/MainHeader';

const meta = {
  title: 'layout/MainHeader',
  component: MainHeader,
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
} satisfies Meta<typeof MainHeader>;

export default meta;

type Story = StoryObj<typeof MainHeader>;

export const Default: Story = {};
