<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import type { SpellCategory, SpellKind } from '../../../documents/Item/types/SpellDataTypes';
  import { SheetDescription } from '../../../shared/ui';
  import { getUpdateSpell } from '../utils/updateSpell';
  import SpellBasicStats from './SpellBasicStats.svelte';
  import SpellDetails from './SpellDetails.svelte';
  import SpellHeader from './SpellHeader.svelte';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateSpell = $derived(getUpdateSpell(item));

  function handleCategoryChange(category: SpellCategory, event?: Event) {
    updateSpell('category', category, event);
  }

  function handleKindChange(kind: SpellKind, event?: Event) {
    updateSpell('spellKind', kind, event);
  }

  function handleUpdate(path: string, value: any) {
    updateSpell(path, value);
  }
</script>

<div class="spell-card">
  <SpellHeader {item} onCategoryChange={handleCategoryChange} onKindChange={handleKindChange} />
  <SpellBasicStats {item} onUpdate={handleUpdate} />
  <SheetDescription
    bind:value={item.system.description}
    onchange={(value) => updateSpell('description', value)}
  />
  <SpellDetails {item} onUpdate={handleUpdate} />
</div>

<style>
  .spell-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    background: transparent;
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
