<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MenuQuantityDemo from './MenuQuantity.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/MenuQuantity',
    component: MenuQuantityDemo,
  });
</script>

<Story name="Default" />
