import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import RecentProjectsSection from '../../layout/RecentProjectsSection';

const meta = {
  title: 'layout/RecentProjectsSection',
  component: RecentProjectsSection,
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
} satisfies Meta<typeof RecentProjectsSection>;

export default meta;

type Story = StoryObj<typeof RecentProjectsSection>;

export const Default: Story = {
  args: {
    projects: [
      { num: '01', title: 'Proyecto editorial', tipo: 'Editorial', year: '2025', href: '/a' },
      { num: '02', title: 'Proyecto web', tipo: 'Web', year: '2024', href: '/b' },
      { num: '03', title: 'Proyecto branding', tipo: 'Branding', year: '2023', href: '/c' },
    ],
  },
};
