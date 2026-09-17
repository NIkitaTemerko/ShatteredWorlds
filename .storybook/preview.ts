import type { Preview } from '@storybook/svelte';
import '@fontsource-variable/tektur/wght.css';
import '../src/shared/ui/tokens.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
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
