<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { EquipmentSystem } from "../../../documents/Item/types/EquipmentDataTypes";
  import type { StatModifier } from "../../../documents/Item/types/AbilityDataTypes";
  import type { CharacterStatPath } from "../../../shared/model/characterStatPaths";
  import { StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { BonusCharacteristics } from "../../../shared/ui";
  import { getUpdateEquipment } from "../utils/updateEquipment";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateEquipment = getUpdateEquipment(item);

  const system = $derived(item.system as EquipmentSystem);
  const statModifiers = $derived(system.statBonuses?.modifiers ?? []);

  function handleAddModifier(stat: CharacterStatPath) {
    const newModifier: StatModifier = {
      stat,
      mode: "add",
      value: 0,
      scaling: null,
      condition: undefined,
    };
    const updatedModifiers = [...statModifiers, newModifier];
    updateEquipment("statBonuses", { modifiers: updatedModifiers });
  }

  function handleRemoveModifier(index: number) {
    const updatedModifiers = statModifiers.filter((_, i) => i !== index);
    updateEquipment("statBonuses", { modifiers: updatedModifiers });
  }

  function handleUpdateModifierValue(index: number, value: number) {
    const updatedModifiers = statModifiers.map((mod, i) => (i === index ? { ...mod, value } : mod));
    updateEquipment("statBonuses", { modifiers: updatedModifiers });
  }

  function handleUpdateModifierMode(index: number, mode: "add" | "mul" | "override") {
    const updatedModifiers = statModifiers.map((mod, i) => (i === index ? { ...mod, mode } : mod));
    updateEquipment("statBonuses", { modifiers: updatedModifiers });
  }
</script>

<section style="--dark: #10B981; --light: #D1FAE5">
  <div class="section-header">{t("equipment.bonuses.title")}</div>

  <StatsCard columns={1}>
    <div class="stat-col full" style="--dark: #10B981; --light: #D1FAE5">
      <div class="stat-header">{t("equipment.bonuses.statModifiers")}</div>
      <div class="stat-body full-width">
        <BonusCharacteristics
          modifiers={statModifiers}
          onAdd={handleAddModifier}
          onRemove={handleRemoveModifier}
          onUpdateValue={handleUpdateModifierValue}
          onUpdateMode={handleUpdateModifierMode}
        />
      </div>
    </div>
  </StatsCard>
</section>

<style>
  section {
    background: transparent;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .section-header {
    background: var(--dark);
    color: #000;
    padding: 0.35rem 0.5rem;
    font-weight: 700;
    font-size: var(--font-size-14);
  }

  :global(.full-width) {
    width: 100%;
  }

  :global(.full-width .bonus-characteristics) {
    width: 100%;
  }
</style>
