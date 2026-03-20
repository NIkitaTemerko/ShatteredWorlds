<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { EquipmentSystem } from "../../../documents/Item/types/EquipmentDataTypes";
  import type { StatModifierBlock } from "../../../documents/Item/types/AbilityDataTypes";
  import { StatBonusesEditor } from "../../../features/statBonuses";
  import { t } from "../../../shared/i18n";
  import { getUpdateEquipment } from "../utils/updateEquipment";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateEquipment = getUpdateEquipment(item);

  const system = $derived(item.system as EquipmentSystem);

  function handleStatBonusesUpdate(statBonuses: StatModifierBlock) {
    updateEquipment("statBonuses", statBonuses);
  }
</script>

<StatBonusesEditor
  statBonuses={system.statBonuses}
  onUpdate={handleStatBonusesUpdate}
  title={t("equipment.bonuses.title")}
  subtitle={t("equipment.bonuses.statModifiers")}
/>
