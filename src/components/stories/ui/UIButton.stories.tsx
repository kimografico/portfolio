import type { Meta, StoryObj } from '@storybook/react-vite';

import UIButton from '../../ui/UIButton';

const meta = {
  title: 'UI/UIButton',
  component: UIButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    href: '#',
    children: 'Ver proyecto',
    arrow: true,
    dataId: 'ui-button-story',
  },
  argTypes: {
    href: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
    arrow: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
    dataId: {
      control: 'text',
    },
  },
} satisfies Meta<typeof UIButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutArrow: Story = {
  args: {
    arrow: false,
    children: 'Abrir enlace',
  },
};

export const InkVariant: Story = {
  args: {
    href: '/kimo',
    children: 'Explorar Kimo',
    className: 'btn-outline-ink',
  },
};
