<script lang="ts">
  import {
    HEALTH_STAT_SOURCE_KEYS,
    STAT_SOURCE_KEYS,
    type HealthStatSourceKey,
    type HealthStatSources,
    type StatSourceKey,
    type StatSourceValues,
  } from "../../../../documents/Actor/types/ShwActorSystem";
  import { t } from "../../../../shared/i18n";
  import type { I18nKey } from "../../../../shared/i18n";
  import { untrack } from "svelte";

  interface Props {
    sources: HealthStatSources;
    total: number;
    barrierValue?: number;
    barrierSources?: StatSourceValues;
    barrierTotal?: number;
    onExtraChange: (value: number) => void;
    onBarrierExtraChange?: (value: number) => void;
  }

  let {
    sources,
    total,
    barrierValue = 0,
    barrierSources,
    barrierTotal = 0,
    onExtraChange,
    onBarrierExtraChange,
  }: Props = $props();

  let localExtra = $state(untrack(() => sources.extra));
  let localBarrierExtra = $state(untrack(() => barrierSources?.extra ?? 0));

  $effect(() => {
    localExtra = sources.extra;
  });

  $effect(() => {
    localBarrierExtra = barrierSources?.extra ?? 0;
  });

  const healthSourceLabelKeys: Record<HealthStatSourceKey, I18nKey> = {
    base: "character.statSources.base",
    equipment: "character.statSources.equipment",
    abilities: "character.statSources.abilities",
    extra: "character.statSources.extra",
  };

  const barrierSourceLabelKeys: Record<StatSourceKey, I18nKey> = {
    base: "character.statSources.base",
    growth: "character.statSources.growth",
    equipment: "character.statSources.equipment",
    abilities: "character.statSources.abilities",
    extra: "character.statSources.extra",
  };

  function decrementHealthExtra(e: Event) {
    e.stopPropagation();
    const next = localExtra - 1;
    localExtra = next;
    onExtraChange(next);
  }

  function incrementHealthExtra(e: Event) {
    e.stopPropagation();
    const next = localExtra + 1;
    localExtra = next;
    onExtraChange(next);
  }

  function handleHealthExtraInput(e: Event) {
    e.stopPropagation();
    const input = e.currentTarget as HTMLInputElement;
    const value = Number.parseInt(input.value, 10);
    if (Number.isNaN(value)) {
      input.value = String(localExtra);
      return;
    }
    localExtra = value;
    input.value = String(value);
    onExtraChange(value);
  }

  function decrementBarrierExtra(e: Event) {
    e.stopPropagation();
    if (!onBarrierExtraChange) return;
    const next = localBarrierExtra - 1;
    localBarrierExtra = next;
    onBarrierExtraChange(next);
  }

  function incrementBarrierExtra(e: Event) {
    e.stopPropagation();
    if (!onBarrierExtraChange) return;
    const next = localBarrierExtra + 1;
    localBarrierExtra = next;
    onBarrierExtraChange(next);
  }

  function handleBarrierExtraInput(e: Event) {
    e.stopPropagation();
    if (!onBarrierExtraChange) return;
    const input = e.currentTarget as HTMLInputElement;
    const value = Number.parseInt(input.value, 10);
    if (Number.isNaN(value)) {
      input.value = String(localBarrierExtra);
      return;
    }
    localBarrierExtra = value;
    input.value = String(value);
    onBarrierExtraChange(value);
  }
</script>

<div class="stat-detail-content">
  <header class="stat-detail-header">
    <h3 class="stat-detail-title">{t("character.health.max")}</h3>
  </header>

  <div class="stat-detail-rows">
    {#each HEALTH_STAT_SOURCE_KEYS as sourceKey (sourceKey)}
      {#if sourceKey === "extra"}
        <div class="stat-detail-row stat-detail-row--extra">
          <span class="stat-detail-label">{t(healthSourceLabelKeys[sourceKey])}</span>
          <div class="extra-controls">
            <button type="button" class="extra-btn" onclick={decrementHealthExtra}>−</button>
            <input
              type="number"
              class="extra-input"
              value={localExtra}
              oninput={handleHealthExtraInput}
              onclick={(e) => e.stopPropagation()}
            />
            <button type="button" class="extra-btn" onclick={incrementHealthExtra}>+</button>
          </div>
        </div>
      {:else}
        <div class="stat-detail-row">
          <span class="stat-detail-label">{t(healthSourceLabelKeys[sourceKey])}</span>
          <span class="stat-detail-value">{sources[sourceKey]}</span>
        </div>
      {/if}
    {/each}
  </div>

  <footer class="stat-detail-footer">
    <span class="stat-detail-label">{t("character.statTotal")}</span>
    <span class="stat-detail-total">{total}</span>
  </footer>

  {#if barrierSources}
    <header class="stat-detail-header stat-detail-header--section">
      <h3 class="stat-detail-title">{t("character.barrier.max")}</h3>
    </header>

    <div class="stat-detail-row">
      <span class="stat-detail-label">{t("character.barrier.current")}</span>
      <span class="stat-detail-value">{barrierValue}</span>
    </div>

    <div class="stat-detail-rows">
      {#each STAT_SOURCE_KEYS as sourceKey (sourceKey)}
        {#if sourceKey === "extra"}
          <div class="stat-detail-row stat-detail-row--extra">
            <span class="stat-detail-label">{t(barrierSourceLabelKeys[sourceKey])}</span>
            <div class="extra-controls">
              <button type="button" class="extra-btn" onclick={decrementBarrierExtra}>−</button>
              <input
                type="number"
                class="extra-input"
                value={localBarrierExtra}
                oninput={handleBarrierExtraInput}
                onclick={(e) => e.stopPropagation()}
              />
              <button type="button" class="extra-btn" onclick={incrementBarrierExtra}>+</button>
            </div>
          </div>
        {:else}
          <div class="stat-detail-row">
            <span class="stat-detail-label">{t(barrierSourceLabelKeys[sourceKey])}</span>
            <span class="stat-detail-value">{barrierSources[sourceKey]}</span>
          </div>
        {/if}
      {/each}
    </div>

    <footer class="stat-detail-footer">
      <span class="stat-detail-label">{t("character.statTotal")}</span>
      <span class="stat-detail-total">{barrierTotal}</span>
    </footer>
  {/if}
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

  .stat-detail-header--section {
    margin-top: 0.75rem;
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
