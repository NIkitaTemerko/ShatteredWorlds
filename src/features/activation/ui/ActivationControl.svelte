<script lang="ts">
  import { Input, SelectInput } from '../../../shared/ui';
  import { ACTIVATION_TYPES, type ActivationType } from '../../../entities/consumable/model';

  interface Props {
    activationType: ActivationType;
    activationCost: number;
    onActivationTypeChange: (type: ActivationType) => void;
    onActivationCostChange: (cost: number) => void;
  }

  let { activationType, activationCost, onActivationTypeChange, onActivationCostChange }: Props =
    $props();

  function handleTypeChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as ActivationType;
    onActivationTypeChange(value);
  }

  function handleCostChange(event: Event) {
    const value = Number((event.currentTarget as HTMLInputElement).value);
    onActivationCostChange(value);
  }
</script>

<div class="activation-control">
  <div class="control-header">
    <span class="control-label">Активация</span>
  </div>
  <div class="control-body">
    <SelectInput
      value={activationType}
      options={ACTIVATION_TYPES}
      variant="square"
      fullWidth
      onchange={handleTypeChange}
    />
    <Input
      type="number"
      min="0"
      value={activationCost}
      variant="underline"
      textAlign="center"
      class="tw:w-full"
      onchange={handleCostChange}
    />
  </div>
</div>

<style>
  .activation-control {
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

  .control-body :global(.shw-select) {
    background: transparent;
    border: none;
    border-bottom: 2px solid var(--dark);
    padding: 0;
  }

  .control-body :global(.shw-input) {
    background: transparent;
    border: none;
    border-bottom: 2px solid var(--dark);
    padding: 0.25rem 0;
  }
</style>
