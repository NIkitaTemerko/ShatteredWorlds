<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { AbilitySystem } from "../../../documents/Item/types/AbilityDataTypes";
  import { Input, SelectInput } from "../../../shared/ui";
  import { StatsCard, RARITY_TYPES, type RarityType } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";

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

  const rarityColors: Record<"common" | "uncommon" | "rare" | "epic" | "legendary", { dark: string; light: string }> = {
    common: { dark: "#9CA3AF", light: "#F3F4F6" },
    uncommon: { dark: "#10B981", light: "#D1FAE5" },
    rare: { dark: "#3B82F6", light: "#DBEAFE" },
    epic: { dark: "#A855F7", light: "#F3E8FF" },
    legendary: { dark: "#F97316", light: "#FFEDD5" },
  };

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
