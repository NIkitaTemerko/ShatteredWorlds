<script lang="ts">
  import { ACTIVATION_TYPES, type ActivationType } from "../../../entities/consumable/model";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";

  interface Props {
    activationType: ActivationType;
    activationCost: number;
    onActivationTypeChange: (type: ActivationType) => void;
    onActivationCostChange: (cost: number) => void;
  }

  let { activationType, activationCost, onActivationTypeChange, onActivationCostChange }: Props = $props();

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
    <span class="control-label">{t("controls.activation")}</span>
  </div>
  <div class="control-body">
    <SelectInput
      value={activationType}
      options={ACTIVATION_TYPES}
      variant="underline"
      fullWidth
      onchange={handleTypeChange}
    />
    <Input
      type="number"
      min="0"
      value={activationCost}
      variant="underline"
      textAlign="center"
      onchange={handleCostChange}
    />
  </div>
</div>

<style>
  .activation-control {
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
  }
</style>
