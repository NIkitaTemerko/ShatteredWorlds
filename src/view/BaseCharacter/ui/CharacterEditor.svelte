<script lang="ts">
  import { untrack } from 'svelte';
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import { t } from '../../../shared/i18n';
  import {
    ALL_ADDITIONAL_KEYS,
    ADDITIONAL_ATTRIBUTE_LABELS,
  } from '../../../shared/model/constants';
  import { attributeCoefficientValue } from '../../../shared/helpers/Character/coefficients';
  let { actor, onClose }: { actor: ShwActor<'character'>; onClose: () => void } = $props();
  const keys = ['fortune', 'force', 'finesse', 'will', 'presence'] as const;
  let name = $state(untrack(() => actor.name));
  let level = $state(untrack(() => actor.system.utility.level));
  let speed = $state(untrack(() => actor.system.utility.speedExtra));
  let health = $state(untrack(() => actor.system.health.extra));
  let attributes = $state(untrack(() => structuredClone($state.snapshot(actor.system.attributes))));
  let additional = $state(untrack(() => ({ ...actor.system.additionalAttributes })));
  let tab = $state<'main' | 'additional'>('main');
  let busy = $state(false);
  let error = $state('');
  async function save() {
    const numbers = [
      level,
      speed,
      health,
      ...keys.flatMap((key) => [
        attributes[key].value,
        attributes[key].extra,
        attributes[key].charBonusBase,
        attributes[key].saveBonusBase,
      ]),
      ...Object.values(additional),
    ];
    if (
      !name.trim() ||
      numbers.some((value) => typeof value !== 'number' || !Number.isFinite(value)) ||
      level < 1
    ) {
      error = t('newUi.invalidValues');
      return;
    }
    busy = true;
    error = '';
    const updates: Record<string, string | number> = {
      name: name.trim(),
      'system.utility.level': level,
      'system.utility.speedExtra': speed,
      'system.health.extra': health,
    };
    for (const key of keys)
      for (const field of ['value', 'extra', 'charBonusBase', 'saveBonusBase'] as const)
        updates[`system.attributes.${key}.${field}`] = attributes[key][field];
    for (const key of ALL_ADDITIONAL_KEYS)
      updates[`system.additionalAttributes.${key}`] = additional[key];
    try {
      await actor.update(updates);
      onClose();
    } catch (e) {
      error = String(e);
    } finally {
      busy = false;
    }
  }
</script>

<section class="character-editor">
  <h2>{t('newUi.editCharacter')}</h2>
  <p class="muted">{t('newUi.editHint')}</p>
  <div class="editor-identity">
    <label class="form-field"
      >{t('character.nameLabel')}<input type="text" bind:value={name} /></label
    >
    <label class="form-field"
      >{t('newUi.level')}<input type="number" min="1" bind:value={level} /></label
    >
  </div>
  <div class="collection-filters">
    <button type="button" class:active={tab === 'main'} onclick={() => (tab = 'main')}
      >{t('newUi.mainAttributes')} · 5</button
    ><button type="button" class:active={tab === 'additional'} onclick={() => (tab = 'additional')}
      >{t('newUi.additionalAttributes')} · {ALL_ADDITIONAL_KEYS.length + 2}</button
    >
  </div>
  {#if tab === 'main'}
    <div class="editor-table">
      <div class="editor-row table-head">
        <span>{t('newUi.parameter')}</span><span>{t('newUi.base')}</span><span
          >{t('newUi.manualExtra')}</span
        ><span>{t('newUi.bonus')} +</span><span>{t('newUi.save')} +</span><span
          >{t('newUi.coefficient')}</span
        >
      </div>
      {#each keys as key}<div class="editor-row">
          <span>{t(`attributes.${key}`)}</span
          >{#each ['value', 'extra', 'charBonusBase', 'saveBonusBase'] as field}<input
              type="number"
              aria-label={`${t(`attributes.${key}`)} ${t(field === 'value' ? 'newUi.base' : field === 'extra' ? 'newUi.manualExtra' : field === 'charBonusBase' ? 'newUi.bonus' : 'newUi.save')}`}
              bind:value={
                attributes[key][field as 'value' | 'extra' | 'charBonusBase' | 'saveBonusBase']
              }
            />{/each}<strong class="coefficient"
            >{attributeCoefficientValue(
              attributes[key].extra +
                (actor.system.attributeStatSources?.[key]?.extra.equipment ?? 0) +
                (actor.system.attributeStatSources?.[key]?.extra.abilities ?? 0),
            )}</strong
          >
        </div>{/each}
    </div>
  {:else}
    <div class="additional-editor">
      {#each ALL_ADDITIONAL_KEYS as key}<label class="form-field"
          >{t(ADDITIONAL_ATTRIBUTE_LABELS[key])}<input
            type="number"
            bind:value={additional[key]}
          /></label
        >{/each}
      <label class="form-field"
        >{t('newUi.speedExtra')}<input type="number" bind:value={speed} /></label
      >
      <label class="form-field"
        >{t('newUi.healthExtra')}<input type="number" bind:value={health} /></label
      >
    </div>
  {/if}
  {#if error}<p role="alert">{error}</p>{/if}
  <footer class="editor-footer">
    <button type="button" class="outline-button" disabled={busy} onclick={onClose}
      >{t('newUi.cancel')}</button
    ><button type="button" class="primary" disabled={busy} onclick={save}>{t('newUi.apply')}</button
    >
  </footer>
</section>
