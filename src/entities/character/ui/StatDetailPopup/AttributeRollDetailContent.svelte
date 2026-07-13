<script lang="ts">
  import type { AttributeRollSources } from '../../../../documents/Actor/types/ShwActorSystem';
  import { ATTRIBUTE_ROLL_SOURCE_KEYS } from '../../../../documents/Actor/types/ShwActorSystem';
  import { t } from '../../../../shared/i18n';
  import type { I18nKey } from '../../../../shared/i18n';
  import StatDetailAdjustableValue from './StatDetailAdjustableValue.svelte';

  interface Props {
    titleKey?: I18nKey;
    title?: string;
    sources: AttributeRollSources;
    total: number;
    onExtraChange: (value: number) => void;
  }

  let { titleKey, title, sources, total, onExtraChange }: Props = $props();

  const displayTitle = $derived(title ?? (titleKey ? t(titleKey) : ''));

  const sourceLabelKeys: Record<keyof AttributeRollSources, I18nKey> = {
    base: 'character.statSources.fromAttribute',
    equipment: 'character.statSources.equipment',
    abilities: 'character.statSources.abilities',
    extra: 'character.statSources.extra',
  };
</script>

<div class="stat-detail-content">
  <header class="stat-detail-header">
    <div class="stat-detail-title">{displayTitle}</div>
  </header>

  <div class="stat-detail-rows">
    {#each ATTRIBUTE_ROLL_SOURCE_KEYS as sourceKey (sourceKey)}
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
    font: inherit;
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
</style>
