<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EquipmentTreeDemo from './EquipmentTree.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/EquipmentTree',
    component: EquipmentTreeDemo,
  });
</script>

<Story name="Default" />
