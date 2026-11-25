<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { mapSpellsToFlatItems } from '../model/mappers';
  import { updateSpellTreeState } from '../model/spellTreeState';
  import SpellTree from './SpellTree.svelte';

  const items = [
    { id: 's1', name: 'Spark', type: 'spell', system: { category: 'elemental' } },
    { id: 's2', name: 'Ward', type: 'spell', system: { category: 'holy' } },
    { id: 's3', name: 'Cipher', type: 'spell', system: { category: 'code' } },
  ] as unknown as ShwItem[];

  const actorId = 'story-spells';
  const flat = mapSpellsToFlatItems(items);
  updateSpellTreeState(actorId, {
    expandedIds: new Set(flat.map((item) => item.path[0]).filter(Boolean)),
  });
</script>

<div class="frame">
  <SpellTree
    {actorId}
    {items}
    spellCount={items.length}
    onSelectSpell={(item) => console.log('select', item.name)}
    onDeleteSpell={(item) => console.log('delete', item.name)}
  />
</div>

<style>
  .frame {
    width: min(22rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
