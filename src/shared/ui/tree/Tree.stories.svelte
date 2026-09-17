<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TreeDemo from './Tree.demo.svelte';

  const { Story } = defineMeta({
    title: 'Crystal/Tree',
    component: TreeDemo,
  });
</script>

<Story name="WithSearch" args={{ variant: 'search' }} />
<Story name="FontIcons" args={{ variant: 'fontIcons' }} />
<Story name="ImageIcons" args={{ variant: 'imageIcons' }} />
<Story name="DeepNesting" args={{ variant: 'deepNesting' }} />
<Story name="EditDelete" args={{ variant: 'editDelete' }} />
<Story name="ContextMenu" args={{ variant: 'contextMenu' }} />
<Story name="InventoryLike" args={{ variant: 'inventoryLike' }} />
