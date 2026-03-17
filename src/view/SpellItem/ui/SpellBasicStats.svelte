<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { SpellSystem } from "../../../documents/Item/types/SpellDataTypes";
  import { RARITY_TYPES, type RarityType, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { SelectInput } from "../../../shared/ui";
  import { RARITY_COLORS } from "../../../shared/model/constants";

  interface Props {
    item: ShwItem;
    onUpdate: (path: string, value: any) => void;
  }

  let { item, onUpdate }: Props = $props();

  const system = $derived(item.system as SpellSystem);

  function handleRarityChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as RarityType;
    onUpdate("rarity", value);
  }

  const currentRarityColors = $derived(RARITY_COLORS[system.rarity]);
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
