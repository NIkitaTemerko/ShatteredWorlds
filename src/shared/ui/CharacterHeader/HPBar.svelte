<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import { ActionIcon } from '../ActionIcon';
  import Input from '../Input/ui.svelte';

  interface Props {
    actor: ShwActor<'character'> | ShwActor<'npc'>;
  }

  let { actor }: Props = $props();

  let defenseActive = $state(true);
  let damageValue = $state(0);

  function toggleDefense() {
    defenseActive = !defenseActive;
  }

  function applyDamage() {
    if (damageValue <= 0) return;

    const damageReduction = actor.system.additionalAttributes.damageReduction || 0;

    let actualDamage = Math.max(0, damageValue - damageReduction);
    if (defenseActive) {
      const armorClass = actor.system.additionalAttributes.armorClass || 0;
      actualDamage = Math.max(0, actualDamage - armorClass);
    }

    const newHealth = Math.max(0, actor.system.health.value - actualDamage);
    actor.update({ 'system.health.value': newHealth });
    damageValue = 0;
  }

  function clampHealthValue(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const value = Number(target.value);
    const min = Number(target.min);
    const max = Number(target.max);
    target.value = String(Math.min(Math.max(value, min), max));
  }

  function clampHealthMax(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const value = Number(target.value);
    const min = Number(target.min);
    target.value = String(Math.max(value, min));
  }
</script>

<div class="hp-wrapper">
  <progress class="hp-bar" value={actor.system.health.value} max={actor.system.helpers.totalHealth}></progress>
  <span class="hp-label">
    <label>
      <Input
        variant="underline"
        name="system.health.value"
        type="number"
        data-dtype="Number"
        min="0"
        max={actor.system.helpers.totalHealth}
        oninput={clampHealthValue}
        value={actor.system.health.value}
        style="width:3rem;text-align:right;"
      />
    </label>
    /
    <label>
      <Input
        variant="underline"
        name="system.health.max"
        type="number"
        data-dtype="Number"
        min="0"
        oninput={clampHealthMax}
        value={actor.system.health.max}
        style="width:3rem;text-align:right;"
      />
    </label>
    <span>({actor.system.helpers.totalHealth})</span>
  </span>
  <div class="hp-damage-wrapper">
    <ActionIcon
      title="Применить урон"
      onclick={applyDamage}
      onkeydown={(e) => e.key === 'Enter' && applyDamage()}
    >
      {#snippet icon()}
        <i class="fas fa-sword damage-icon"></i>
      {/snippet}
    </ActionIcon>
    <Input variant="underline" bind:value={damageValue} onkeydown={(e) => e.key === 'Enter' && applyDamage()} type="number" min={0} style="width:3rem;" />
    <ActionIcon
      title="Учитывать защиту"
      onclick={toggleDefense}
      onkeydown={(e) => e.key === 'Enter' && toggleDefense()}
    >
      {#snippet icon()}
        <i
          class="fas fa-shield-alt shield-icon"
          class:active={defenseActive}
        ></i>
      {/snippet}
    </ActionIcon>
  </div>
</div>

<style>
  .hp-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hp-bar {
    flex-grow: 1;
    width: 200px;
    height: 20px;
    appearance: none;
    border: 1px solid var(--color-border-light-2);
    background: #ff9aa5;
  }

  .hp-bar::-webkit-progress-bar {
    background: #ff9aa5;
  }

  .hp-bar::-webkit-progress-value {
    background: #d7263d;
  }

  .hp-bar::-moz-progress-bar {
    background: #d7263d;
  }

  .hp-label {
    font-size: var(--font-size-12);
  }

  .hp-damage-wrapper {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: 0.5rem;
  }

  .damage-icon {
    cursor: pointer;
    font-size: var(--font-size-14);
    line-height: 1;
    transform: rotate(-135deg);
  }

  .damage-icon:hover {
    color: #d7263d;
  }

  .shield-icon {
    position: relative;
    cursor: pointer;
    font-size: var(--font-size-14);
    line-height: 1;
  }

  .shield-icon:not(.active) {
    color: grey;
  }

  .shield-icon:not(.active):after {
    position: absolute;
    content: 'X';
    font-size: 16px;
    transform: translate(10%, -10%);
    left: 0;
    top: 0;
    color: red;
  }

  .shield-icon.active {
    color: cadetblue;
  }
</style>
