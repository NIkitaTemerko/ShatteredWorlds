<script lang="ts">
  import type { AttributeExtraSources } from '../../../../documents/Actor/types/ShwActorSystem';
  import { ATTRIBUTE_EXTRA_SOURCE_KEYS } from '../../../../documents/Actor/types/ShwActorSystem';
  import { sumAttributeExtraSources } from '../../../../shared/helpers/Character/collectStatBonusesBySource';
  import { t } from '../../../../shared/i18n';
  import type { I18nKey } from '../../../../shared/i18n';
  import { ActionIcon } from '../../../../shared/ui/ActionIcon';
  import CoefficientCalculationPanel from './CoefficientCalculationPanel.svelte';
  import StatDetailAdjustableValue from './StatDetailAdjustableValue.svelte';

  interface Props {
    titleKey?: I18nKey;
    title?: string;
    sources: AttributeExtraSources;
    onExtraChange: (value: number) => void;
  }

  let { titleKey, title, sources, onExtraChange }: Props = $props();

  const displayTitle = $derived(title ?? (titleKey ? t(titleKey) : ''));
  const extraTotal = $derived(sumAttributeExtraSources(sources));

  let coefficientOpen = $state(false);

  const sourceLabelKeys: Record<keyof AttributeExtraSources, I18nKey> = {
    equipment: 'character.statSources.equipment',
    abilities: 'character.statSources.abilities',
    extra: 'character.statSources.extra',
  };

  function toggleCoefficientMenu(e: Event) {
    e.stopPropagation();
    coefficientOpen = !coefficientOpen;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="stat-detail-content" onpointerdown={(e) => e.stopPropagation()}>
  <header class="stat-detail-header">
    <div class="stat-detail-title">{displayTitle}</div>
  </header>

  <div class="stat-detail-rows">
    {#each ATTRIBUTE_EXTRA_SOURCE_KEYS as sourceKey (sourceKey)}
      {#if sourceKey === 'extra'}
        <div class="stat-detail-row stat-detail-row--extra">
          <span class="stat-detail-label">{t(sourceLabelKeys[sourceKey])}</span>
          <StatDetailAdjustableValue value={sources.extra} onChange={onExtraChange} />
        </div>
      {:else}
        <div class="stat-detail-row">
          <span class="stat-detail-label">{t(sourceLabelKeys[sourceKey])}</span>
          <span class="stat-detail-value">{sources[sourceKey]}</span>
        </div>
      {/if}
    {/each}
  </div>

  <div class="stat-detail-bottom">
    <footer class="stat-detail-footer">
      <span class="stat-detail-label">{t('character.statTotal')}</span>
      <span class="stat-detail-total">{extraTotal}</span>
    </footer>

    <div class="coefficient-row">
      <div class="coefficient-row-main">
        <span class="coefficient-row-label">{t('character.coefficient.calculation')}</span>
        <button
          type="button"
          class="info-tooltip-trigger"
          aria-label={t('character.coefficient.info')}
          onpointerdown={(e) => e.stopPropagation()}
        >
          <i class="fas fa-circle-info info-tooltip-icon" aria-hidden="true"></i>
          <span class="info-tooltip-text" role="tooltip">{t('character.coefficient.info')}</span>
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
  </div>

  {#if coefficientOpen}
    <div class="coefficient-submenu">
      <CoefficientCalculationPanel statTotal={extraTotal} />
    </div>
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
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    min-width: 220px;
    max-width: 280px;
    font: inherit;
  }

  .stat-detail-header {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .stat-detail-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
    font-family: inherit;
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

  .stat-detail-bottom {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .stat-detail-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 700;
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
