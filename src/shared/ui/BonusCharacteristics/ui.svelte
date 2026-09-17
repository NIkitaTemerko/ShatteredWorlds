<script lang="ts">
  import type { StatModifier } from '../../../documents/Item/types/AbilityDataTypes';
  import type { CharacterStatPath } from '../../model/characterStatPaths';
  import { CHARACTER_STAT_OPTIONS } from '../../model/characterStatPaths';
  import { localize, t } from '../../i18n';
  import ActionIcon from '../ActionIcon/ui.svelte';
  import SelectInput from '../SelectInput/ui.svelte';
  import Input from '../Input/ui.svelte';

  interface Props {
    modifiers: StatModifier[];
    onAdd: (stat: CharacterStatPath) => void;
    onRemove: (index: number) => void;
    onUpdateValue: (index: number, value: number) => void;
    onUpdateMode: (index: number, mode: 'add' | 'mul' | 'override') => void;
  }

  let { modifiers, onAdd, onRemove, onUpdateValue, onUpdateMode }: Props = $props();

  const usedStats = $derived(new Set(modifiers.map((m) => m.stat)));
  const availableOptions = $derived(CHARACTER_STAT_OPTIONS.filter((opt) => !usedStats.has(opt.value)));
  const canAdd = $derived(availableOptions.length > 0);

  const modeOptions = [
    { value: 'add', label: 'ability.modifier.add' },
    { value: 'mul', label: 'ability.modifier.mul' },
    { value: 'override', label: 'ability.modifier.override' },
  ];

  let selectedStat = $state<CharacterStatPath>('attributes.fortune.value');

  $effect(() => {
    if (availableOptions.length > 0) {
      const isCurrentValid = availableOptions.find((opt) => opt.value === selectedStat);
      if (!isCurrentValid) {
        selectedStat = availableOptions[0].value;
      }
    }
  });

  function handleAdd() {
    if (canAdd && selectedStat) onAdd(selectedStat);
  }

  function getStatLabel(stat: string): string {
    const option = CHARACTER_STAT_OPTIONS.find((opt) => opt.value === stat);
    if (!option) return stat;
    if (option.attributeKey) {
      return localize(option.labelKey, { attribute: t(option.attributeKey) });
    }
    return t(option.labelKey);
  }
</script>

<div class="bonus-characteristics">
  {#if canAdd}
    <div class="add-row">
      <SelectInput
        value={selectedStat}
        options={availableOptions.map((opt) => ({
          value: opt.value,
          label: opt.attributeKey
            ? localize(opt.labelKey, { attribute: t(opt.attributeKey) })
            : t(opt.labelKey),
        }))}
        variant="underline"
        fullWidth
        onchange={(e) => (selectedStat = e.currentTarget.value as CharacterStatPath)}
      />
      <ActionIcon variant="default" size="sm" onclick={handleAdd}>
        {#snippet icon()}
          <i class="fas fa-plus"></i>
        {/snippet}
      </ActionIcon>
    </div>
  {:else}
    <div class="hint">{t('ability.passiveDetails.allStatsAdded')}</div>
  {/if}

  {#if modifiers.length > 0}
    <div class="modifiers-list">
      {#each modifiers as modifier, index (modifier.stat)}
        <div class="modifier-row">
          <div class="modifier-stat">{getStatLabel(modifier.stat)}</div>
          <div class="modifier-mode">
            <SelectInput
              value={modifier.mode}
              options={modeOptions}
              variant="underline"
              fullWidth
              onchange={(e) => onUpdateMode(index, e.currentTarget.value as 'add' | 'mul' | 'override')}
            />
          </div>
          <div class="modifier-value">
            <Input
              type="number"
              value={modifier.value}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => onUpdateValue(index, Number(e.currentTarget.value))}
            />
          </div>
          <div class="modifier-actions">
            <ActionIcon variant="ghost" size="sm" onclick={() => onRemove(index)}>
              {#snippet icon()}
                <i class="fas fa-times"></i>
              {/snippet}
            </ActionIcon>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .bonus-characteristics {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .add-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .add-row :global(.shw-select-root) {
    flex: 1;
  }

  /* текст селекта и лейбла на одной вертикали */
  .bonus-characteristics :global(.shw-select-trigger.variant-underline) {
    padding-left: 0;
    padding-right: 0.35rem;
  }

  .bonus-characteristics :global(.shw-input.variant-ghost) {
    padding-left: 0;
    padding-right: 0;
  }

  .modifiers-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .modifier-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 10rem 4rem auto;
    gap: 0.5rem;
    align-items: center;
  }

  .modifier-stat {
    font-size: 13px;
    font-weight: 600;
    color: var(--shw-color-text, #e8e4f0);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .modifier-mode,
  .modifier-value {
    display: block;
    width: 100%;
  }

  .modifier-actions {
    display: flex;
    align-items: center;
  }

  .hint {
    font-size: 12px;
    color: var(--shw-color-text-muted, #9a93ad);
    text-align: left;
  }
</style>
