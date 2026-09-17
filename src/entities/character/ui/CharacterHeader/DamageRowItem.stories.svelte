<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DamageRowItemDemo from './DamageRowItem.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/DamageRowItem',
    component: DamageRowItemDemo,
  });
</script>

<Story name="Default" />
