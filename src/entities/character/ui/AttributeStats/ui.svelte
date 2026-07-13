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
      <div class="cell header">{col.label}</div>
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

      <div class="cell subheader">{col.extraTitle}</div>
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

      <div class="cell subheader">{t('character.attributeBonus')}</div>
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

      <div class="cell subheader">{col.saveLabel}</div>
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
    display: flex;
    flex-direction: column;
    background: var(--color-border-light-3);
  }

  .general-panel {
    flex-direction: row;
    gap: 2px;
  }

  .stat-col {
    flex: 1 1 0;
    min-width: 6rem;
  }

  .stat-col:last-child {
    border-right: none;
  }

  .cell {
    padding: 0.35rem 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    width: 100%;
    font-size: var(--font-size-14);
  }

  .header,
  .subheader {
    background: var(--dark);
    color: #000;
  }

  .value {
    background: var(--light);
    color: #000;
    gap: 0.25rem;
  }

  @media (max-width: 900px) {
    .stats-panel {
      flex-wrap: wrap;
    }
    .stat-col {
      flex: 1 1 45%;
      margin-bottom: 4px;
    }
  }
</style>
