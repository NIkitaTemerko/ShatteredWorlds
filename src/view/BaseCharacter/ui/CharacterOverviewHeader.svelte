<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import { t } from '../../../shared/i18n';
  import {
    healthCoefficientValue,
    scaleHealthCoefficients,
  } from '../../../shared/helpers/Character/coefficients';
  import CharacterDamagePanel from './CharacterDamagePanel.svelte';
  import SourceBreakdown from './SourceBreakdown.svelte';
  import SheetPanel from './SheetPanel.svelte';

  const panelTitles = {
    speed: 'character.utility.speed',
    health: 'character.health.current',
    barrier: 'additionalAttributes.barrier',
    heal: 'newUi.heal',
    addBarrier: 'newUi.addBarrier',
    damage: 'character.applyDamage',
  } as const;

  let {
    actor,
    editing,
    onEdit,
  }: {
    actor: ShwActor;
    editing: boolean;
    onEdit: () => void;
  } = $props();
  const amountId = $props.id();
  let panel = $state<keyof typeof panelTitles | null>(null);
  let amount = $state(1);
  let copiedHealing = $state<number | null>(null);
  let busy = $state(false);
  let error = $state('');
  const isNpc = $derived(actor.type === 'npc');
  const hp = $derived(Math.max(0, actor.system.health.value));
  const maxHp = $derived(Math.max(0, actor.system.totals.health));
  const barrier = $derived(Math.max(0, actor.system.barrier.value));
  const maxBarrier = $derived(Math.max(0, actor.system.totals.barrier));
  const longest = $derived(Math.max(1, maxHp, maxBarrier));
  const hpWidth = $derived(Math.max(30, (maxHp / longest) * 100));
  const barrierWidth = $derived(Math.max(30, (maxBarrier / longest) * 100));
  const overcharge = $derived(maxBarrier > 0 ? barrier / maxBarrier : 0);
  const healUnit = $derived(healthCoefficientValue(maxHp));
  const healing = $derived(scaleHealthCoefficients(Math.max(0, amount || 0), maxHp));
  const healed = $derived(Math.min(maxHp, hp + healing));
  const nextBarrier = $derived(barrier + Math.max(0, amount || 0));
  const initials = $derived(
    actor.name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join(''),
  );
  function updateSpeedExtra(value: number) {
    const { base, growth } = actor.system.speedStatSources;
    return actor.update(
      isNpc
        ? { 'system.utility.speed': base + growth + value }
        : { 'system.utility.speedExtra': value },
    );
  }
  async function updateCurrentHealth(event: Event & { currentTarget: HTMLInputElement }) {
    const input = event.currentTarget;
    const value = input.valueAsNumber;
    const nextHealth = Number.isFinite(value) ? Math.min(maxHp, Math.max(0, Math.trunc(value))) : hp;
    input.value = String(nextHealth);
    if (nextHealth === hp) return;

    busy = true;
    error = '';
    try {
      await actor.update({ 'system.health.value': nextHealth });
    } catch (e) {
      input.value = String(hp);
      error = String(e);
    } finally {
      busy = false;
    }
  }

  async function copyHealing() {
    const value = healing;
    try {
      await navigator.clipboard.writeText(String(value));
      copiedHealing = value;
      error = '';
    } catch (e) {
      error = String(e);
    }
  }

  async function applyResource() {
    busy = true;
    error = '';
    try {
      await actor.update(
        panel === 'heal'
          ? { 'system.health.value': healed }
          : { 'system.barrier.value': nextBarrier },
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
    aria-label={t('common.close')}
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
      <span>{t('newUi.level')} {actor.system.utility.level}</span>
      <button type="button" class="text-button" onclick={() => (panel = 'speed')}
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
        <button type="button" class="text-button" onclick={() => (panel = 'barrier')}
          >{t('additionalAttributes.barrier')}</button
        ><strong
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
          onclick={() => {
            panel = 'health';
            error = '';
          }}>{t('newUi.hp')}</button
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
          panel = 'addBarrier';
          amount = 1;
          error = '';
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
          copiedHealing = null;
          error = '';
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
    title={t(panelTitles[panel])}
    wide={panel === 'damage'}
    onClose={() => { panel = null; }}
  >
    {#if panel === 'speed'}
      {#if actor.system.speedStatSources}
        <SourceBreakdown
          sources={actor.system.speedStatSources}
          total={actor.system.totals.speed}
          includeItemSources={!isNpc}
          onChange={updateSpeedExtra}
        />
      {/if}
    {:else if panel === 'health'}
      <label class="form-field">
        {t('character.health.current')}
        <input
          type="number"
          min="0"
          max={maxHp}
          step="1"
          value={hp}
          disabled={busy}
          onchange={updateCurrentHealth}
          onkeydown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
        />
      </label>
      {#if error}<p role="alert">{error}</p>{/if}
      <h3>{t('character.health.max')}</h3>
      {#if isNpc}
        <p>{maxHp}</p>
      {:else if actor.system.healthStatSources}
        <SourceBreakdown
          sources={actor.system.healthStatSources}
          total={maxHp}
          onChange={(value) => actor.update({ 'system.health.extra': value })}
        />
      {/if}
    {:else if panel === 'barrier'}
      <p class="muted">{t('character.barrier.current')} {barrier}</p>
      {#if actor.system.additionalStatSources?.barrier}
        <h3>{t('newUi.normalBarrier')}</h3>
        <SourceBreakdown
          sources={actor.system.additionalStatSources.barrier}
          includeItemSources={!isNpc}
          total={maxBarrier}
          onChange={(value) => actor.update({ 'system.additionalAttributes.barrier': value })}
        />
      {/if}
    {:else if panel === 'damage'}
      <CharacterDamagePanel {actor} onApplied={() => (panel = null)} />
    {:else}
      <p class="muted">{t('newUi.hp')} {hp} / {maxHp} · {t('additionalAttributes.barrier')} {barrier}</p>
      <div class="form-field">
        <label for={amountId}>
          {panel === 'heal' ? t('newUi.coefficientCount') : t('newUi.amount')}
        </label>
        <div class="number-stepper coefficient-stepper">
          <button
            type="button"
            class="outline-button"
            onclick={() => (amount = Math.max(0, (amount || 0) - 1))}>−</button
          >
          <input id={amountId} type="number" min="0" step="1" bind:value={amount} />
          <button type="button" class="outline-button" onclick={() => (amount = (amount || 0) + 1)}
            >+</button
          >
          <span title={panel === 'heal' ? t('character.coefficient.healthInfo') : undefined}>
            {panel === 'heal' ? `1КЗ = ${healUnit}` : `${t('newUi.normalBarrier')}: ${maxBarrier}`}
          </span>
        </div>
      </div>
      <h2>
        {panel === 'heal' ? hp : barrier} → {panel === 'heal' ? healed : nextBarrier}
      </h2>
      {#if error}<p role="alert">{error}</p>{/if}
      <div class="panel-actions">
        {#if panel === 'heal'}
          <button type="button" class="outline-button" disabled={!Number.isInteger(amount)} onclick={copyHealing}>
            {t(copiedHealing === healing ? 'newUi.copied' : 'newUi.copy')} {healing}
          </button>
        {/if}
        <button
          type="button"
          class="primary"
          disabled={busy || !(amount > 0) || !Number.isInteger(amount) ||
            (panel === 'heal' ? healed === hp : nextBarrier === barrier)}
          onclick={applyResource}>{t('newUi.apply')}</button
        >
      </div>
    {/if}
  </SheetPanel>
{/if}
