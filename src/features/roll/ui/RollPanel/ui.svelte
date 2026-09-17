<script lang="ts">
  import type { ShwActor } from '../../../../documents/Actor/ShwActor';
  import type { RollMode, RollType } from '../../../../entities/character/model';
  import { ROLL_TYPE_CONFIGS } from '../../../../entities/character/model';
  import { t } from '../../../../shared/i18n';
  import { Input } from '../../../../shared/ui/Input';

  interface Props {
    actor: ShwActor<'character' | 'npc'>;
  }

  let { actor }: Props = $props();

  let activeTab = $state<RollType>('natural');
  let mode = $state<RollMode>('normal');
  let natRoll = $state(20);
  let rollBonus = $state(0);
  let actions = $state(1);

  /** Crystal accents per roll type (icons/underline only — shared glass fill) */
  const ACCENTS: Record<RollType, string> = {
    natural: '#4ec4b6',
    fortune: '#e0b44a',
    force: '#f07178',
    finesse: '#4ec4b6',
    will: '#b57aef',
    presence: '#c4bdd4',
  };

  const accent = $derived(ACCENTS[activeTab]);
</script>

<div class="roll-panel" style="--accent:{accent}">
  <div class="tabs">
    {#each ROLL_TYPE_CONFIGS as tab (tab.id)}
      <button
        type="button"
        class="tab"
        class:active={activeTab === tab.id}
        style="--tab-accent:{ACCENTS[tab.id]}"
        onclick={() => (activeTab = tab.id)}
      >
        {t(tab.label)}
      </button>
    {/each}
  </div>

  <div class="actions">
    <label class="field">
      <span class="field-label">{t('roll.base')}</span>
      <Input variant="underline" class="roll-input" type="number" bind:value={natRoll} min="0" max="999" />
    </label>

    <label class="field field--accent">
      <span class="field-label">{t('roll.bonus')}</span>
      <Input variant="underline" class="roll-input" type="number" bind:value={rollBonus} min="0" max="999" />
    </label>

    <label class="field">
      <span class="field-label">{t('roll.actions')}</span>
      <Input variant="underline" class="roll-input" type="number" bind:value={actions} min="0" max="999" />
    </label>

    <button
      class="roll-btn"
      type="button"
      aria-label={t('roll.rollLabel')}
      onclick={() => actor.roll(activeTab, false, mode, natRoll, rollBonus, actions)}
    >
      <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
    </button>

    {#if activeTab !== 'natural'}
      <button
        class="roll-btn"
        type="button"
        aria-label={t('roll.saveRollLabel')}
        onclick={() => actor.roll(activeTab, true, mode, natRoll, rollBonus, actions)}
      >
        <i class="fa-solid fa-shield" aria-hidden="true"></i>
      </button>
    {/if}

    <div class="mode-switch" role="group" aria-label={t('roll.normal')}>
      <button
        class="mode-btn"
        class:active={mode === 'adv'}
        type="button"
        aria-label={t('roll.advantage')}
        onclick={() => (mode = 'adv')}
      >
        ▲
      </button>
      <button
        class="mode-btn"
        class:active={mode === 'normal'}
        type="button"
        aria-label={t('roll.normal')}
        onclick={() => (mode = 'normal')}
      >
        ●
      </button>
      <button
        class="mode-btn"
        class:active={mode === 'dis'}
        type="button"
        aria-label={t('roll.disadvantage')}
        onclick={() => (mode = 'dis')}
      >
        ▼
      </button>
    </div>
  </div>
</div>

<style>
  .roll-panel {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    box-shadow: var(--shw-shadow-panel);
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
    overflow: hidden;
  }

  .tabs {
    display: flex;
    gap: 1px;
    background: var(--shw-color-border, #4a425c);
  }

  .tab {
    flex: 1 1 0;
    min-width: 0;
    margin: 0;
    padding: 0.55rem 0.25rem;
    border: none;
    border-radius: 0;
    background: rgb(28 24 40 / 90%);
    color: var(--shw-color-text-muted, #9a93ad);
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.15;
    cursor: pointer;
    transition:
      background 0.12s ease,
      color 0.12s ease;
  }

  .tab:hover {
    background: color-mix(in srgb, var(--tab-accent) 22%, #1c1828);
    color: var(--shw-color-text, #e8e4f0);
  }

  .tab.active {
    background: var(--shw-glass-fill-strong, rgb(90 50 140 / 42%));
    color: var(--shw-color-text, #e8e4f0);
    box-shadow: inset 0 -2px 0 var(--tab-accent);
  }

  .actions {
    display: flex;
    align-items: stretch;
    gap: 1px;
    background: var(--shw-color-border, #4a425c);
    min-height: 4.5rem;
  }

  .field {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.5rem 0.35rem;
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
  }

  .field--accent {
    background: color-mix(in srgb, var(--accent) 28%, #1c1828);
  }

  .field-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--shw-color-text-muted, #9a93ad);
    white-space: nowrap;
  }

  .field :global(.roll-input) {
    width: 3rem;
    max-width: 100%;
  }

  .roll-btn {
    flex: 0 0 3.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: none;
    border-radius: 0;
    background: color-mix(in srgb, var(--accent) 45%, #1c1828);
    color: var(--shw-color-text, #e8e4f0);
    cursor: pointer;
  }

  .roll-btn:hover {
    background: color-mix(in srgb, var(--accent) 60%, #1c1828);
  }

  .roll-btn i {
    font-size: 1.35rem;
  }

  .mode-switch {
    flex: 0 0 2.75rem;
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--shw-color-border, #4a425c);
  }

  .mode-btn {
    flex: 1;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 10px;
    line-height: 1;
    cursor: pointer;
  }

  .mode-btn:hover {
    color: var(--shw-color-text, #e8e4f0);
  }

  .mode-btn.active {
    background: color-mix(in srgb, var(--accent) 40%, #1c1828);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
