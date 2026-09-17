<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RollPanelDemo from './RollPanel.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/RollPanel',
    component: RollPanelDemo,
  });
</script>

<Story name="Default" />
