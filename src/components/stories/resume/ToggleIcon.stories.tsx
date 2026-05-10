import type { Meta, StoryObj } from '@storybook/react-vite';
import ToggleIcon from '../../resume/ToggleIcon';
import IconVisible from '../../iconos/IconVisible';
import IconHidden from '../../iconos/IconHidden';

const meta = {
  title: 'resume/ToggleIcon',
  component: ToggleIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'boolean' },
    onChange: { table: { disable: true } },
    dataId: { table: { disable: true } },
    ariaLabelOn: { table: { disable: true } },
    ariaLabelOff: { table: { disable: true } },
  },
} satisfies Meta<typeof ToggleIcon>;

export default meta;

type Story = StoryObj<typeof ToggleIcon>;

export const VisibleOn: Story = {
  args: {
    value: true,
    onChange: () => undefined,
    icon: IconVisible,
    iconOff: IconHidden,
    colorOn: 'var(--color-cta)',
    size: 32,
    dataId: 'toggle-icon-visible',
    ariaLabelOn: 'Visible',
    ariaLabelOff: 'Oculto',
  },
};

export const HiddenOff: Story = {
  args: {
    value: false,
    onChange: () => undefined,
    icon: IconVisible,
    iconOff: IconHidden,
    colorOn: 'var(--color-cta)',
    size: 32,
    dataId: 'toggle-icon-hidden',
    ariaLabelOn: 'Visible',
    ariaLabelOff: 'Oculto',
  },
};
