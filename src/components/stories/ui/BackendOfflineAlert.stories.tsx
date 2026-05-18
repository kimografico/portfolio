import type { Meta, StoryObj } from '@storybook/react-vite';
import BackendOfflineAlert from '../../ui/BackendOfflineAlert';
import BackendStatusContext from '../../../contexts/BackendStatusContext';

const meta = {
  title: 'UI/BackendOfflineAlert',
  component: BackendOfflineAlert,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BackendOfflineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

const OfflineWrapper = () => (
  <BackendStatusContext.Provider value={{ alive: false, checking: false, check: async () => true }}>
    <div style={{ width: 720 }}>
      <BackendOfflineAlert />
    </div>
  </BackendStatusContext.Provider>
);

export const Offline: Story = {
  render: () => <OfflineWrapper />,
};

const OnlineWrapper = () => (
  <BackendStatusContext.Provider value={{ alive: true, checking: false, check: async () => true }}>
    <div style={{ width: 720 }}>
      <BackendOfflineAlert />
    </div>
  </BackendStatusContext.Provider>
);

export const Online: Story = {
  render: () => <OnlineWrapper />,
};
