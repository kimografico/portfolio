import type { Preview } from '@storybook/react-vite';

import '../src/styles/index.css';
import '../src/styles/components/buttonStyles.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
    },
  },
};

export default preview;
