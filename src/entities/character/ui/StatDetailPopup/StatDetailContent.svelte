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
            <div class="extra-controls" onpointerdown={(e) => e.stopPropagation()}>
              <button type="button" class="extra-btn" onpointerdown={(e) => e.stopPropagation()} onclick={decrement}>−</button>
              <input
                type="number"
                class="extra-input"
                value={localExtra}
                oninput={handleExtraInput}
                onpointerdown={(e) => e.stopPropagation()}
                onclick={(e) => e.stopPropagation()}
              />
              <button type="button" class="extra-btn" onpointerdown={(e) => e.stopPropagation()} onclick={increment}>+</button>
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
    padding: 0.25rem 0.25rem 0.35rem;
    min-width: 220px;
    max-width: 280px;
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
  }

  .stat-detail-header {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--shw-color-border, #4a425c);
  }

  .stat-detail-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: var(--shw-color-text, #e8e4f0);
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
    color: var(--shw-color-text-muted, #9a93ad);
  }

  .stat-detail-value,
  .stat-detail-total {
    font-weight: 600;
    color: var(--shw-color-text, #e8e4f0);
    font-variant-numeric: tabular-nums;
  }

  .stat-detail-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--shw-color-border, #4a425c);
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
    border: 1px solid var(--shw-color-border, #4a425c);
    border-radius: 0;
    background: var(--shw-glass-fill, rgb(255 255 255 / 7%));
    cursor: pointer;
    font-size: 14px;
    font-family: inherit;
    color: var(--shw-color-text, #e8e4f0);
    padding: 0;
    line-height: 1;
  }

  .extra-btn:hover {
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    border-color: var(--shw-color-primary, #8b4fc9);
  }

  .extra-input {
    width: 40px;
    height: 24px;
    text-align: center;
    border: 1px solid var(--shw-color-border, #4a425c);
    border-radius: 0;
    font-size: 13px;
    font-family: inherit;
    color: var(--shw-color-text, #e8e4f0);
    background: var(--shw-glass-fill, rgb(255 255 255 / 7%));
    padding: 0;
    -moz-appearance: textfield;
  }

  .extra-input::-webkit-inner-spin-button,
  .extra-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
