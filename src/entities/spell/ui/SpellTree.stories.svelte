<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SpellTreeDemo from './SpellTree.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/SpellTree',
    component: SpellTreeDemo,
  });
</script>

<Story name="Default" />
