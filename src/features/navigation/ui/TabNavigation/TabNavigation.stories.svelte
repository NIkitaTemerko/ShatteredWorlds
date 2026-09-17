<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TabNavigationDemo from './TabNavigation.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/TabNavigation',
    component: TabNavigationDemo,
  });
</script>

<Story name="Default" />
