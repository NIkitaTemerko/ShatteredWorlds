<script lang="ts">
  import { Input, SelectInput } from '../../../shared/ui';
  import { PER_TYPES, type PerType } from '../../../entities/consumable/model';

  interface Props {
    usesValue: number;
    usesMax: number;
    usesPer: PerType;
    onUsesValueChange: (value: number) => void;
    onUsesMaxChange: (max: number) => void;
    onUsesPerChange: (per: PerType) => void;
  }

  let { usesValue, usesMax, usesPer, onUsesValueChange, onUsesMaxChange, onUsesPerChange }: Props =
    $props();

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

<div class="uses-control" style="--dark: #8B5CF6; --light: #EDE9FE">
  <div class="control-header">
    <span class="control-label">Заряды</span>
  </div>
  <div class="control-body">
    <div class="uses-inputs">
      <Input
        type="number"
        min="0"
        value={usesValue}
        variant="underline"
        textAlign="center"
        class="tw:flex-1"
        onchange={handleValueChange}
      />
      <span class="divider">из</span>
      <Input
        type="number"
        min="0"
        value={usesMax}
        variant="underline"
        textAlign="center"
        class="tw:flex-1"
        onchange={handleMaxChange}
      />
    </div>
    <SelectInput
      value={usesPer}
      options={PER_TYPES}
      variant="underline"
      fullWidth
      onchange={handlePerChange}
    />
  </div>
</div>

<style>
  .uses-control {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .control-header {
    background: var(--dark, #666);
    color: #000;
    padding: 0.35rem 0.25rem;
    font-weight: 700;
    font-size: var(--font-size-14, 14px);
    text-align: center;
  }

  .control-label {
    display: block;
  }

  .control-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: var(--light, #f0f0f0);
    padding: 0.35rem 0.25rem;
  }

  .uses-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    padding: 0;
  }

  .divider {
    font-weight: 700;
    pointer-events: none;
    color: #000;
  }

  .control-body :global(.shw-select) {
    background: transparent;
  }

  .control-body :global(.shw-input) {
    background: transparent;
    padding: 0.25rem 0;
  }
</style>
