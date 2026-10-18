import type { Preview } from '@storybook/svelte';
import '@fontsource-variable/tektur/wght.css';
import '../src/shared/ui/tokens.css';
import './foundry-stubs';
import './foundry-fa-pro-shim.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        // Keep Sheets as its own top-level sidebar root, first in the tree.
        order: ['Sheets', 'Crystal', 'Widgets'],
      },
    },
    backgrounds: {
      default: 'crystal-slab',
      values: [
        { name: 'crystal-slab', value: '#12101a' },
        { name: 'surface', value: '#1c1828' },
      ],
    },
  },
};

export default preview;
