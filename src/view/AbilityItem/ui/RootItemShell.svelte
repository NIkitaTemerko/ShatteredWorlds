<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import type {
    AbilityCategory,
    ActiveAbilityKind,
    PassiveAbilityKind,
  } from '../../../documents/Item/types/AbilityDataTypes';
  import { SheetDescription } from '../../../shared/ui';
  import { getUpdateAbility } from '../utils/updateAbility';
  import AbilityBasicStats from './AbilityBasicStats.svelte';
  import AbilityHeader from './AbilityHeader.svelte';
  import ActiveAbilityDetails from './ActiveAbilityDetails.svelte';
  import PassiveAbilityDetails from './PassiveAbilityDetails.svelte';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateAbility = $derived(getUpdateAbility(item));

  function handleCategoryChange(category: AbilityCategory, event?: Event) {
    updateAbility('category', category, event);
  }

  function handleKindChange(kind: ActiveAbilityKind | PassiveAbilityKind, event?: Event) {
    updateAbility('kind', kind, event);
  }

  function handleUpdate(path: string, value: any) {
    updateAbility(path, value);
  }
</script>

<div class="ability-card">
  <AbilityHeader {item} onCategoryChange={handleCategoryChange} onKindChange={handleKindChange} />
  <AbilityBasicStats {item} onUpdate={handleUpdate} />
  <SheetDescription
    bind:value={item.system.description}
    onchange={(value) => updateAbility('description', value)}
  />
  <ActiveAbilityDetails {item} onUpdate={handleUpdate} />
  <PassiveAbilityDetails {item} onUpdate={handleUpdate} />
</div>

<style>
  .ability-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    background: transparent;
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
