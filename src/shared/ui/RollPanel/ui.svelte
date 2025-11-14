<script lang="ts">
  import type { RollMode, RollType, RollTypeConfig } from '../../model';
  import { ROLL_TYPE_CONFIGS } from '../../model';
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import { Input } from '../Input';

  interface Props {
    actor: ShwActor<'character' | 'npc'>;
  }

  let { actor }: Props = $props();

  let activeTab = $state<RollType>('natural');
  let mode = $state<RollMode>('normal');
  let natRoll = $state(20);
  let rollBonus = $state(0);
  let actions = $state(1);

  const activeConfig = $derived(ROLL_TYPE_CONFIGS.find((t) => t.id === activeTab));
</script>

<div class="roll-panel">
  <div class="tabs">
    {#each ROLL_TYPE_CONFIGS as tab}
      <button
        type="button"
        class="tab {activeTab === tab.id ? 'active' : ''}"
        style="--dark:{tab.colors.dark}; --light:{tab.colors.light}; --hover:{tab.colors.hover};"
        onclick={() => (activeTab = tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <div
    class="actions"
    style="--dark:{activeConfig?.colors.dark}; --light:{activeConfig?.colors.light}; --hover:{activeConfig?.colors.hover};"
  >
    <div class="roll-value">
      <label>
        База
        <Input class="tw:w-10" type="number" bind:value={natRoll} min="0" max="999" />
      </label>
    </div>
    <div class="roll-value bonus">
      <label>
        Бонус
        <Input class="tw:w-10" type="number" bind:value={rollBonus} min="0" max="999" />
      </label>
    </div>
    <div class="roll-value">
      <label>
        Действия
        <Input class="tw:w-10" type="number" bind:value={actions} min="0" max="999" />
      </label>
    </div>

    <button
      class="roll constructor"
      type="button"
      aria-label="Бросок"
      onclick={() => actor.roll(activeTab, false, mode, natRoll, rollBonus, actions)}
    >
      <i class="fa-solid fa-dice-d20" style="color: white"></i>
    </button>
    {#if activeTab !== 'natural'}
      <button
        class="roll constructor"
        type="button"
        aria-label="Бросок защиты"
        onclick={() => actor.roll(activeTab, true, mode, natRoll, rollBonus, actions)}
      >
        <i class="fa-solid fa-shield" style="color: white"></i>
      </button>
    {/if}
    <div class="switch natural">
      <button
        class="adv {mode === 'adv' ? 'active' : ''}"
        type="button"
        aria-label="Преимущество"
        onclick={() => (mode = 'adv')}
      >
        ▲
      </button>
      <button
        class="norm {mode === 'normal' ? 'active' : ''}"
        type="button"
        aria-label="Обычный"
        onclick={() => (mode = 'normal')}
      >
        ●
      </button>
      <button
        class="dis {mode === 'dis' ? 'active' : ''}"
        type="button"
        aria-label="Помеха"
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
    background: var(--color-border-light-3);
    padding: 10px 0;
  }

  .tabs {
    display: flex;
    gap: 0;
    padding: 0;
  }

  .tab {
    flex: 1;
    padding: 8px;
    border-radius: 0;
    background: var(--light);
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #000;
    margin: 0;
  }

  .tab:hover {
    background: var(--hover);
  }

  .tab.active {
    background: var(--dark);
  }

  .actions {
    background: var(--light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    width: 100%;
    padding: 0;
  }

  .roll-value {
    min-width: 5rem;
    background: var(--light);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .roll-value input {
    text-align: center;
    background: transparent;
  }

  .roll-value.bonus {
    background-color: var(--dark);
    color: #fff;
    height: 100%;
  }

  .roll-value.bonus input {
    color: #fff;
  }

  .roll {
    --color-shadow-primary: transparent;
    flex: 1 1 0;
    border: none;
    border-radius: 0;
    padding: 0.3rem;
    height: 100%;
    font-size: var(--font-size-12);
    cursor: pointer;
    background-color: var(--dark);
    margin: 0;
  }

  .roll i {
    font-size: 14px;
    width: 16px;
    text-align: center;
  }

  .roll.constructor i {
    font-size: 30px;
    width: 36px;
    text-align: center;
  }

  .roll:hover {
    background: var(--hover);
  }

  .switch {
    --color-shadow-primary: transparent;
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    margin: 0;
    margin-left: -1px;
  }

  .switch button {
    --color-shadow-primary: transparent;
    outline: none;
    border: none;
    border-radius: 0;
    padding: 0.15rem;
    font-size: var(--font-size-12);
    cursor: pointer;
    background: var(--light);
    color: #888;
    line-height: 1;
    width: 100%;
  }

  .switch button:hover {
    background: var(--hover);
  }

  .switch button.active {
    box-shadow: none;
    background: var(--dark);
  }

  .switch button.active:hover {
    background: var(--hover);
  }

  .switch.natural {
    flex: 0 1 0;
    min-width: 5rem;
    height: 100%;
  }

  .switch.natural > button {
    flex-grow: 1;
  }
</style>
