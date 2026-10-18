<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import type { EquipmentSystem } from '../../../documents/Item/types/EquipmentDataTypes';
  import { SheetDescription } from '../../../shared/ui';
  import { getUpdateEquipment } from '../utils/updateEquipment';
  import EquipmentBonuses from './EquipmentBonuses.svelte';
  import EquipmentHeader from './EquipmentHeader.svelte';
  import EquipmentStats from './EquipmentStats.svelte';
  import LinkedItems from './LinkedItems.svelte';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const system = $derived(item.system as EquipmentSystem);
  const updateEquipment = $derived(getUpdateEquipment(item));
</script>

<div class="equipment-card">
  <EquipmentHeader {item} />
  <EquipmentStats {item} />
  <SheetDescription
    bind:value={system.description}
    onchange={(value) => updateEquipment('description', value)}
  />
  <EquipmentBonuses {item} />
  <LinkedItems {item} />
</div>

<style>
  .equipment-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    background: transparent;
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
