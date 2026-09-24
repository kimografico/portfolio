import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/components/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Montar public en la raíz: las rutas de assets (/images/...) coinciden con el
  // dominio raíz y con las rutas basename-free que guardan los JSONs.
  staticDirs: [{ from: '../public', to: '/' }],
};

export default config;
