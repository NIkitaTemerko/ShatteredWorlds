<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import type { RollType, RollMode } from '../../../entities/character/model';
  import { ROLL_TYPE_CONFIGS } from '../../../entities/character/model';
  import { t } from '../../../shared/i18n';
  let { actor }: { actor: ShwActor } = $props();
  let attribute = $state<RollType>('force');
  let mode = $state<RollMode>('normal');
  let dice = $state(20);
  let bonus = $state(0);
  let count = $state(1);
  let busy = $state(false);
  let error = $state('');
  const modifier = $derived(
    (attribute === 'natural' ? 0 : actor.system.attributes[attribute].charBonus) + (bonus || 0),
  );
  const formula = $derived(
    `${mode === 'normal' ? '1' : '2'}d${dice || 20}${mode === 'adv' ? 'kh1' : mode === 'dis' ? 'kl1' : ''}${modifier < 0 ? ' − ' : ' + '}${Math.abs(modifier)}`,
  );
  async function roll(save: boolean) {
    busy = true;
    error = '';
    try {
      await actor.roll(
        attribute,
        save,
        mode,
        Math.max(2, dice || 20),
        bonus || 0,
        Math.max(1, count || 1),
      );
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
        >{#each ROLL_TYPE_CONFIGS as option}<option value={option.id}>{t(option.label)}</option
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
    {t('newUi.formula')}: {count > 1 ? `${count} × (${formula})` : formula}
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
