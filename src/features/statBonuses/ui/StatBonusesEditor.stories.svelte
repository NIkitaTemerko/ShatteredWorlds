<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatBonusesEditorDemo from './StatBonusesEditor.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/StatBonusesEditor',
    component: StatBonusesEditorDemo,
  });
</script>

<Story name="Default" />
