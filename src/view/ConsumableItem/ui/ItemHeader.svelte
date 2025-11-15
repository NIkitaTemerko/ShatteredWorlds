<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { getUpdateConsumable } from '../utils/updateConsumable';
  import { Input, SelectInput } from '../../../shared/ui';
  import { CONSUMABLE_TYPES, type ConsumableType } from '../../../entities/consumable/model';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);

  function handleTypeChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as ConsumableType;
    updateConsumable('consumableType', value, event);
  }
</script>

<header class="card-header">
  <img src={item.img} data-edit="img" title={item.name} height="72" width="72" alt="img" />

  <div class="header-main">
    <Input
      class="item-name"
      type="text"
      bind:value={item.name}
      placeholder="Название предмета"
      onchange={(e) => item.update({ name: e.currentTarget.value })}
      fullWidth
      variant="underline"
    />

    <div class="type-wrapper">
      <span class="type-label">Тип:</span>
      <SelectInput
        value={item.system.consumable.consumableType}
        options={CONSUMABLE_TYPES}
        variant="square"
        class="type-select"
        onchange={handleTypeChange}
      />
    </div>
  </div>
</header>

<style>
  .card-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0;
  }

  .header-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :global(.item-name) {
    font-size: var(--font-size-20);
    font-weight: 700;
    padding: 0.4rem 0;
  }

  .type-wrapper {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .type-label {
    font-size: var(--font-size-16);
    opacity: 0.8;
  }

  :global(.type-select) {
    width: max-content;
    background: transparent !important;
    border: none !important;
    border-bottom: 2px solid currentColor !important;
    border-radius: 0 !important;
    padding: 0.25rem 0.5rem !important;
    font-size: var(--font-size-14);
  }
</style>
