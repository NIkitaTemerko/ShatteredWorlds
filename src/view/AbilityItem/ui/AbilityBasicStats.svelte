<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { AbilitySystem } from "../../../documents/Item/types/AbilityDataTypes";
  import { RARITY_TYPES, type RarityType, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { rarityColors } from "../constants/abilityConstants";

  interface Props {
    item: ShwItem;
    onUpdate: (path: string, value: any) => void;
  }

  let { item, onUpdate }: Props = $props();

  const system = $derived(item.system as AbilitySystem);

  function handleRarityChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as RarityType;
    onUpdate("rarity", value);
  }

  const currentRarityColors = $derived(rarityColors[system.rarity]);
</script>

<StatsCard columns={1}>
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
</StatsCard>
