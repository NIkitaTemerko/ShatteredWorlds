<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { getUpdateConsumable } from '../utils/updateConsumable';
  import { Input, SelectInput } from '../../../shared/ui';
  import { RARITY_TYPES, StatsCard, type RarityType } from '../../../entities/consumable';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);

  function handleRarityChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as RarityType;
    updateConsumable('rarity', value);
  }
</script>

<StatsCard columns={3}>
  <div class="stat-col">
    <div class="stat-header">Редкость</div>
    <div class="stat-body">
      <SelectInput
        value={item.system.consumable.rarity}
        options={RARITY_TYPES}
        variant="bordered"
        fullWidth
        onchange={handleRarityChange}
      />
    </div>
  </div>

  <div class="stat-col">
    <div class="stat-header">Цена</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        bind:value={item.system.consumable.price}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateConsumable('price', Number(e.currentTarget.value))}
      />
    </div>
  </div>

  <div class="stat-col">
    <div class="stat-header">Вес</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        step="0.01"
        bind:value={item.system.consumable.weight}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateConsumable('weight', Number(e.currentTarget.value))}
      />
    </div>
  </div>

  <div class="stat-col">
    <div class="stat-header">Кол-во</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        bind:value={item.system.consumable.quantity}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateConsumable('quantity', Number(e.currentTarget.value))}
      />
    </div>
  </div>

  <div class="stat-col">
    <div class="stat-header">Стек</div>
    <div class="stat-body">
      <Input
        type="number"
        min="1"
        bind:value={item.system.consumable.stackLimit}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateConsumable('stackLimit', Number(e.currentTarget.value))}
      />
    </div>
  </div>
</StatsCard>
