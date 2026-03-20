<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { EquipmentSystem } from "../../../documents/Item/types/EquipmentDataTypes";
  import { RARITY_TYPES, type RarityType, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { RARITY_COLORS } from "../../../shared/model/constants";
  import { getUpdateEquipment } from "../utils/updateEquipment";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateEquipment = getUpdateEquipment(item);

  const system = $derived(item.system as EquipmentSystem);
  const currentRarityColors = $derived(RARITY_COLORS[system.rarity]);

  function handleRarityChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as RarityType;
    updateEquipment("rarity", value);
  }
</script>

<StatsCard columns={3}>
  <div class="stat-col" style="--dark: {currentRarityColors.dark}; --light: {currentRarityColors.light}">
    <div class="stat-header">{t("item.basicStats.rarity")}</div>
    <div class="stat-body">
      <SelectInput
        value={system.rarity}
        options={RARITY_TYPES}
        variant="underline"
        fullWidth
        onchange={handleRarityChange}
      />
    </div>
  </div>

  <div class="stat-col" style="--dark: #10B981; --light: #D1FAE5">
    <div class="stat-header">{t("equipment.stats.armorClass")}</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        value={system.armorClass}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateEquipment("armorClass", Number(e.currentTarget.value))}
      />
    </div>
  </div>

  <div class="stat-col" style="--dark: #EAB308; --light: #FEF9C3">
    <div class="stat-header">{t("item.basicStats.price")}</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        value={system.price}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateEquipment("price", Number(e.currentTarget.value))}
      />
    </div>
  </div>
</StatsCard>

<StatsCard columns={1}>
  <div class="stat-col" style="--dark: #6B7280; --light: #F3F4F6">
    <div class="stat-header">{t("item.basicStats.weight")}</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        step="0.1"
        value={system.weight}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateEquipment("weight", Number(e.currentTarget.value))}
      />
    </div>
  </div>
</StatsCard>
