<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DamageRowsListDemo from './DamageRowsList.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/DamageRowsList',
    component: DamageRowsListDemo,
  });
</script>

<Story name="Default" />
