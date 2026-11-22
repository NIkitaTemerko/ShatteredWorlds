<script lang="ts">
  import { t, type I18nKey } from '../../../shared/i18n';
  let {
    sources,
    total,
    editable = 'extra',
    onChange,
    fromAttribute = false,
  }: {
    sources: {
      base?: number;
      growth?: number;
      equipment: number;
      abilities: number;
      extra?: number;
    };
    total: number;
    editable?: string;
    onChange: (value: number) => unknown;
    fromAttribute?: boolean;
  } = $props();
</script>

<div class="source-breakdown">
  {#each Object.entries(sources) as [key, value]}
    <div class="source-value-row">
      <span
        >{t(
          `character.statSources.${key === 'base' && fromAttribute ? 'fromAttribute' : key}` as I18nKey,
        )}</span
      >
      {#if key === editable}
        <div class="number-stepper">
          <button
            type="button"
            class="outline-button"
            aria-label="−"
            onclick={() => onChange(value - 1)}>−</button
          >
          <input
            type="number"
            aria-label={t(`character.statSources.${key}` as I18nKey)}
            {value}
            onchange={(e) => {
              const n = e.currentTarget.valueAsNumber;
              if (Number.isFinite(n)) onChange(n);
            }}
          />
          <button
            type="button"
            class="outline-button"
            aria-label="+"
            onclick={() => onChange(value + 1)}>+</button
          >
        </div>
      {:else}<strong>{value}</strong>{/if}
    </div>
  {/each}
  <div class="source-value-row source-total">
    <span>{t('character.statTotal')}</span><strong>{total}</strong>
  </div>
</div>
