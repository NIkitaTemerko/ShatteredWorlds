<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import UsesControlDemo from './UsesControl.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/UsesControl',
    component: UsesControlDemo,
  });
</script>

<Story name="Default" />
