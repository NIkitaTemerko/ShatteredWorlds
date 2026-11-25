<script lang="ts">
  import { untrack } from 'svelte';
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import { t } from '../../../shared/i18n';
  import {
    ALL_ADDITIONAL_KEYS,
    ADDITIONAL_ATTRIBUTE_LABELS,
    STAT_KEYS,
  } from '../../../shared/model/constants';
  import { attributeCoefficientValue } from '../../../shared/helpers/Character/coefficients';
  import { getNpcAdditionalStatBaseBonus } from '../../../shared/helpers/Npc/npcAdditionalStatBonuses';
  let { actor, onClose }: { actor: ShwActor; onClose: () => void } = $props();
  const isNpc = $derived(actor.type === 'npc');
  const attributeFields = ['value', 'extra', 'charBonusBase', 'saveBonusBase'] as const;
  let name = $state(untrack(() => actor.name));
  let level = $state(untrack(() => actor.system.utility.level));
  let speed = $state(
    untrack(() => (isNpc ? actor.system.utility.speed : actor.system.utility.speedExtra)),
  );
  let health = $state(untrack(() => (isNpc ? actor.system.health.max : actor.system.health.extra)));
  let attributes = $state(untrack(() => structuredClone($state.snapshot(actor.system.attributes))));
  let additional = $state(
    untrack(() => {
      const values = { ...actor.system.additionalAttributes };
      // Stored NPC values are offsets from the default bases.
      if (isNpc) {
        for (const key of ALL_ADDITIONAL_KEYS) values[key] += getNpcAdditionalStatBaseBonus(key);
      }
      return values;
    }),
  );
  let tab = $state<'main' | 'additional'>('main');
  let busy = $state(false);
  let error = $state('');
  async function save() {
    const numbers = [
      level,
      speed,
      health,
      ...STAT_KEYS.flatMap((key) => attributeFields.map((field) => attributes[key][field])),
      ...Object.values(additional),
    ];
    if (
      !name.trim() ||
      numbers.some((value) => typeof value !== 'number' || !Number.isFinite(value)) ||
      level < 1 ||
      (isNpc && (numbers.some((value) => !Number.isInteger(value)) || health < 0))
    ) {
      error = t('newUi.invalidValues');
      return;
    }
    busy = true;
    error = '';
    const updates: Record<string, string | number> = {
      name: name.trim(),
      'system.utility.level': level,
      [isNpc ? 'system.utility.speed' : 'system.utility.speedExtra']: speed,
      [isNpc ? 'system.health.max' : 'system.health.extra']: health,
    };
    if (isNpc && actor.system.health.value > health) updates['system.health.value'] = health;
    for (const key of STAT_KEYS)
      for (const field of attributeFields)
        updates[`system.attributes.${key}.${field}`] = attributes[key][field];
    for (const key of ALL_ADDITIONAL_KEYS)
      updates[`system.additionalAttributes.${key}`] =
        additional[key] - (isNpc ? getNpcAdditionalStatBaseBonus(key) : 0);
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

<section class="character-editor" class:npc-editor={isNpc}>
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
  {#if !isNpc}
    <div class="collection-filters">
      <button type="button" class:active={tab === 'main'} onclick={() => (tab = 'main')}
        >{t('newUi.mainAttributes')} · 5</button
      ><button type="button" class:active={tab === 'additional'} onclick={() => (tab = 'additional')}
        >{t('newUi.additionalAttributes')} · {ALL_ADDITIONAL_KEYS.length + 2}</button
      >
    </div>
  {/if}
  {#if isNpc || tab === 'main'}
    <div class="editor-table">
      <div class="editor-row table-head">
        <span>{t('newUi.parameter')}</span><span>{t('newUi.base')}</span>
        <span>{t('newUi.manualExtra')}</span>
        <span>{t('newUi.bonus')} +</span>
        <span>{t('newUi.save')} +</span>
        <span>{t('newUi.coefficient')}</span>
      </div>
      {#each STAT_KEYS as key}<div class="editor-row">
          <span>{t(`attributes.${key}`)}</span
          >{#each attributeFields as field}<input
              type="number"
              aria-label={`${t(`attributes.${key}`)} ${t(field === 'value' ? 'newUi.base' : field === 'extra' ? 'newUi.manualExtra' : field === 'charBonusBase' ? 'newUi.bonus' : 'newUi.save')}`}
              bind:value={attributes[key][field]}
            />{/each}<strong class="coefficient"
            >{attributeCoefficientValue(
              attributes[key].extra +
                (actor.system.attributeStatSources?.[key]?.extra.equipment ?? 0) +
                (actor.system.attributeStatSources?.[key]?.extra.abilities ?? 0),
            )}</strong
          >
        </div>{/each}
    </div>
  {/if}
  {#if isNpc || tab === 'additional'}
    {#if isNpc}<h3>{t('newUi.additionalAttributes')}</h3>{/if}
    <div class="additional-editor">
      {#each ALL_ADDITIONAL_KEYS as key}<label class="form-field"
          >{t(ADDITIONAL_ATTRIBUTE_LABELS[key])}<input
            type="number"
            bind:value={additional[key]}
          /></label
        >{/each}
      <label class="form-field">
        {t(isNpc ? 'character.utility.speed' : 'newUi.speedExtra')}
        <input type="number" bind:value={speed} />
      </label>
      <label class="form-field">
        {t(isNpc ? 'character.health.max' : 'newUi.healthExtra')}
        <input type="number" min={isNpc ? 0 : undefined} bind:value={health} />
      </label>
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
