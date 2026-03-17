<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { EquipmentSystem } from "../../../documents/Item/types/EquipmentDataTypes";
  import { t } from "../../../shared/i18n";
  import { getUpdateEquipment } from "../utils/updateEquipment";
  import EquipmentHeader from "./EquipmentHeader.svelte";
  import EquipmentStats from "./EquipmentStats.svelte";
  import EquipmentBonuses from "./EquipmentBonuses.svelte";
  import LinkedItems from "./LinkedItems.svelte";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const system = $derived(item.system as EquipmentSystem);
  const updateEquipment = getUpdateEquipment(item);
</script>

<div class="equipment-card">
  <EquipmentHeader {item} />

  <EquipmentStats {item} />

  <!-- Описание -->
  <section class="description" style="--dark: #6B7280; --light: #F3F4F6">
    <div class="section-header">{t("item.description.title")}</div>
    <textarea
      bind:value={system.description}
      placeholder={t("item.description.placeholder")}
      onchange={(e) => updateEquipment("description", e.currentTarget.value)}
    ></textarea>
  </section>

  <EquipmentBonuses {item} />

  <LinkedItems {item} />
</div>

<style>
  .equipment-card {
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  section {
    background: transparent;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .description {
    gap: 0;
  }

  .description .section-header {
    background: var(--dark);
    color: #000;
    padding: 0.35rem 0.5rem;
    font-weight: 700;
    font-size: var(--font-size-14);
  }

  .description textarea {
    background: var(--light);
    border: none;
    padding: 5px;
    min-height: 80px;
    resize: vertical;
    font-size: var(--font-size-12);
  }
</style>
