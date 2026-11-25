<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AbilitySheetDemo from './AbilitySheet.demo.svelte';

  const { Story } = defineMeta({
    title: 'Sheets/Ability',
    component: AbilitySheetDemo,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default" />
