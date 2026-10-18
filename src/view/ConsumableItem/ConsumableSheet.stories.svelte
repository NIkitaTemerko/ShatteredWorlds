<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ConsumableSheetDemo from './ConsumableSheet.demo.svelte';

  const { Story } = defineMeta({
    title: 'Sheets/Consumable',
    component: ConsumableSheetDemo,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default" />
