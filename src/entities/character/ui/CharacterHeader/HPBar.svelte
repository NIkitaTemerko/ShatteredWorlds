<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import { t } from "../../../../shared/i18n";
  import { ActionIcon } from "../../../../shared/ui/ActionIcon";
  import { AnchoredPopup, closeActivePopup } from "../../../../shared/ui/AnchoredPopup";
  import { HealthDetailContent } from "../StatDetailPopup";
  import DamagePopupContent from "./DamagePopupContent.svelte";

  interface Props {
    actor: ShwActor<"character"> | ShwActor<"npc">;
  }

  let { actor }: Props = $props();

  const isCharacter = $derived(actor.isCharacter());
  const maxHealth = $derived(actor.system.totals.health);
  const maxBarrier = $derived(actor.system.totals.barrier);
  const currentHealth = $derived(actor.system.health.value);
  const currentBarrier = $derived(actor.system.barrier?.value ?? 0);
  const healthSources = $derived(actor.system.healthStatSources);
  const barrierSources = $derived(actor.system.additionalStatSources?.barrier);

  const totalMax = $derived(Math.max(1, maxHealth + maxBarrier));
  const hpSegmentPercent = $derived((maxHealth / totalMax) * 100);
  const barrierSegmentPercent = $derived((maxBarrier / totalMax) * 100);
  const hpFillPercent = $derived(maxHealth > 0 ? (currentHealth / maxHealth) * 100 : 0);
  const barrierFillPercent = $derived(maxBarrier > 0 ? (currentBarrier / maxBarrier) * 100 : 0);

  let hpInputText = $state("");

  const hpInputSize = $derived(
    Math.max(
      1,
      (hpInputText || String(currentHealth) || "0").length,
      String(maxHealth).length,
    ),
  );

  $effect(() => {
    hpInputText = String(currentHealth);
  });

  let healthPopupOpen = $state(false);
  let damagePopupOpen = $state(false);
  let maxHpAnchorEl = $state<HTMLElement | undefined>();
  let damageAnchorEl = $state<HTMLElement | undefined>();

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
    damagePopupOpen = false;
  }

  function openDamagePopup(e: Event) {
    e.stopPropagation();
    if (damagePopupOpen) return;
    closeActivePopup();
    damagePopupOpen = true;
    healthPopupOpen = false;
  }

  function closeHealthPopup() {
    healthPopupOpen = false;
  }

  function closeDamagePopup() {
    damagePopupOpen = false;
  }

  function handleExtraChange(value: number) {
    actor.update({ "system.health.extra": value });
  }

  function handleBarrierExtraChange(value: number) {
    actor.update({ "system.additionalAttributes.barrier": value });
  }
</script>

<div class="hp-wrapper">
  <div class="hp-bar-track" aria-label={t("character.health.current")}>
    <div class="hp-segment" style={`width: ${hpSegmentPercent}%`}>
      <div class="hp-fill" style={`width: ${hpFillPercent}%`}></div>
    </div>
    {#if maxBarrier > 0}
      <div class="barrier-segment" style={`width: ${barrierSegmentPercent}%`}>
        <div class="barrier-fill" style={`width: ${barrierFillPercent}%`}></div>
      </div>
    {/if}
  </div>

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
      value={currentHealth}
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
              barrierValue={currentBarrier}
              barrierSources={barrierSources}
              barrierTotal={maxBarrier}
              onExtraChange={handleExtraChange}
              onBarrierExtraChange={handleBarrierExtraChange}
            />
          {/snippet}
        </AnchoredPopup>
      {/if}
    {:else}
      <label>
        <input
          class="hp-current-input"
          name="system.health.max"
          type="number"
          data-dtype="Number"
          min="0"
          oninput={clampHealthMax}
          value={actor.system.health.max}
        />
      </label>
      {#if maxHealth !== actor.system.health.max}
        <span>({maxHealth})</span>
      {/if}
    {/if}
    {#if maxBarrier > 0}
      <span class="barrier-indicator" title={t("character.barrier.current")}>
        ({currentBarrier})
      </span>
    {/if}
  </span>

  <div class="hp-damage-wrapper">
    <span bind:this={damageAnchorEl}>
      <ActionIcon
        title={t("character.applyDamage")}
        onclick={openDamagePopup}
        onkeydown={(e) => e.key === "Enter" && openDamagePopup(e)}
      >
        {#snippet icon()}
          <i class="fas fa-sword damage-icon"></i>
        {/snippet}
      </ActionIcon>
    </span>
    {#if damagePopupOpen}
      <AnchoredPopup
        open={true}
        anchorEl={damageAnchorEl}
        onClose={closeDamagePopup}
        popupId="damage-popup"
        triggerMode="click"
      >
        {#snippet children()}
          <DamagePopupContent {actor} onApplied={closeDamagePopup} />
        {/snippet}
      </AnchoredPopup>
    {/if}
  </div>
</div>

<style>
  .hp-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hp-bar-track {
    display: flex;
    flex-grow: 1;
    width: 200px;
    height: 20px;
    border: 1px solid var(--color-border-light-2);
    overflow: hidden;
    background: #ff9aa5;
  }

  .hp-segment,
  .barrier-segment {
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .hp-segment {
    background: #ff9aa5;
  }

  .barrier-segment {
    background: rgba(13, 202, 240, 0.25);
    border-left: 1px solid rgba(0, 0, 0, 0.12);
  }

  .hp-fill,
  .barrier-fill {
    height: 100%;
    transition: width 0.15s ease;
  }

  .hp-fill {
    background: #d7263d;
  }

  .barrier-fill {
    background: #0dcaf0;
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

  .barrier-indicator {
    margin-left: 0.25rem;
    color: #0a8ea8;
    font-size: var(--font-size-13);
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
</style>
