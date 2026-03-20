<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { EquipmentSlot, EquipmentSystem } from "../../../documents/Item/types/EquipmentDataTypes";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { EQUIPMENT_SLOTS } from "../../../entities/inventory/model/constants";
  import { getUpdateEquipment } from "../utils/updateEquipment";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateEquipment = getUpdateEquipment(item);

  const img = $derived(item.img);
  const system = $derived(item.system as EquipmentSystem);

  function handleSlotChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as EquipmentSlot;
    updateEquipment('slot', value, event);
  }
</script>

<header class="card-header">
  <img src={img} data-edit="img" title={item.name} height="72" width="72" alt="img" />

  <div class="header-main">
    <Input
      class="header-name-input"
      type="text"
      bind:value={item.name}
      placeholder={t("equipment.header.namePlaceholder")}
      onchange={(e) => item.update({ name: e.currentTarget.value })}
      variant="underline"
    />

    <div class="header-slot">
      <span class="slot-label">{t("equipment.header.slotLabel")}</span>
      <SelectInput
        value={system.slot}
        options={EQUIPMENT_SLOTS}
        variant="underline"
        onchange={handleSlotChange}
      />
    </div>
  </div>
</header>

<style>
  .card-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0;
  }

  .header-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .header-main :global(.header-name-input) {
    font-size: 20px;
    font-weight: 700;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }

  .header-slot {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .slot-label {
    font-size: var(--font-size-12);
    font-weight: 600;
    white-space: nowrap;
  }
</style>
