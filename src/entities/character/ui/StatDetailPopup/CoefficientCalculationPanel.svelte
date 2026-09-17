<script lang="ts">
  import {
    attributeCoefficientValue,
    scaleAttributeCoefficients,
  } from "../../../../shared/helpers/Character/coefficients";
  import { t } from "../../../../shared/i18n";
  import { ActionIcon } from "../../../../shared/ui/ActionIcon";
  import StatDetailAdjustableValue from "./StatDetailAdjustableValue.svelte";

  interface Props {
    statTotal: number;
  }

  let { statTotal }: Props = $props();

  let count = $state(1);

  const unitCoefficient = $derived(attributeCoefficientValue(statTotal));
  const scaledValue = $derived(scaleAttributeCoefficients(count, statTotal));

  async function copyToClipboard(e: Event) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(scaledValue));
    } catch {
      // clipboard unavailable
    }
  }

  function handleCountChange(value: number) {
    count = value;
  }
</script>

<div class="coefficient-panel" role="region" onpointerdown={(e) => e.stopPropagation()}>
  <div class="coefficient-panel-header">
    <div class="coefficient-panel-title">{t("character.coefficient.calculation")}</div>
  </div>

  <div class="stat-detail-row">
    <span class="stat-detail-label">{t("character.coefficient.unit")}</span>
    <span class="stat-detail-value">{unitCoefficient}</span>
  </div>

  <div class="stat-detail-row">
    <span class="stat-detail-label">{t("character.coefficient.count")}</span>
    <StatDetailAdjustableValue value={count} onChange={handleCountChange} />
  </div>

  <div class="stat-detail-row stat-detail-row--final">
    <span class="stat-detail-label">{t("character.coefficient.final")}</span>
    <div class="final-value-controls">
      <span class="stat-detail-value">{scaledValue}</span>
      <ActionIcon
        onclick={copyToClipboard}
        title={t("character.coefficient.copy")}
        aria-label={t("character.coefficient.copy")}
        variant="ghost"
        size="sm"
        class="copy-action"
      >
        {#snippet icon()}
          <i class="fas fa-copy" aria-hidden="true"></i>
        {/snippet}
      </ActionIcon>
    </div>
  </div>
</div>

<style>
  .coefficient-panel {
    padding: 0.75rem;
    min-width: 220px;
    max-width: 260px;
    background: rgb(28 24 40 / 96%);
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    border-radius: 0;
    box-shadow: var(--shw-shadow-panel);
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
  }

  .coefficient-panel-header {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--shw-color-border, #4a425c);
  }

  .coefficient-panel-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: var(--shw-color-text, #e8e4f0);
    font-family: inherit;
  }

  .stat-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 13px;
    margin-bottom: 0.35rem;
  }

  .stat-detail-row--final {
    margin-top: 0.35rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--shw-color-border, #4a425c);
    margin-bottom: 0;
    font-weight: 700;
  }

  .stat-detail-label {
    color: var(--shw-color-text-muted, #9a93ad);
  }

  .stat-detail-value {
    font-weight: 600;
    color: var(--shw-color-text, #e8e4f0);
    font-variant-numeric: tabular-nums;
  }

  .final-value-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .final-value-controls :global(.copy-action) {
    color: var(--shw-color-text-muted, #9a93ad);
  }

  .final-value-controls :global(.copy-action:hover) {
    color: var(--shw-color-primary-bright, #b57aef);
  }
</style>
