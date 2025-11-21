<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { EFFECT_TYPES, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { getUpdateConsumable } from "../utils/updateConsumable";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  if (!item.isConsumable()) throw new Error("Item is not a consumable");
  const system = $derived(item.system);

  const updateConsumable = getUpdateConsumable(item);
  const consEffects = $derived((system as any)?.effects ?? []);

  function addEffect() {
    const effects = [...consEffects];
    if (system.consumableType === "potion") {
      effects.push({ type: "heal", amount: 0, duration: 1, attribute: "" });
    } else {
      effects.push({ type: "buff", value: 0, duration: 1 });
    }
    updateConsumable("effects", effects);
  }

  function removeEffect(idx: number) {
    const effects = consEffects.filter((_: any, i: number) => i !== idx);
    updateConsumable("effects", effects);
  }

  function updateEffect(idx: number, field: string, value: any) {
    const effects = consEffects.map((e: any, i: number) => (i === idx ? { ...e, [field]: value } : e));
    updateConsumable("effects", effects);
  }
</script>

{#if system.consumableType === "potion" || system.consumableType === "food"}
  <section class="effects-section">
    {#if system.consumableType === "food" && system.nutrition !== undefined}
      <div class="nutrition-section" style="background: var(--color-border-light-3)">
        <div class="section-header" style="background: #f08c00">
          <h3>{t("item.potionFood.nutritionTitle")}</h3>
        </div>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="nutrition-label">{t("item.potionFood.saturationDuration")}</div>
            <Input
              type="text"
              bind:value={system.nutrition.duration}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => updateConsumable("nutrition.duration", e)}
            />
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">{t("item.potionFood.saturationStrength")}</div>
            <Input
              type="text"
              bind:value={system.nutrition.value}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => updateConsumable("nutrition.value", e)}
            />
          </div>
        </div>
      </div>
    {/if}

    <div class="section-header">
      <span class="tw:text-20 tw:font-bold">{t("item.potionFood.effectsTitle")}</span>
      <button type="button" class="add-btn" onclick={addEffect}>{t("item.potionFood.addEffect")}</button>
    </div>

    {#each consEffects as eff, idx}
      <div class="effect-card-wrapper">
        <StatsCard columns={item.system.consumableType === "potion" ? 2 : 3}>
          <div class="stat-col">
            <div class="stat-header">
              {system.consumableType === "potion" ? t("item.potionFood.effectType") : t("item.potionFood.effectBonus")}
            </div>
            <div class="stat-body">
              {#if system.consumableType === "potion"}
                <SelectInput
                  bind:value={eff.type}
                  options={EFFECT_TYPES}
                  variant="underline"
                  fullWidth
                  onchange={(e) => updateEffect(idx, "type", e.currentTarget.value)}
                />
              {:else}
                <Input
                  type="text"
                  bind:value={eff.type}
                  variant="underline"
                  textAlign="center"
                  fullWidth
                  onchange={(e) => updateEffect(idx, "type", e.currentTarget.value)}
                />
              {/if}
            </div>
          </div>

          <div class="stat-col">
            <div class="stat-header">{t("item.potionFood.effectStrength")}</div>
            <div class="stat-body">
              <Input
                type="number"
                min="0"
                value={system.consumableType === "potion" ? eff.amount : eff.value}
                variant="underline"
                textAlign="center"
                fullWidth
                onchange={(e) =>
                  updateEffect(
                    idx,
                    system.consumableType === "potion" ? "amount" : "value",
                    Number(e.currentTarget.value),
                  )}
              />
            </div>
          </div>

          <div class="stat-col">
            <div class="stat-header">{t("item.potionFood.effectDuration")}</div>
            <div class="stat-body">
              <Input
                type="number"
                min="1"
                bind:value={eff.duration}
                variant="underline"
                textAlign="center"
                fullWidth
                onchange={(e) => updateEffect(idx, "duration", Number(e.currentTarget.value))}
              />
            </div>
          </div>

          {#if system.consumableType === "potion"}
            <div class="stat-col">
              <div class="stat-header">{t("item.potionFood.effectAttribute")}</div>
              <div class="stat-body">
                <Input
                  type="text"
                  bind:value={eff.attribute}
                  variant="underline"
                  textAlign="center"
                  fullWidth
                  onchange={(e) => updateEffect(idx, "attribute", e.currentTarget.value)}
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
    background: var(--light, #666);
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

  .nutrition-section {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .nutrition-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    padding: 2px;
    background: var(--color-border-light-3);
  }

  .nutrition-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: #ffd580;
    padding: 0.5rem;
  }

  .nutrition-label {
    font-weight: 700;
    font-size: var(--font-size-12);
    color: #000;
    text-align: center;
  }

  .effect-card-wrapper {
    display: grid;
    grid-template-columns: 1fr 40px;
    gap: 4px;

    align-items: stretch;
    background-color: var(--light);
  }

  .delete-btn {
    margin: 0;
    background: rgba(200, 0, 0, 0.3);
    border: none;
    font-size: 2rem;
    font-weight: 700;
    color: rgba(200, 0, 0, 0.6);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .delete-btn:hover {
    background: rgba(200, 0, 0, 0.15);
    color: #c00;
  }

  .stat-header {
    background: var(--dark, #666);
    color: #000;
  }
</style>
