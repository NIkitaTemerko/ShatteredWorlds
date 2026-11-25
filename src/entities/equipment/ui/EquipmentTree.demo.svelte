<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { mapEquipmentToFlatItems } from '../model/mappers';
  import { updateEquipmentTreeState } from '../model/equipmentTreeState';
  import EquipmentTree from './EquipmentTree.svelte';

  const items = [
    {
      id: 'e1',
      name: 'Crystal Blade',
      type: 'equipment',
      system: { slot: 'one-hand', rarity: 'rare' },
    },
    {
      id: 'e2',
      name: 'Amethyst Cloak',
      type: 'equipment',
      system: { slot: 'cloak', rarity: 'uncommon' },
    },
  ] as unknown as ShwItem[];

  const actorId = 'story-equipment';
  const flat = mapEquipmentToFlatItems(items);
  updateEquipmentTreeState(actorId, {
    expandedIds: new Set(flat.map((item) => item.path[0]).filter(Boolean)),
  });
</script>

<div class="frame">
  <EquipmentTree
    {actorId}
    {items}
    itemCount={items.length}
    onSelectItem={(item) => console.log('select', item.name)}
    onUnequipItem={(item) => console.log('unequip', item.name)}
  />
</div>

<style>
  .frame {
    width: min(22rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
