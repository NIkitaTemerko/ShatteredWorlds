<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AttributeStatCellDemo from './AttributeStatCell.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/AttributeStatCell',
    component: AttributeStatCellDemo,
  });
</script>

<Story name="Default" />
