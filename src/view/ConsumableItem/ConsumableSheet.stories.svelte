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

<Story name="Potion" args={{ consumableType: 'potion' }} />
<Story name="Poison" args={{ consumableType: 'poison' }} />
<Story name="Scroll" args={{ consumableType: 'scroll' }} />
<Story name="Food" args={{ consumableType: 'food' }} />
