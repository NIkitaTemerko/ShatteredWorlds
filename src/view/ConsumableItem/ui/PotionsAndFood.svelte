<script lang="ts">
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { getUpdateConsumable } from '../utils/updateConsumable';
  import { Input, SelectInput } from '../../../shared/ui';
  import { EFFECT_TYPES, StatsCard } from '../../../entities/consumable';

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);
  const consEffects: any[] = (item?.system?.consumable as any)?.effects ?? [];

  function addEffect() {
    const effects = [...consEffects];
    if (item.system.consumable.consumableType === 'potion') {
      effects.push({ type: 'heal', amount: 0, duration: 1, attribute: '' });
    } else {
      effects.push({ type: 'бафф', value: 0, duration: 1 });
    }
    updateConsumable('effects', effects);
  }

  function removeEffect(idx: number) {
    const effects = consEffects.filter((_, i) => i !== idx);
    updateConsumable('effects', effects);
  }

  function updateEffect(idx: number, field: string, value: any) {
    const effects = consEffects.map((e, i) => (i === idx ? { ...e, [field]: value } : e));
    updateConsumable('effects', effects);
  }
</script>

{#if item.system.consumable.consumableType === 'potion' || item.system.consumable.consumableType === 'food'}
  <section class="effects-section">
    {#if item.system.consumable.consumableType === 'food' && item.system.consumable.nutrition !== undefined}
      <div class="section-header">
        <h3>Пищевая ценность</h3>
      </div>
      <StatsCard columns={2}>
        <div class="stat-col">
          <div class="stat-header">Длительность насыщения</div>
          <div class="stat-body">
            <Input
              type="text"
              bind:value={item.system.consumable.nutrition.duration}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => updateConsumable('nutrition.duration', e)}
            />
          </div>
        </div>
        <div class="stat-col">
          <div class="stat-header">Сила насыщения</div>
          <div class="stat-body">
            <Input
              type="text"
              bind:value={item.system.consumable.nutrition.value}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => updateConsumable('nutrition.value', e)}
            />
          </div>
        </div>
      </StatsCard>
    {/if}

    <div class="section-header">
      <h3>Эффекты</h3>
      <button type="button" class="add-btn" onclick={addEffect}>+ Добавить</button>
    </div>

    {#each consEffects as eff, idx}
      <div class="effect-card-wrapper">
        <StatsCard columns={3}>
          <div class="stat-col">
            <div class="stat-header">{item.system.consumable.consumableType === 'potion' ? 'Тип' : 'Бонус'}</div>
            <div class="stat-body">
              {#if item.system.consumable.consumableType === 'potion'}
                <SelectInput
                  bind:value={eff.type}
                  options={EFFECT_TYPES}
                  variant="bordered"
                  fullWidth
                  onchange={(e) => updateEffect(idx, 'type', e.currentTarget.value)}
                />
              {:else}
                <Input
                  type="text"
                  bind:value={eff.type}
                  variant="underline"
                  textAlign="center"
                  fullWidth
                  onchange={(e) => updateEffect(idx, 'type', e.currentTarget.value)}
                />
              {/if}
            </div>
          </div>

          <div class="stat-col">
            <div class="stat-header">Сила</div>
            <div class="stat-body">
              <Input
                type="number"
                min="0"
                value={item.system.consumable.consumableType === 'potion' ? eff.amount : eff.value}
                variant="underline"
                textAlign="center"
                fullWidth
                onchange={(e) =>
                  updateEffect(
                    idx,
                    item.system.consumable.consumableType === 'potion' ? 'amount' : 'value',
                    Number(e.currentTarget.value)
                  )}
              />
            </div>
          </div>

          <div class="stat-col">
            <div class="stat-header">Длительность</div>
            <div class="stat-body">
              <Input
                type="number"
                min="1"
                bind:value={eff.duration}
                variant="underline"
                textAlign="center"
                fullWidth
                onchange={(e) => updateEffect(idx, 'duration', Number(e.currentTarget.value))}
              />
            </div>
          </div>

          {#if item.system.consumable.consumableType === 'potion'}
            <div class="stat-col full">
              <div class="stat-header">Атрибут</div>
              <div class="stat-body">
                <Input
                  type="text"
                  bind:value={eff.attribute}
                  variant="underline"
                  textAlign="center"
                  fullWidth
                  onchange={(e) => updateEffect(idx, 'attribute', e.currentTarget.value)}
                />
              </div>
            </div>
          {/if}
        </StatsCard>
        <button type="button" class="delete-btn" onclick={() => removeEffect(idx)}>×</button>
      </div>
    {/each}
  </section>
{/if}

<style>
  .effects-section {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: transparent;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: var(--dark, #666);
    color: #000;
  }

  .section-header h3 {
    margin: 0;
    font-size: var(--font-size-16);
    font-weight: 700;
  }

  .add-btn {
    background: rgba(0, 0, 0, 0.2);
    color: #000;
    border: none;
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    font-weight: 600;
    font-size: var(--font-size-12);
    transition: background 0.2s;
  }

  .add-btn:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .effect-card-wrapper {
    display: grid;
    grid-template-columns: 1fr 40px;
    gap: 2px;
    align-items: stretch;
  }

  .delete-btn {
    background: var(--color-border-light-3);
    border: none;
    font-size: 1.5rem;
    font-weight: 700;
    color: #c00;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-btn:hover {
    background: rgba(200, 0, 0, 0.15);
    color: #a00;
  }
</style>
