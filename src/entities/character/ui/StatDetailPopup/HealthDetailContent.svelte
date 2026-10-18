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
  import { ActionIcon } from "../../../../shared/ui/ActionIcon";
  import CoefficientCalculationPanel from "./CoefficientCalculationPanel.svelte";

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

  let coefficientOpen = $state(false);

  function toggleCoefficientMenu(e: Event) {
    e.stopPropagation();
    coefficientOpen = !coefficientOpen;
  }

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

  <div class="coefficient-row">
    <div class="coefficient-row-main">
      <span class="coefficient-row-label">{t('character.coefficient.calculation')}</span>
      <button
        type="button"
        class="info-tooltip-trigger"
        aria-label={t('character.coefficient.healthInfo')}
        onpointerdown={(e) => e.stopPropagation()}
      >
        <i class="fas fa-circle-info info-tooltip-icon" aria-hidden="true"></i>
        <span class="info-tooltip-text" role="tooltip">{t('character.coefficient.healthInfo')}</span>
      </button>
    </div>

    <ActionIcon
      onclick={toggleCoefficientMenu}
      aria-expanded={coefficientOpen}
      aria-label={t('character.coefficient.calculation')}
      variant="ghost"
      size="sm"
      class="submenu-toggle"
    >
      {#snippet icon()}
        <i class="fas fa-chevron-right submenu-toggle-icon" class:submenu-toggle-icon--open={coefficientOpen} aria-hidden="true"></i>
      {/snippet}
    </ActionIcon>
  </div>

  {#if coefficientOpen}
    <div class="coefficient-submenu">
      <CoefficientCalculationPanel statTotal={total} kind="health" />
    </div>
  {/if}

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

<svelte:window
  onpointerdown={(e) => {
    if (!coefficientOpen) return;
    const path = e.composedPath();
    const inside = path.some(
      (node) => node instanceof Element && node.closest('.coefficient-submenu, .submenu-toggle'),
    );
    if (!inside) coefficientOpen = false;
  }}
/>

<style>
  .stat-detail-content {
    position: relative;
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
  .coefficient-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  .coefficient-row-main {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
  }

  .coefficient-row-label {
    line-height: 1.2;
  }

  .info-tooltip-trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #94a3b8;
    cursor: help;
    font: inherit;
    line-height: 1;
  }

  .info-tooltip-trigger:hover,
  .info-tooltip-trigger:focus-visible {
    color: #64748b;
  }

  .info-tooltip-icon {
    font-size: 12px;
    pointer-events: none;
  }

  .info-tooltip-text {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 6px);
    transform: translateX(-50%);
    width: max-content;
    max-width: 220px;
    padding: 0.35rem 0.5rem;
    border-radius: 4px;
    background: #1a1a1a;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.35;
    text-align: center;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease;
    z-index: 3;
  }

  .info-tooltip-trigger:hover .info-tooltip-text,
  .info-tooltip-trigger:focus-visible .info-tooltip-text {
    opacity: 1;
    visibility: visible;
  }

  .coefficient-row :global(.submenu-toggle) {
    color: #64748b;
  }

  .submenu-toggle-icon {
    font-size: 11px;
    line-height: 1;
    transition: transform 0.15s ease;
  }

  .submenu-toggle-icon--open {
    transform: rotate(180deg);
  }

  .coefficient-submenu {
    position: absolute;
    left: calc(100% + 6px);
    bottom: 0;
    z-index: 2;
  }
</style>
