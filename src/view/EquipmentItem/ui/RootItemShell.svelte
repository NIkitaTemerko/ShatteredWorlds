<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import ItemShell from '../../ItemSheet/ui/ItemShell.svelte';
  let { item }: { item: ShwItem } = $props();
</script>

<ItemShell {item} />
