import { addons } from 'storybook/manager-api';

addons.setConfig({
  sidebar: {
    // Top-level titles (Sheets, Crystal, Widgets) render as separate root sections.
    showRoots: true,
  },
});
