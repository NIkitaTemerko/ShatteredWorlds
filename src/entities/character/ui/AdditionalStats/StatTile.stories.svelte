<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatTileDemo from './StatTile.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/StatTile',
    component: StatTileDemo,
  });
</script>

<Story name="Default" />
