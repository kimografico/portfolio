import type { Meta, StoryObj } from '@storybook/react-vite';
import UIButton from '../../ui/UIButton';
import { IconSkate } from '../../iconos/IconSkate';

const meta = {
  title: 'UI/UIButton',
  component: UIButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    arrow: {
      control: 'boolean',
    },
    color: {
      control: 'inline-radio',
      options: ['accent', 'cta', 'text'],
    },
    dataId: {
      control: 'text',
    },
  },
} satisfies Meta<typeof UIButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'button',
    children: 'Botón por defecto',
    dataId: 'btn-default',
  },
};

export const WithLinkArrow: Story = {
  args: {
    href: '/kimo',
    children: 'Explorar Kimo',
    arrow: true,
    dataId: 'btn-link-arrow',
  },
};

export const SolidAccent: Story = {
  args: {
    type: 'button',
    children: 'Solid Accent',
    color: 'accent',
    solid: true,
    dataId: 'btn-solid-accent',
  },
};

export const WithCustomIcon: Story = {
  args: {
    type: 'button',
    children: 'Con icono custom',
    icon: <IconSkate size={26} strokeWidth={1.5} />,
    dataId: 'btn-custom-icon',
  },
};

export const WithCtaColor: Story = {
  args: {
    type: 'button',
    children: 'Botón CTA',
    color: 'cta',
    dataId: 'btn-cta-color',
  },
};

export const SaveButton: Story = {
  args: {
    type: 'button',
    children: 'Guardar',
    saveBtn: true,
  },
};
