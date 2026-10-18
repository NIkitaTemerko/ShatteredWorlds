<script lang="ts">
  import type { ShwActor } from '../../../../documents/Actor/ShwActor';
  import type { AttributeKey } from '../../../../documents/Actor/types/ShwActorSystem';
  import {
    sumAttributeExtraSources,
    sumAttributeValueSources,
  } from '../../../../shared/helpers/Character/collectStatBonusesBySource';
  import { localize, t } from '../../../../shared/i18n';
  import type { I18nKey } from '../../../../shared/i18n';
  import { ATTRIBUTE_COLORS } from '../../model';
  import {
    AttributeBaseDetailContent,
    AttributeExtraDetailContent,
    AttributeRollDetailContent,
  } from '../StatDetailPopup';
  import AttributeStatCell from './AttributeStatCell.svelte';

  interface Props {
    actor: ShwActor<'character' | 'npc'>;
  }

  type AttributeSection = 'value' | 'extra' | 'charBonus' | 'saveBonus';

  interface OpenCell {
    key: AttributeKey;
    section: AttributeSection;
  }

  let { actor }: Props = $props();

  const sys = $derived(actor.system);
  const n = (v: unknown, d = 0) => (typeof v === "number" && !Number.isNaN(v) ? v : d);

  const ATTRIBUTE_KEYS = [
    { key: 'fortune' as const, labelKey: 'attributes.fortune' as I18nKey },
    { key: 'force' as const, labelKey: 'attributes.force' as I18nKey },
    { key: 'finesse' as const, labelKey: 'attributes.finesse' as I18nKey },
    { key: 'will' as const, labelKey: 'attributes.will' as I18nKey },
    { key: 'presence' as const, labelKey: 'attributes.presence' as I18nKey },
  ] as const;

  let openCell = $state<OpenCell | null>(null);

  const columns = $derived(
    ATTRIBUTE_KEYS.map((c) => {
      const attr = sys.attributes[c.key];
      const colors = ATTRIBUTE_COLORS[c.key];
      const sources = sys.attributeStatSources?.[c.key];
      const label = t(c.labelKey);
      const totalValue = n(sys.totals[c.key]);

      return {
        ...c,
        label,
        ...colors,
        attr,
        sources,
        totalValue,
        extraTotal: sources ? sumAttributeExtraSources(sources.extra) : n(attr.extra),
        charBonusTotal: n(attr.charBonus),
        saveBonusTotal: n(attr.saveBonus),
        valueTotal: sources ? sumAttributeValueSources(sources.value) : totalValue,
        charBonusSources: sources?.charBonus,
        saveBonusSources: sources?.saveBonus,
        saveLabel: localize('character.saveThrow', { attribute: label }),
        extraTitle: localize('character.additionalAttribute', { attribute: label }),
      };
    }),
  );

  function isOpen(key: AttributeKey, section: AttributeSection): boolean {
    return openCell?.key === key && openCell?.section === section;
  }

  function toggleCell(key: AttributeKey, section: AttributeSection) {
    if (isOpen(key, section)) {
      openCell = null;
    } else {
      openCell = { key, section };
    }
  }

  function closePopup() {
    openCell = null;
  }

  function popupId(key: AttributeKey, section: AttributeSection): string {
    return `attr-${key}-${section}`;
  }

  function updateAttr(key: AttributeKey, field: string, value: number) {
    actor.update({ [`system.attributes.${key}.${field}`]: value });
  }
</script>

<div class="stats-panel general-panel">
  {#each columns as col (col.key)}
    <div class="stat-col flexcol" style="--dark:{col.dark}; --light:{col.light}; --hover:{col.hover};">
      <div class="cell header" title={col.label}>{col.label}</div>
      <div class="cell value">
        {#if col.sources}
          <AttributeStatCell
            value={col.valueTotal}
            popupId={popupId(col.key, 'value')}
            isOpen={isOpen(col.key, 'value')}
            onToggle={() => toggleCell(col.key, 'value')}
            onClose={closePopup}
          >
            {#snippet popupContent()}
              <AttributeBaseDetailContent
                titleKey={col.labelKey}
                sources={col.sources.value}
                total={col.valueTotal}
                onBaseChange={(value) => updateAttr(col.key, 'value', value)}
              />
            {/snippet}
          </AttributeStatCell>
        {:else}
          {col.valueTotal}
        {/if}
      </div>

      <div class="cell subheader" title={col.extraTitle}>{col.extraTitle}</div>
      <div class="cell value">
        {#if col.sources}
          <AttributeStatCell
            value={col.extraTotal}
            popupId={popupId(col.key, 'extra')}
            isOpen={isOpen(col.key, 'extra')}
            onToggle={() => toggleCell(col.key, 'extra')}
            onClose={closePopup}
          >
            {#snippet popupContent()}
              <AttributeExtraDetailContent
                title={col.extraTitle}
                sources={col.sources.extra}
                onExtraChange={(value) => updateAttr(col.key, 'extra', value)}
              />
            {/snippet}
          </AttributeStatCell>
        {:else}
          {col.extraTotal}
        {/if}
      </div>

      <div class="cell subheader" title={t('character.attributeBonus')}>{t('character.attributeBonus')}</div>
      <div class="cell value">
        {#if col.charBonusSources}
          <AttributeStatCell
            value={col.charBonusTotal}
            popupId={popupId(col.key, 'charBonus')}
            isOpen={isOpen(col.key, 'charBonus')}
            onToggle={() => toggleCell(col.key, 'charBonus')}
            onClose={closePopup}
          >
            {#snippet popupContent()}
              <AttributeRollDetailContent
                titleKey={'character.attributeBonus' as I18nKey}
                sources={col.charBonusSources}
                total={col.charBonusTotal}
                onExtraChange={(value) => updateAttr(col.key, 'charBonusBase', value)}
              />
            {/snippet}
          </AttributeStatCell>
        {:else}
          {col.charBonusTotal}
        {/if}
      </div>

      <div class="cell subheader" title={col.saveLabel}>{col.saveLabel}</div>
      <div class="cell value">
        {#if col.saveBonusSources}
          <AttributeStatCell
            value={col.saveBonusTotal}
            popupId={popupId(col.key, 'saveBonus')}
            isOpen={isOpen(col.key, 'saveBonus')}
            onToggle={() => toggleCell(col.key, 'saveBonus')}
            onClose={closePopup}
          >
            {#snippet popupContent()}
              <AttributeRollDetailContent
                title={col.saveLabel}
                sources={col.saveBonusSources}
                total={col.saveBonusTotal}
                onExtraChange={(value) => updateAttr(col.key, 'saveBonusBase', value)}
              />
            {/snippet}
          </AttributeStatCell>
        {:else}
          {col.saveBonusTotal}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .stats-panel {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-template-rows: repeat(8, auto);
    gap: 2px;
    background: var(--shw-color-border, #4a425c);
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    font-family: var(--shw-font, inherit);
  }

  .stat-col {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: 1 / span 8;
    min-width: 0;
  }

  .cell {
    box-sizing: border-box;
    padding: 0.3rem 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    width: 100%;
    min-width: 0;
    font-size: 13px;
    line-height: 1.15;
    text-align: center;
  }

  .header,
  .subheader {
    background: color-mix(in srgb, var(--dark, var(--shw-color-primary)) 55%, #1c1828);
    color: var(--shw-color-text, #e8e4f0);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .subheader {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .value {
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    color: var(--shw-color-text, #e8e4f0);
    gap: 0.15rem;
    min-height: 2rem;
  }
</style>
