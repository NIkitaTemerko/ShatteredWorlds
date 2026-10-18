<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CharacterSheetDemo from './CharacterSheet.demo.svelte';

  const { Story } = defineMeta({
    title: 'Sheets/Character',
    component: CharacterSheetDemo,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default" />
