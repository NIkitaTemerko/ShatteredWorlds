<script lang="ts">
  import { t } from "../../../../shared/i18n";
  import { COMBAT_DAMAGE_TYPE_OPTIONS } from "../../../../shared/model/damage/constants";
  import { computeFallRawDamage } from "../../../../shared/model/damage/computeRawDamage";
  import { getDamageTypeDefinition, damageTypeHitsArmor } from "../../../../shared/model/damage/damageTypeConfig";
  import type { CombatDamageType } from "../../../../shared/model/damage/types";
  import { Input, SelectInput } from "../../../../shared/ui";

  const damageTypeOptions = COMBAT_DAMAGE_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.labelKey,
  }));

  export interface DamageRow {
    id: string;
    type: CombatDamageType;
    amount: number;
    penetration: number;
    fallHeight: number;
  }

  interface Props {
    row: DamageRow;
    massCategory: number;
    dragDisabled?: boolean;
    removeDisabled?: boolean;
    onUpdate?: (patch: Partial<Omit<DamageRow, "id">>) => void;
    onRemove?: () => void;
  }

  let {
    row,
    massCategory,
    dragDisabled = false,
    removeDisabled = false,
    onUpdate,
    onRemove,
  }: Props = $props();

  const typeDef = $derived(getDamageTypeDefinition(row.type));
  const showPenetration = $derived(damageTypeHitsArmor(typeDef));
  const isFall = $derived(typeDef.inputKind === "fallHeight");
  const fallDamage = $derived(computeFallRawDamage(massCategory, row.fallHeight));
</script>

<div
  class="drag-handle"
  class:drag-handle--disabled={dragDisabled}
  aria-label={t("character.damage.reorder")}
>
  <i class="fas fa-grip-vertical" aria-hidden="true"></i>
</div>

<div class="damage-row-main">
  <SelectInput
    value={row.type}
    options={damageTypeOptions}
    variant="underline"
    onchange={(e) => onUpdate?.({ type: e.currentTarget.value as CombatDamageType })}
  />

  {#if isFall}
    <Input
      type="number"
      min="0"
      value={row.fallHeight}
      variant="underline"
      style="width:4rem;"
      onchange={(e) => onUpdate?.({ fallHeight: Number(e.currentTarget.value) || 0 })}
    />
    <span class="damage-hint">
      {t("character.damage.cells")} = {fallDamage}
    </span>
  {:else}
    <Input
      type="number"
      min="0"
      value={row.amount}
      variant="underline"
      style="width:4rem;"
      onchange={(e) => onUpdate?.({ amount: Number(e.currentTarget.value) || 0 })}
    />
    {#if showPenetration}
      <label class="penetration-field">
        <span>{t("character.damage.penetration")}</span>
        <Input
          type="number"
          min="0"
          value={row.penetration}
          variant="underline"
          style="width:3rem;"
          onchange={(e) => onUpdate?.({ penetration: Number(e.currentTarget.value) || 0 })}
        />
      </label>
    {/if}
  {/if}
</div>

{#if !dragDisabled}
  <button
    type="button"
    class="row-action-btn row-action-btn--remove"
    title={t("character.damage.removeEntry")}
    disabled={removeDisabled}
    onclick={() => onRemove?.()}
  >
    ×
  </button>
{/if}

<style>
  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 22px;
    min-height: 28px;
    margin-top: 0.1rem;
    color: #9ca3af;
    cursor: grab;
    touch-action: none;
  }

  .drag-handle--disabled {
    opacity: 0.35;
    pointer-events: none;
    cursor: default;
  }

  .damage-row-main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    flex: 1;
    min-width: 0;
  }

  .row-action-btn {
    flex-shrink: 0;
    align-self: flex-start;
    width: 24px;
    height: 24px;
    margin-top: 0.1rem;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    padding: 0;
    color: #374151;
  }

  .row-action-btn:hover:not(:disabled) {
    background: rgba(222, 184, 135, 0.25);
  }

  .row-action-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .row-action-btn--remove {
    color: #d7263d;
  }

  .damage-hint {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
  }

  .penetration-field {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 12px;
    color: #374151;
  }
</style>
