<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import { t } from "../../../../shared/i18n";
  import { ActionIcon } from "../../../../shared/ui/ActionIcon";
  import Input from "../../../../shared/ui/Input/ui.svelte";

  interface Props {
    actor: ShwActor<"character"> | ShwActor<"npc">;
  }

  let { actor }: Props = $props();

  // 0 = true damage (skull), 1 = no armor (shield off), 2 = full defense (shield on)
  let damageMode = $state(2);
  let damageValue = $state(0);

  function toggleDefense() {
    damageMode = (damageMode + 1) % 3;
  }

  function applyDamage() {
    if (damageValue <= 0) return;

    let actualDamage = damageValue;

    // True damage - ignores everything
    if (damageMode === 0) {
      actualDamage = damageValue;
    } else {
      // Apply damage reduction for modes 1 and 2
      const damageReduction =
        "totalDamageReduction" in actor.system.helpers
          ? actor.system.helpers.totalDamageReduction
          : actor.system.additionalAttributes.damageReduction || 0;

      actualDamage = Math.max(0, damageValue - damageReduction);

      // Apply armor only in mode 2 (full defense)
      if (damageMode === 2) {
        const armorClass =
          "totalArmorClass" in actor.system.helpers
            ? actor.system.helpers.totalArmorClass
            : actor.system.additionalAttributes.armorClass || 0;
        actualDamage = Math.max(0, actualDamage - armorClass);
      }
    }

    const newHealth = Math.max(0, actor.system.health.value - actualDamage);
    actor.update({ "system.health.value": newHealth });
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
        style="min-width:2.5rem;max-width:5rem;text:right;"
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
        style="min-width:2.5rem;max-width:5rem;text-align:right;"
      />
    </label>
    <span>({actor.system.helpers.totalHealth})</span>
  </span>
  <div class="hp-damage-wrapper">
    <ActionIcon
      title={t("character.applyDamage")}
      onclick={applyDamage}
      onkeydown={(e) => e.key === "Enter" && applyDamage()}
    >
      {#snippet icon()}
        <i class="fas fa-sword damage-icon"></i>
      {/snippet}
    </ActionIcon>
    <Input
      variant="underline"
      bind:value={damageValue}
      onkeydown={(e) => e.key === "Enter" && applyDamage()}
      type="number"
      min={0}
      style="width:3rem;"
    />
    <ActionIcon
      title={damageMode === 2
        ? t("character.considerArmor")
        : damageMode === 1
          ? t("character.ignoreArmor")
          : t("character.trueDamage")}
      onclick={toggleDefense}
      onkeydown={(e) => e.key === "Enter" && toggleDefense()}
    >
      {#snippet icon()}
        {#if damageMode === 0}
          <i class="fas fa-skull skull-icon"></i>
        {:else}
          <i class="fas fa-shield-alt shield-icon" class:active={damageMode === 2}></i>
        {/if}
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
    font-size: var(--font-size-14);
    flex-shrink: 0;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }

  .hp-damage-wrapper {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: 0.5rem;
  }

  .damage-icon {
    cursor: pointer;
    font-size: var(--font-size-18);
    line-height: 1;
    transform: rotate(-135deg);
  }

  .damage-icon:hover {
    color: #d7263d;
  }

  .shield-icon {
    position: relative;
    cursor: pointer;
    font-size: var(--font-size-18);
    line-height: 1;
  }

  .shield-icon:not(.active) {
    color: grey;
  }

  .shield-icon:not(.active):after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 150%;
    height: 3px;
    background-color: #d7263d;
    transform: translate(-50%, -50%) rotate(-45deg);
    border-radius: 2px;
  }

  .shield-icon.active {
    color: cadetblue;
  }

  .skull-icon {
    cursor: pointer;
    font-size: var(--font-size-18);
    line-height: 1;
    color: #d7263d;
  }
</style>
