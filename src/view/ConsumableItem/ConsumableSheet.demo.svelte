<script lang="ts">
  import ItemSheetDemo from '../ItemSheet/ItemSheet.demo.svelte';
  import type { ConsumableType } from '../../documents/Item/types/ConsumableDataTypes';
  let { consumableType = 'bomb' }: { consumableType?: ConsumableType } = $props();
</script>

<ItemSheetDemo kind="consumable" {consumableType} />
