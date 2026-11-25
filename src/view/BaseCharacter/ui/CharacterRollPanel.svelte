<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import {
    buildCharacterRollExpression,
    type RollAttribute,
    type RollMode,
  } from '../../../shared/helpers/Character/buildCharacterRollExpression';
  import { STAT_KEYS, STAT_NAME_KEYS } from '../../../shared/model/constants';
  import { t } from '../../../shared/i18n';
  let { actor }: { actor: ShwActor } = $props();
  let attribute = $state<RollAttribute>('force');
  let mode = $state<RollMode>('normal');
  let dice = $state(20);
  let bonus = $state(0);
  let count = $state(1);
  let busy = $state(false);
  let error = $state('');
  const attributes = ['natural', ...STAT_KEYS] as const;
  const sides = $derived(Math.min(999, Math.max(2, Math.trunc(dice || 20))));
  const repeats = $derived(Math.min(100, Math.max(1, Math.trunc(count || 1))));

  function preview(save: boolean) {
    const expression = buildCharacterRollExpression(
      actor.system.attributes,
      attribute,
      save,
      mode,
      sides,
      bonus || 0,
    );
    return repeats > 1 ? `${repeats} × (${expression})` : expression;
  }

  async function roll(save: boolean) {
    busy = true;
    error = '';
    try {
      await actor.roll(attribute, save, mode, sides, bonus || 0, repeats);
    } catch (e) {
      error = String(e);
    } finally {
      busy = false;
    }
  }
</script>

<section class="character-roll" aria-label={t('newUi.roll')}>
  <h3>{t('newUi.roll')}</h3>
  <div class="roll-fields">
    <label class="form-field"
      >{t('newUi.attribute')}<select bind:value={attribute}
        >{#each attributes as key}<option value={key}>{t(STAT_NAME_KEYS[key])}</option
          >{/each}</select
      ></label
    >
    <label class="form-field"
      >{t('newUi.die')}<input type="number" min="2" max="999" bind:value={dice} /></label
    >
    <label class="form-field"
      >{t('newUi.rollBonus')}<input type="number" bind:value={bonus} /></label
    >
    <label class="form-field"
      >{t('newUi.rollCount')}<input type="number" min="1" max="100" bind:value={count} /></label
    >
  </div>
  <p class="roll-formula">
    {t('newUi.roll')}: {preview(false)}
    {#if attribute !== 'natural'} · {t('newUi.saveRoll')}: {preview(true)}{/if}
  </p>
  <div class="roll-actions">
    <div class="roll-modes" role="group" aria-label={t('newUi.rollMode')}>
      {#each ['normal', 'adv', 'dis'] as value}<button
          type="button"
          class:active={mode === value}
          aria-pressed={mode === value}
          onclick={() => (mode = value as RollMode)}
          >{t(
            value === 'normal'
              ? 'roll.normal'
              : value === 'adv'
                ? 'roll.advantage'
                : 'roll.disadvantage',
          )}</button
        >{/each}
    </div>
    <button type="button" class="primary" disabled={busy} onclick={() => roll(false)}
      >{t('newUi.executeRoll')}</button
    >
    <button
      type="button"
      class="outline-button"
      disabled={busy || attribute === 'natural'}
      onclick={() => roll(true)}>{t('newUi.saveRoll')}</button
    >
  </div>
  {#if error}<p role="alert">{error}</p>{/if}
</section>
