<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import type { AttributeKey } from '../../../documents/Actor/types/ShwActorSystem';
  import { localize, t } from '../../../shared/i18n';
  import { ADDITIONAL_ATTRIBUTE_LABELS } from '../../../shared/model/constants';
  import { sumAttributeExtraSources } from '../../../shared/helpers/Character/collectStatBonusesBySource';
  import {
    ATTRIBUTE_COEFFICIENT_MAX_BASE,
    ATTRIBUTE_COEFFICIENT_RATIO,
    attributeCoefficientValue,
    scaleAttributeCoefficients,
  } from '../../../shared/helpers/Character/coefficients';
  import SourceBreakdown from './SourceBreakdown.svelte';
  import SheetPanel from './SheetPanel.svelte';
  import CharacterRollPanel from './CharacterRollPanel.svelte';
  const keys = ['fortune', 'force', 'finesse', 'will', 'presence'] as const;
  const additional = [
    'actions',
    'bonusActions',
    'reactions',
    'impulse',
    'initiative',
    'barrier',
    'psiDefense',
    'damageReduction',
    'armorClass',
    'range',
    'massCategory',
  ] as const;
  let { actor }: { actor: ShwActor } = $props();
  const countId = $props.id();
  const coefficientPercent = String(ATTRIBUTE_COEFFICIENT_RATIO * 100);
  let selected = $state<AttributeKey>('force');
  let field = $state<
    'value' | 'extra' | 'coefficient' | 'charBonus' | 'saveBonus' | 'overview' | null
  >(null);
  let additionalKey = $state<(typeof additional)[number] | null>(null);
  let count = $state(1);
  let copied = $state(false);
  const attr = $derived(actor.system.attributes[selected]);
  const sources = $derived(actor.system.attributeStatSources?.[selected]);
  const extra = (key: AttributeKey) => {
    const s = actor.system.attributeStatSources?.[key];
    return s ? sumAttributeExtraSources(s.extra) : actor.system.attributes[key].extra;
  };
  const coefficient = (key: AttributeKey) => attributeCoefficientValue(extra(key));
  const selectedExtra = $derived(extra(selected));
  const unitCoefficient = $derived(attributeCoefficientValue(selectedExtra));
  const coefficientCount = $derived(Math.max(0, count || 0));
  const coefficientResult = $derived(scaleAttributeCoefficients(coefficientCount, selectedExtra));
  const sourceTotal = $derived(
    field === 'value'
      ? actor.system.totals[selected]
      : field === 'extra'
        ? extra(selected)
        : field === 'charBonus'
          ? attr.charBonus
          : attr.saveBonus,
  );
  function open(key: AttributeKey, next: typeof field) {
    selected = key;
    field = next;
    if (next === 'coefficient') count = 1;
    copied = false;
  }
  async function copyResult() {
    try {
      await navigator.clipboard.writeText(String(coefficientResult));
      copied = true;
    } catch {
      copied = false;
    }
  }
</script>

<div class="section-heading">
  <h2>{t('newUi.attributes')}</h2>
  <button type="button" class="outline-button" onclick={() => (field = 'overview')}
    >{t('newUi.sources')} ›</button
  >
</div>
<div class="attribute-table" role="table" aria-label={t('newUi.attributes')}>
  <div class="attribute-row table-head" role="row">
    {#each ['parameter', 'total', 'extra', 'coefficient', 'bonus', 'save'] as label}<span
        role="columnheader">{t(`newUi.${label}` as Parameters<typeof t>[0])}</span
      >{/each}
  </div>
  {#each keys as key}
    <div class="attribute-row" class:selected={selected === key} role="row">
      <span role="rowheader">{t(`attributes.${key}`)}</span>
      {#each ['value', 'extra', 'coefficient', 'charBonus', 'saveBonus'] as section}
        <span role="cell"
          ><button
            type="button"
            class="stat-value"
            class:coefficient={section === 'coefficient'}
            aria-label={`${t(`attributes.${key}`)}: ${t(section === 'value' ? 'newUi.total' : section === 'charBonus' ? 'newUi.bonus' : section === 'saveBonus' ? 'newUi.save' : (`newUi.${section}` as Parameters<typeof t>[0]))}`}
            onclick={() => open(key, section as typeof field)}
          >
            {section === 'value'
              ? actor.system.totals[key]
              : section === 'extra'
                ? extra(key)
                : section === 'coefficient'
                  ? coefficient(key)
                  : actor.system.attributes[key][section as 'charBonus' | 'saveBonus']}
          </button></span
        >
      {/each}
    </div>
  {/each}
</div>
<div class="derived-stats">
  {#each additional as key}<button
      type="button"
      class="derived-stat"
      onclick={() => (additionalKey = key)}
      ><span
        >{t(
          key === 'barrier'
            ? 'newUi.normalBarrier'
            : key === 'bonusActions'
              ? 'newUi.bonusActionsShort'
              : key === 'damageReduction'
                ? 'newUi.absorptionShort'
                : key === 'range'
                  ? 'newUi.rangeShort'
                  : key === 'massCategory'
                    ? 'newUi.massShort'
                    : ADDITIONAL_ATTRIBUTE_LABELS[key],
        )}</span
      ><strong>{actor.system.totals[key]}</strong></button
    >{/each}
</div>
<CharacterRollPanel {actor} />
{#if field}
  <SheetPanel
    title={field === 'overview'
      ? t('newUi.sources')
      : `${t(field === 'coefficient' ? 'newUi.coefficients' : 'newUi.sources')} · ${t(`attributes.${selected}`)}`}
    onClose={() => { field = null; }}
  >
    {#if field === 'overview'}
      {#each keys as key}<button
          type="button"
          class="source-link"
          onclick={() => open(key, 'value')}
          ><span>{t(`attributes.${key}`)}</span><strong>{actor.system.totals[key]} ›</strong
          ></button
        >{/each}
      <p class="muted">{t('newUi.sourcesHint')}</p>
    {:else if field === 'coefficient'}
      <div class="form-field">
        <label for={countId}>{t('newUi.coefficientCount')}</label>
        <div class="number-stepper coefficient-stepper">
          <button
            type="button"
            class="outline-button"
            onclick={() => (count = Math.max(0, (count || 0) - 1))}>−</button
          >
          <input
            id={countId}
            type="number"
            min="0"
            step="1"
            aria-describedby={`${countId}-hint`}
            bind:value={count}
          />
          <button type="button" class="outline-button" onclick={() => (count = (count || 0) + 1)}
            >+</button
          >
          <span>1К = {unitCoefficient}</span>
        </div>
      </div>
      <h2>{t('newUi.result')}: {coefficientResult}</h2>
      <p id={`${countId}-hint`} class="muted">
        {localize('character.coefficient.info', {
          percent: coefficientPercent,
          max: String(ATTRIBUTE_COEFFICIENT_MAX_BASE),
        })}
      </p>
      <button type="button" class="primary wide" onclick={copyResult}
        >{t(copied ? 'newUi.copied' : 'newUi.copy')}
        {coefficientResult}</button
      >
    {:else if sources}
      <SourceBreakdown
        sources={sources[field]}
        includeItemSources={actor.type === 'character'}
        total={sourceTotal}
        editable={field === 'value' ? 'base' : 'extra'}
        fromAttribute={field === 'charBonus' || field === 'saveBonus'}
        onChange={(value) =>
          actor.update({
            [`system.attributes.${selected}.${field === 'value' ? 'value' : field === 'extra' ? 'extra' : field === 'charBonus' ? 'charBonusBase' : 'saveBonusBase'}`]:
              value,
          })}
      />
    {/if}
  </SheetPanel>
{/if}
{#if additionalKey && actor.system.additionalStatSources?.[additionalKey]}
  <SheetPanel
    title={t(ADDITIONAL_ATTRIBUTE_LABELS[additionalKey])}
    onClose={() => { additionalKey = null; }}
  >
    <SourceBreakdown
      sources={actor.system.additionalStatSources[additionalKey]}
      includeItemSources={actor.type === 'character'}
      total={actor.system.totals[additionalKey]}
      onChange={(value) =>
        actor.update({ [`system.additionalAttributes.${additionalKey}`]: value })}
    />
  </SheetPanel>
{/if}
