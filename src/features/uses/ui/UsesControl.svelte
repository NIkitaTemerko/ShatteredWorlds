<script lang="ts">
  import { PER_TYPES, type PerType } from "../../../entities/consumable/model";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";

  interface Props {
    usesValue: number;
    usesMax: number;
    usesPer: PerType;
    onUsesValueChange: (value: number) => void;
    onUsesMaxChange: (max: number) => void;
    onUsesPerChange: (per: PerType) => void;
  }

  let { usesValue, usesMax, usesPer, onUsesValueChange, onUsesMaxChange, onUsesPerChange }: Props = $props();

  function handleValueChange(event: Event) {
    const value = Number((event.currentTarget as HTMLInputElement).value);
    onUsesValueChange(value);
  }

  function handleMaxChange(event: Event) {
    const value = Number((event.currentTarget as HTMLInputElement).value);
    onUsesMaxChange(value);
  }

  function handlePerChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as PerType;
    onUsesPerChange(value);
  }
</script>

<div class="uses-control">
  <div class="control-header">
    <span class="control-label">{t("controls.uses")}</span>
  </div>
  <div class="control-body">
    <div class="uses-inputs">
      <Input
        type="number"
        min="0"
        value={usesValue}
        variant="underline"
        textAlign="center"
        class="uses-input"
        onchange={handleValueChange}
      />
      <span class="divider">{t("controls.usesOf")}</span>
      <Input
        type="number"
        min="0"
        value={usesMax}
        variant="underline"
        textAlign="center"
        class="uses-input"
        onchange={handleMaxChange}
      />
    </div>
    <SelectInput value={usesPer} options={PER_TYPES} variant="underline" fullWidth onchange={handlePerChange} />
  </div>
</div>

<style>
  .uses-control {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    box-shadow: var(--shw-shadow-panel);
    font-family: var(--shw-font, inherit);
  }

  .control-header {
    background: var(--shw-glass-fill-strong, rgb(90 50 140 / 42%));
    color: var(--shw-color-text, #e8e4f0);
    padding: 0.4rem 0.35rem;
    font-weight: 700;
    font-size: 13px;
    text-align: center;
    border-bottom: 1px solid var(--shw-color-border, #4a425c);
  }

  .control-label {
    display: block;
  }

  .control-body {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    padding: 0.45rem 0.35rem;
    overflow: hidden;
    min-width: 0;
  }

  .uses-inputs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .uses-inputs :global(.uses-input),
  .uses-inputs :global(.shw-input-root) {
    flex: 0 1 3.5rem;
    width: 3.5rem;
    min-width: 0;
    max-width: 3.5rem;
  }

  .divider {
    flex: 0 0 auto;
    font-weight: 700;
    pointer-events: none;
    color: var(--shw-color-text-muted, #9a93ad);
  }
</style>
