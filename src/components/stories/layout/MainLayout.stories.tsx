import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';

function MainLayoutDemo() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<div className="p-8">Contenido de ejemplo</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const meta = {
  title: 'layout/MainLayout',
  component: MainLayoutDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MainLayoutDemo>;

export default meta;

type Story = StoryObj<typeof MainLayoutDemo>;

export const Default: Story = {};
