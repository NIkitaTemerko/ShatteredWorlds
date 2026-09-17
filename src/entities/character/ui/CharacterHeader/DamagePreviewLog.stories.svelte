<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DamagePreviewLogDemo from './DamagePreviewLog.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/DamagePreviewLog',
    component: DamagePreviewLogDemo,
  });
</script>

<Story name="Default" />
