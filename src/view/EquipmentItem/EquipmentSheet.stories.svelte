<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EquipmentSheetDemo from './EquipmentSheet.demo.svelte';

  const { Story } = defineMeta({
    title: 'Sheets/Equipment',
    component: EquipmentSheetDemo,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default" />
