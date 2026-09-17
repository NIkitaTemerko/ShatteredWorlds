<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CoefficientCalculationPanelDemo from './CoefficientCalculationPanel.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/CoefficientCalculationPanel',
    component: CoefficientCalculationPanelDemo,
  });
</script>

<Story name="Default" />
