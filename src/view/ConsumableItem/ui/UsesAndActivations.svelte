<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { ActivationType, PerType } from "../../../entities/consumable/model";
  import { ActivationControl } from "../../../features/activation";
  import { UsesControl } from "../../../features/uses";
  import { getUpdateConsumable } from "../utils/updateConsumable";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);

  function handleUsesValueChange(value: number) {
    updateConsumable("uses.value", value);
  }

  function handleUsesMaxChange(max: number) {
    updateConsumable("uses.max", max);
  }

  function handleUsesPerChange(per: PerType) {
    updateConsumable("uses.per", per);
  }

  function handleActivationTypeChange(type: ActivationType) {
    updateConsumable("activation.type", type);
  }

  function handleActivationCostChange(cost: number) {
    updateConsumable("activation.cost", cost);
  }
</script>

<section class="uses-activation-section">
  <UsesControl
    usesValue={item.system.uses.value}
    usesMax={item.system.uses.max}
    usesPer={item.system.uses.per}
    onUsesValueChange={handleUsesValueChange}
    onUsesMaxChange={handleUsesMaxChange}
    onUsesPerChange={handleUsesPerChange}
  />

  <ActivationControl
    activationType={item.system.activation.type}
    activationCost={item.system.activation.cost}
    onActivationTypeChange={handleActivationTypeChange}
    onActivationCostChange={handleActivationCostChange}
  />
</section>

<style>
  .uses-activation-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    background: var(--color-border-light-3);
    padding: 0;
  }
</style>
