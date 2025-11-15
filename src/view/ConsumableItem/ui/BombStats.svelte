<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { getUpdateConsumable } from '../utils/updateConsumable';
  import { Input, SelectInput } from '../../../shared/ui';
  import { DAMAGE_TYPES, SAVE_TYPES, StatsCard } from '../../../entities/consumable';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);
</script>

{#if item.system.consumable.consumableType === 'bomb' && item.system.consumable.damage !== undefined && item.system.consumable.save !== undefined}
  <StatsCard columns={3}>
    <div class="stat-col">
      <div class="stat-header">Урон</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={item.system.consumable.damage.amount}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable('damage.amount', Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">Тип урона</div>
      <div class="stat-body">
        <SelectInput
          value={item.system.consumable.damage.type}
          options={DAMAGE_TYPES}
          variant="square"
          fullWidth
          onchange={(e) => updateConsumable('damage.type', e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">Радиус</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={item.system.consumable.radius}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable('radius', Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">Спасбросок</div>
      <div class="stat-body">
        <SelectInput
          value={item.system.consumable.save.type}
          options={SAVE_TYPES}
          variant="square"
          fullWidth
          onchange={(e) => updateConsumable('save.type', e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">Сложность</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={item.system.consumable.save.dc}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable('save.dc', Number(e.currentTarget.value))}
        />
      </div>
    </div>
  </StatsCard>
{/if}
