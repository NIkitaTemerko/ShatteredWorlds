<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatDetailAdjustableValueDemo from './StatDetailAdjustableValue.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/StatDetailAdjustableValue',
    component: StatDetailAdjustableValueDemo,
  });
</script>

<Story name="Default" />
