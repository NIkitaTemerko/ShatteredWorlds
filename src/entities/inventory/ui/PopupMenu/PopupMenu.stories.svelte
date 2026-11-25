<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PopupMenuDemo from './PopupMenu.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/PopupMenu',
    component: PopupMenuDemo,
  });
</script>

<Story name="Dropdown" />
