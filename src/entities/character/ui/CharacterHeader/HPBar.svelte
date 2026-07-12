<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import { t } from "../../../../shared/i18n";
  import { ActionIcon } from "../../../../shared/ui/ActionIcon";
  import { AnchoredPopup, closeActivePopup } from "../../../../shared/ui/AnchoredPopup";
  import Input from "../../../../shared/ui/Input/ui.svelte";
  import { HealthDetailContent } from "../StatDetailPopup";

  interface Props {
    actor: ShwActor<"character"> | ShwActor<"npc">;
  }

  let { actor }: Props = $props();

  const isCharacter = $derived(actor.isCharacter());
  const maxHealth = $derived(actor.system.totals.health);
  const healthSources = $derived(actor.system.healthStatSources);

  let hpInputText = $state("");

  const hpInputSize = $derived(
    Math.max(1, (hpInputText || String(actor.system.health.value) || "0").length, String(maxHealth).length),
  );

  $effect(() => {
    hpInputText = String(actor.system.health.value);
  });

  // 0 = true damage (skull), 1 = no armor (shield off), 2 = full defense (shield on)
  let damageMode = $state(2);
  let damageValue = $state(0);
  let healthPopupOpen = $state(false);
  let maxHpAnchorEl = $state<HTMLElement | undefined>();

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
        "damageReduction" in actor.system.totals
          ? actor.system.totals.damageReduction
          : actor.system.additionalAttributes.damageReduction || 0;

      actualDamage = Math.max(0, damageValue - damageReduction);

      // Apply armor only in mode 2 (full defense)
      if (damageMode === 2) {
        const armorClass =
          "armorClass" in actor.system.totals
            ? actor.system.totals.armorClass
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

  function handleHealthValueInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    hpInputText = target.value;
    clampHealthValue(e);
  }

  function clampHealthMax(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const value = Number(target.value);
    const min = Number(target.min);
    target.value = String(Math.max(value, min));
  }

  function toggleHealthPopup(e: Event) {
    e.stopPropagation();
    if (!healthPopupOpen) {
      closeActivePopup();
    }
    healthPopupOpen = !healthPopupOpen;
  }

  function closeHealthPopup() {
    healthPopupOpen = false;
  }

  function handleExtraChange(value: number) {
    actor.update({ "system.health.extra": value });
  }
</script>

<div class="hp-wrapper">
  <progress class="hp-bar" value={actor.system.health.value} max={maxHealth}></progress>
  <span class="hp-label">
    <input
      class="hp-current-input"
      name="system.health.value"
      type="number"
      data-dtype="Number"
      min="0"
      max={maxHealth}
      size={hpInputSize}
      oninput={handleHealthValueInput}
      value={actor.system.health.value}
    />
    <span class="hp-separator">/</span>
    {#if isCharacter}
      <button
        type="button"
        class="max-hp-trigger"
        data-popup-id="health-max"
        bind:this={maxHpAnchorEl}
        onclick={toggleHealthPopup}
        title={t("character.statMenu")}
      >
        {maxHealth}
      </button>
      {#if healthPopupOpen && healthSources}
        <AnchoredPopup
          open={true}
          anchorEl={maxHpAnchorEl}
          onClose={closeHealthPopup}
          popupId="health-max"
          triggerMode="click"
        >
          {#snippet children()}
            <HealthDetailContent
              sources={healthSources}
              total={maxHealth}
              onExtraChange={handleExtraChange}
            />
          {/snippet}
        </AnchoredPopup>
      {/if}
    {:else}
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
      {#if maxHealth !== actor.system.health.max}
        <span>({maxHealth})</span>
      {/if}
    {/if}
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
    display: inline-flex;
    align-items: baseline;
    gap: 0;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .hp-separator {
    margin: 0 0.25rem;
    line-height: 1;
    user-select: none;
  }

  .hp-current-input {
    field-sizing: content;
    width: auto;
    min-width: fit-content;
    margin: 0 0.15rem 0 0;
    padding: 0.1rem 0.35rem;
    border: none;
    border-bottom: 1px solid var(--color-border-light-2, rgba(0, 0, 0, 0.2));
    border-radius: 0;
    background: transparent;
    font: inherit;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: inherit;
    text-align: right;
    outline: none;
    appearance: textfield;
    transition: border-color 0.15s ease;
    vertical-align: baseline;
  }

  .hp-current-input:hover {
    border-bottom-color: var(--color-border-dark, rgba(0, 0, 0, 0.4));
  }

  .hp-current-input:focus {
    border-bottom-color: var(--color-primary, #0066cc);
    box-shadow: none;
  }

  .hp-current-input::-webkit-inner-spin-button,
  .hp-current-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .max-hp-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.1rem 0.35rem;
    margin: 0;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    vertical-align: baseline;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .max-hp-trigger:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .max-hp-trigger:active {
    background: rgba(0, 0, 0, 0.08);
  }

  .max-hp-trigger:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.3);
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
