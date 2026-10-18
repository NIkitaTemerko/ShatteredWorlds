<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { SheetDescription } from '../../../shared/ui';
  import { typeColors } from '../constants/consumableConstats';
  import { getUpdateConsumable } from '../utils/updateConsumable';
  import BasicStats from './BasicStats.svelte';
  import BombStats from './BombStats.svelte';
  import ItemHeader from './ItemHeader.svelte';
  import Poison from './Poison.svelte';
  import PotionsAndFood from './PotionsAndFood.svelte';
  import Scroll from './Scroll.svelte';
  import UsesAndActivations from './UsesAndActivations.svelte';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const system = $derived.by(() => {
    if (!item.isConsumable()) throw new Error('Item is not a consumable');
    return item.system;
  });

  const updateConsumable = $derived(getUpdateConsumable(item));
</script>

<div
  class="consumable-card"
  style="--dark:{typeColors[system.consumableType]?.dark}; --light:{typeColors[system.consumableType]?.light}"
>
  <ItemHeader {item} />
  <BasicStats {item} />
  <UsesAndActivations {item} />
  <SheetDescription
    bind:value={system.description}
    onchange={(value) => updateConsumable('description', value)}
  />
  <BombStats {item} />
  <PotionsAndFood {item} />
  <Scroll {item} />
  <Poison {item} />
</div>

<style>
  .consumable-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    background: transparent;
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
