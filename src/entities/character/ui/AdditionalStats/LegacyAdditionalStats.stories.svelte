<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LegacyAdditionalStatsDemo from './LegacyAdditionalStats.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/LegacyAdditionalStats',
    component: LegacyAdditionalStatsDemo,
  });
</script>

<Story name="Default" />
