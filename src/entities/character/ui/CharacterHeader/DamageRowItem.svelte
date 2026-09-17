<script lang="ts">
  import { t } from '../../../../shared/i18n';
  import { COMBAT_DAMAGE_TYPE_OPTIONS } from '../../../../shared/model/damage/constants';
  import { computeFallRawDamage } from '../../../../shared/model/damage/computeRawDamage';
  import { getDamageTypeDefinition, damageTypeHitsArmor } from '../../../../shared/model/damage/damageTypeConfig';
  import type { CombatDamageType } from '../../../../shared/model/damage/types';
  import { Input, SelectInput } from '../../../../shared/ui';

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
    onUpdate?: (patch: Partial<Omit<DamageRow, 'id'>>) => void;
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
  const isFall = $derived(typeDef.inputKind === 'fallHeight');
  const fallDamage = $derived(computeFallRawDamage(massCategory, row.fallHeight));
</script>

<div class="damage-row">
  <div
    class="drag-handle"
    class:drag-handle--disabled={dragDisabled}
    aria-label={t('character.damage.reorder')}
  >
    <i class="fas fa-grip-vertical" aria-hidden="true"></i>
  </div>

  <SelectInput
    value={row.type}
    options={damageTypeOptions}
    variant="underline"
    fullWidth
    onchange={(e) => onUpdate?.({ type: e.currentTarget.value as CombatDamageType })}
  />

  {#if isFall}
    <Input
      type="number"
      min="0"
      value={row.fallHeight}
      variant="underline"
      textAlign="center"
      fullWidth
      class="num-input"
      onchange={(e) => onUpdate?.({ fallHeight: Number(e.currentTarget.value) || 0 })}
    />
  {:else}
    <Input
      type="number"
      min="0"
      value={row.amount}
      variant="underline"
      textAlign="center"
      fullWidth
      class="num-input"
      onchange={(e) => onUpdate?.({ amount: Number(e.currentTarget.value) || 0 })}
    />
  {/if}

  {#if !dragDisabled}
    <button
      type="button"
      class="row-action-btn row-action-btn--remove"
      title={t('character.damage.removeEntry')}
      disabled={removeDisabled}
      onclick={() => onRemove?.()}
    >
      ×
    </button>
  {:else}
    <span class="action-slot" aria-hidden="true"></span>
  {/if}

  {#if isFall}
    <span class="cell-spacer" aria-hidden="true"></span>
    <span class="damage-hint">{t('character.damage.cells')} = {fallDamage}</span>
  {/if}

  {#if !isFall && showPenetration}
    <span class="cell-spacer" aria-hidden="true"></span>
    <span class="pen-label">{t('character.damage.penetration')}</span>
    <Input
      type="number"
      min="0"
      value={row.penetration}
      variant="underline"
      textAlign="center"
      fullWidth
      class="num-input"
      onchange={(e) => onUpdate?.({ penetration: Number(e.currentTarget.value) || 0 })}
    />
    <span class="cell-spacer" aria-hidden="true"></span>
  {/if}
</div>

<style>
  .damage-row {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr) 3.25rem 24px;
    column-gap: 0.5rem;
    row-gap: 0.35rem;
    align-items: center;
    width: 100%;
  }

  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 2rem;
    color: var(--shw-color-text-muted, #9a93ad);
    cursor: grab;
    touch-action: none;
  }

  .drag-handle--disabled {
    opacity: 0.35;
    pointer-events: none;
    cursor: default;
  }

  .cell-spacer,
  .action-slot {
    display: block;
    width: 100%;
    height: 1px;
  }

  .damage-row :global(.shw-select-root) {
    width: 100%;
  }

  /* одна высота и левая кромка текста у underline-полей */
  .damage-row :global(.shw-select-trigger.variant-underline),
  .damage-row :global(.shw-input.variant-ghost) {
    box-sizing: border-box;
    width: 100%;
    min-height: 2rem;
    height: 2rem;
    padding: 0 0.35rem 0 0;
    font-size: 14px;
    line-height: 2rem;
  }

  .pen-label {
    font-size: 14px;
    font-weight: 600;
    line-height: 2rem;
    color: var(--shw-color-text-muted, #9a93ad);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .damage-hint {
    grid-column: 2 / 4;
    font-size: 12px;
    color: var(--shw-color-text-muted, #9a93ad);
    white-space: nowrap;
  }

  .row-action-btn {
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border: 1px solid var(--shw-color-border, #4a425c);
    border-radius: 0;
    background: var(--shw-glass-fill, rgb(255 255 255 / 7%));
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    padding: 0;
    color: var(--shw-color-text, #e8e4f0);
  }

  .row-action-btn:hover:not(:disabled) {
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    border-color: var(--shw-color-primary, #8b4fc9);
  }

  .row-action-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .row-action-btn--remove {
    color: #f07178;
  }
</style>
