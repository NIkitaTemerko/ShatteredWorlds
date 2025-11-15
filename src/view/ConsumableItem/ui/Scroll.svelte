<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { getUpdateConsumable } from '../utils/updateConsumable';
  import { Input } from '../../../shared/ui';
  import { StatsCard } from '../../../entities/consumable';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);
</script>

{#if item.system.consumable.consumableType === 'scroll' && item.system.consumable?.spell !== undefined && item.system.consumable?.requirements !== undefined}
  <StatsCard columns={3}>
    <div class="stat-col full">
      <div class="stat-header">Название заклинания</div>
      <div class="stat-body">
        <Input
          type="text"
          value={item.system.consumable.spell.name}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable('spell.name', e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">Уровень</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          max="9"
          value={item.system.consumable.spell.level}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable('spell.level', Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">Школа</div>
      <div class="stat-body">
        <Input
          type="text"
          value={item.system.consumable.spell.school}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable('spell.school', e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">Треб. характеристика</div>
      <div class="stat-body">
        <Input
          type="text"
          value={item.system.consumable.requirements.ability}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable('requirements.ability', e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">Сложность</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={item.system.consumable.requirements.dc}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable('requirements.dc', Number(e.currentTarget.value))}
        />
      </div>
    </div>
  </StatsCard>
{/if}
