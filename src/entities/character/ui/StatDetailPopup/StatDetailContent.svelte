<script lang="ts">
  import type { StatSourceKey } from '../../../../documents/Actor/types/ShwActorSystem';
  import {
    NPC_STAT_SOURCE_KEYS,
    STAT_SOURCE_KEYS,
  } from '../../../../documents/Actor/types/ShwActorSystem';
  import { t } from '../../../../shared/i18n';
  import type { I18nKey } from '../../../../shared/i18n';
  import type { StatSourceValues } from '../../../../documents/Actor/types/ShwActorSystem';

  interface Props {
    titleKey: I18nKey;
    sources: StatSourceValues;
    total: number;
    variant?: 'character' | 'npc';
    editableExtra?: boolean;
    onExtraChange: (value: number) => void;
  }

  import { untrack } from 'svelte';

  let {
    titleKey,
    sources,
    total,
    variant = 'character',
    editableExtra = true,
    onExtraChange,
  }: Props = $props();

  let localExtra = $state(untrack(() => sources.extra));

  $effect(() => {
    localExtra = sources.extra;
  });

  const labelKey = $derived(titleKey);
  const visibleSourceKeys = $derived(
    variant === 'npc' ? NPC_STAT_SOURCE_KEYS : STAT_SOURCE_KEYS,
  );

  const sourceLabelKeys: Record<StatSourceKey, I18nKey> = {
    base: 'character.statSources.base',
    growth: 'character.statSources.growth',
    equipment: 'character.statSources.equipment',
    abilities: 'character.statSources.abilities',
    extra: 'character.statSources.extra',
  };

  function decrement(e: Event) {
    e.stopPropagation();
    const next = localExtra - 1;
    localExtra = next;
    onExtraChange(next);
  }

  function increment(e: Event) {
    e.stopPropagation();
    const next = localExtra + 1;
    localExtra = next;
    onExtraChange(next);
  }

  function handleExtraInput(e: Event) {
    e.stopPropagation();
    const input = e.currentTarget as HTMLInputElement;
    let value = Number.parseInt(input.value, 10);
    if (Number.isNaN(value)) {
      input.value = String(localExtra);
      return;
    }
    localExtra = value;
    input.value = String(value);
    onExtraChange(value);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="stat-detail-content" onpointerdown={(e) => e.stopPropagation()}>
  <header class="stat-detail-header">
    <h3 class="stat-detail-title">{t(labelKey)}</h3>
  </header>

  <div class="stat-detail-rows">
    {#each visibleSourceKeys as sourceKey (sourceKey)}
      {#if sourceKey === 'extra'}
        <div class="stat-detail-row stat-detail-row--extra">
          <span class="stat-detail-label">{t(sourceLabelKeys[sourceKey])}</span>
          {#if editableExtra}
            <div class="extra-controls">
              <button type="button" class="extra-btn" onclick={decrement}>−</button>
              <input
                type="number"
                class="extra-input"
                value={localExtra}
                oninput={handleExtraInput}
                onclick={(e) => e.stopPropagation()}
              />
              <button type="button" class="extra-btn" onclick={increment}>+</button>
            </div>
          {:else}
            <span class="stat-detail-value">{sources.extra}</span>
          {/if}
        </div>
      {:else}
        <div class="stat-detail-row">
          <span class="stat-detail-label">{t(sourceLabelKeys[sourceKey])}</span>
          <span class="stat-detail-value">{sources[sourceKey]}</span>
        </div>
      {/if}
    {/each}
  </div>

  <footer class="stat-detail-footer">
    <span class="stat-detail-label">{t('character.statTotal')}</span>
    <span class="stat-detail-total">{total}</span>
  </footer>
</div>

<style>
  .stat-detail-content {
    padding: 0.75rem;
    min-width: 220px;
    max-width: 280px;
  }

  .stat-detail-header {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .stat-detail-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .stat-detail-rows {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .stat-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 13px;
  }

  .stat-detail-label {
    color: #374151;
  }

  .stat-detail-value,
  .stat-detail-total {
    font-weight: 600;
    color: #1a1a1a;
    font-variant-numeric: tabular-nums;
  }

  .stat-detail-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 13px;
    font-weight: 700;
  }

  .extra-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .extra-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
    padding: 0;
    line-height: 1;
  }

  .extra-btn:hover {
    background-color: rgba(222, 184, 135, 0.25);
  }

  .extra-input {
    width: 40px;
    height: 24px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    font-size: 13px;
    color: #374151;
    background: transparent;
    padding: 0;
    -moz-appearance: textfield;
  }

  .extra-input::-webkit-inner-spin-button,
  .extra-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
