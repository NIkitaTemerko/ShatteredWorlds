<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MenuActionDemo from './MenuAction.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/MenuAction',
    component: MenuActionDemo,
  });
</script>

<Story name="Default" />
