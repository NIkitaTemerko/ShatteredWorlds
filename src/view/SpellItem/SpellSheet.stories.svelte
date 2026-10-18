<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SpellSheetDemo from './SpellSheet.demo.svelte';

  const { Story } = defineMeta({
    title: 'Sheets/Spell',
    component: SpellSheetDemo,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default" />
