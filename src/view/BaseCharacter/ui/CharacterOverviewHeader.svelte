<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import { t } from '../../../shared/i18n';
  import { healthCoefficientValue } from '../../../shared/helpers/Character/coefficients';
  import CharacterDamagePanel from './CharacterDamagePanel.svelte';
  import SourceBreakdown from './SourceBreakdown.svelte';
  import SheetPanel from './SheetPanel.svelte';
  let {
    actor,
    editing,
    onEdit,
  }: { actor: ShwActor<'character'>; editing: boolean; onEdit: () => void } = $props();
  let panel = $state<'speed' | 'health' | 'heal' | 'barrier' | 'damage' | null>(null);
  let amount = $state(1);
  let busy = $state(false);
  let error = $state('');
  const hp = $derived(Math.max(0, actor.system.health.value));
  const maxHp = $derived(Math.max(0, actor.system.totals.health));
  const barrier = $derived(Math.max(0, actor.system.barrier.value));
  const maxBarrier = $derived(Math.max(0, actor.system.totals.barrier));
  const longest = $derived(Math.max(1, maxHp, maxBarrier));
  const hpWidth = $derived(Math.max(30, (maxHp / longest) * 100));
  const barrierWidth = $derived(Math.max(30, (maxBarrier / longest) * 100));
  const overcharge = $derived(maxBarrier > 0 ? barrier / maxBarrier : 0);
  const healed = $derived(
    Math.min(maxHp, hp + Math.max(0, amount || 0) * healthCoefficientValue(maxHp)),
  );
  const initials = $derived(
    actor.name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join(''),
  );
  async function applyResource() {
    busy = true;
    error = '';
    try {
      await actor.update(
        panel === 'heal'
          ? { 'system.health.value': healed }
          : { 'system.barrier.value': barrier + Math.max(0, amount || 0) },
      );
      panel = null;
    } catch (e) {
      error = String(e);
    } finally {
      busy = false;
    }
  }
</script>

<div class="character-toolbar">
  <span class="brand">SHATTERED WORLDS</span>
  <button
    type="button"
    class="edit-toggle"
    class:active={editing}
    aria-pressed={editing}
    title={t('newUi.editCharacter')}
    aria-label={t('newUi.editCharacter')}
    onclick={onEdit}><i class="fa-solid fa-wrench" aria-hidden="true"></i></button
  >
  <button
    type="button"
    class="icon-button sheet-close"
    aria-label={t('newUi.close')}
    onclick={() => actor.sheet?.close()}>×</button
  >
</div>
<header class="character-overview">
  {#if actor.img && !actor.img.startsWith('data:') && !actor.img.includes('mystery-man')}
    <img class="character-avatar" src={actor.img} alt={actor.name} data-edit="img" />
  {:else}<div class="character-avatar initials avatar-placeholder">
      {initials}<img src={actor.img} alt={actor.name} title={actor.name} data-edit="img" />
    </div>{/if}
  <div class="character-identity">
    <h1>{actor.name}</h1>
    <div class="identity-meta">
      <span>{t('newUi.level')} {actor.system.utility.level}</span><button
        type="button"
        class="text-button"
        onclick={() => (panel = 'speed')}
        >{t('character.utility.speed')} {actor.system.totals.speed} ›</button
      >
    </div>
  </div>
  <div class="compact-resources">
    <div class="resource-readings">
      <div
        class="resource-row barrier"
        class:overcharged={overcharge > 1}
        class:triple={overcharge >= 3}
      >
        <span>{t('newUi.barrier')}</span><strong
          >{barrier}{#if overcharge > 1}
            · ×{Number(overcharge.toFixed(1))}{/if}</strong
        >
        <div class="resource-track" style:width="{barrierWidth}%">
          <div
            style:width="{Math.min(
              100,
              maxBarrier > 0 ? (barrier / maxBarrier) * 100 : barrier > 0 ? 100 : 0,
            )}%"
          ></div>
        </div>
      </div>
      <div class="resource-row health">
        <button
          type="button"
          class="text-button"
          onclick={() => (panel = 'health')}
          aria-label={t('character.health.max')}>{t('newUi.hp')}</button
        ><strong>{hp} / {maxHp}</strong>
        <div class="resource-track" style:width="{hpWidth}%">
          <div style:width="{Math.min(100, maxHp > 0 ? (hp / maxHp) * 100 : 0)}%"></div>
        </div>
      </div>
    </div>
    <div class="resource-actions">
      <button
        type="button"
        class="icon-button barrier-action"
        aria-label={t('newUi.addBarrier')}
        title={t('newUi.addBarrier')}
        onclick={() => {
          panel = 'barrier';
          amount = 1;
        }}><i class="fas fa-shield" aria-hidden="true"></i></button
      >
      <button
        type="button"
        class="icon-button heal-action"
        aria-label={t('newUi.heal')}
        title={t('newUi.heal')}
        onclick={() => {
          panel = 'heal';
          amount = 1;
        }}><i class="fas fa-heart" aria-hidden="true"></i></button
      >
      <button
        type="button"
        class="icon-button damage-action"
        aria-label={t('character.applyDamage')}
        title={t('character.applyDamage')}
        onclick={() => (panel = 'damage')}><i class="fas fa-sword" aria-hidden="true"></i></button
      >
    </div>
  </div>
</header>
{#if panel}
  <SheetPanel
    title={panel === 'speed'
      ? t('character.utility.speed')
      : panel === 'health'
        ? t('character.health.max')
        : panel === 'heal'
          ? t('newUi.heal')
          : panel === 'barrier'
            ? t('newUi.addBarrier')
            : t('character.applyDamage')}
    wide={panel === 'damage'}
    onClose={() => { panel = null; }}
  >
    {#if panel === 'speed' && actor.system.speedStatSources}
      <SourceBreakdown
        sources={actor.system.speedStatSources}
        total={actor.system.totals.speed}
        onChange={(value) => actor.update({ 'system.utility.speedExtra': value })}
      />
    {:else if panel === 'health' && actor.system.healthStatSources}
      <h3>{t('character.health.max')}</h3>
      <SourceBreakdown
        sources={actor.system.healthStatSources}
        total={maxHp}
        onChange={(value) => actor.update({ 'system.health.extra': value })}
      />
      {#if actor.system.additionalStatSources?.barrier}<h3>{t('newUi.normalBarrier')}</h3>
        <SourceBreakdown
          sources={actor.system.additionalStatSources.barrier}
          total={maxBarrier}
          onChange={(value) => actor.update({ 'system.additionalAttributes.barrier': value })}
        />{/if}
    {:else if panel === 'damage'}
      <CharacterDamagePanel {actor} onApplied={() => (panel = null)} />
    {:else}
      <p class="muted">{t('newUi.hp')} {hp} / {maxHp} · {t('newUi.barrier')} {barrier}</p>
      <label class="form-field"
        >{panel === 'heal' ? t('newUi.coefficientCount') : t('newUi.amount')}
        <div class="number-stepper coefficient-stepper">
          <button
            type="button"
            class="outline-button"
            onclick={() => (amount = Math.max(0, (amount || 0) - 1))}>−</button
          >
          <input type="number" min="0" step="1" bind:value={amount} />
          <button type="button" class="outline-button" onclick={() => (amount = (amount || 0) + 1)}
            >+</button
          >
          <span
            >{panel === 'heal'
              ? `1КЗ = ${healthCoefficientValue(maxHp)}`
              : `${t('newUi.normalBarrier')}: ${maxBarrier}`}</span
          >
        </div>
      </label>
      <h2>
        {panel === 'heal' ? hp : barrier} → {panel === 'heal'
          ? healed
          : barrier + Math.max(0, amount || 0)}
      </h2>
      <p class="muted">{t(panel === 'heal' ? 'newUi.healLimit' : 'newUi.barrierNoLimit')}</p>
      <details class="calculation-details">
        <summary>{t('newUi.howCalculated')} ›</summary>
        <p>
          {panel === 'heal'
            ? `${hp} + ${Math.max(0, amount || 0)} × ${healthCoefficientValue(maxHp)} → ${healed}`
            : `${barrier} + ${Math.max(0, amount || 0)}`}
        </p>
      </details>
      {#if error}<p role="alert">{error}</p>{/if}
      <button
        type="button"
        class="primary wide"
        disabled={busy || !(amount > 0) || (panel === 'heal' && healed === hp)}
        onclick={applyResource}>{t('newUi.apply')}</button
      >
    {/if}
  </SheetPanel>
{/if}
