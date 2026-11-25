<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AbilityTreeDemo from './AbilityTree.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/AbilityTree',
    component: AbilityTreeDemo,
  });
</script>

<Story name="Default" />
