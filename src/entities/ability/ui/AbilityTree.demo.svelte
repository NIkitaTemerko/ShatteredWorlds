<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { mapAbilitiesToFlatItems } from '../model/mappers';
  import { updateAbilityTreeState } from '../model/abilityTreeState';
  import AbilityTree from './AbilityTree.svelte';

  const items = [
    { id: 'a1', name: 'Strike', type: 'ability', system: { category: 'active' } },
    { id: 'a2', name: 'Guard', type: 'ability', system: { category: 'passive' } },
    { id: 'a3', name: 'Dash', type: 'ability', system: { category: 'active' } },
  ] as unknown as ShwItem[];

  const actorId = 'story-abilities';
  const flat = mapAbilitiesToFlatItems(items);
  updateAbilityTreeState(actorId, {
    expandedIds: new Set(flat.map((item) => item.path[0]).filter(Boolean)),
  });
</script>

<div class="frame">
  <AbilityTree
    {actorId}
    {items}
    abilityCount={items.length}
    onSelectAbility={(item) => console.log('select', item.name)}
    onDeleteAbility={(item) => console.log('delete', item.name)}
  />
</div>

<style>
  .frame {
    width: min(22rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
