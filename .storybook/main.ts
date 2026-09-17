import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  stories: [
    '../src/shared/ui/**/*.stories.svelte',
    '../src/features/**/*.stories.svelte',
    '../src/entities/**/*.stories.svelte',
  ],
  addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/svelte-vite',
    options: {
      builder: {
        viteConfigPath: '.storybook/vite.config.ts',
      },
    },
  },
  // Foundry ships Font Awesome; Storybook needs it for icon glyphs in shared UI.
  previewHead: (head) => `
    ${head}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
  `,
};

export default config;
