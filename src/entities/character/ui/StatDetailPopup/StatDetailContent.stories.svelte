<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatDetailContentDemo from './StatDetailContent.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/StatDetailContent',
    component: StatDetailContentDemo,
  });
</script>

<Story name="Default" />
