<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { RARITY_TYPES, type RarityType, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { getUpdateConsumable } from "../utils/updateConsumable";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);

  if (!item.isConsumable()) throw new Error("Item is not a consumable");
  const system = $derived(item.system);

  function handleRarityChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as RarityType;
    updateConsumable("rarity", value);
  }

  const rarityColors: Record<RarityType, { dark: string; light: string }> = {
    common: { dark: "#9CA3AF", light: "#F3F4F6" },
    uncommon: { dark: "#10B981", light: "#D1FAE5" },
    rare: { dark: "#3B82F6", light: "#DBEAFE" },
    epic: { dark: "#9333EA", light: "#F3E8FF" },
    legendary: { dark: "#F97316", light: "#FFEDD5" },
  };

  const currentRarityColors = $derived(rarityColors[system.rarity]);
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

  <div class="stat-col" style="--dark: #EAB308; --light: #FEF9C3">
    <div class="stat-header">{t("item.basicStats.price")}</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        bind:value={system.price}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateConsumable("price", Number(e.currentTarget.value))}
      />
    </div>
  </div>

  <div class="stat-col" style="--dark: #6B7280; --light: #F3F4F6">
    <div class="stat-header">{t("item.basicStats.weight")}</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        step="0.01"
        bind:value={system.weight}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateConsumable("weight", Number(e.currentTarget.value))}
      />
    </div>
  </div>

  <div class="stat-col" style="--dark: #3B82F6; --light: #DBEAFE">
    <div class="stat-header">{t("item.basicStats.quantity")}</div>
    <div class="stat-body">
      <Input
        type="number"
        min="0"
        bind:value={system.quantity}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateConsumable("quantity", Number(e.currentTarget.value))}
      />
    </div>
  </div>

  <div class="stat-col" style="--dark: #3B82F6; --light: #DBEAFE">
    <div class="stat-header">{t("item.basicStats.stack")}</div>
    <div class="stat-body">
      <Input
        type="number"
        min="1"
        bind:value={system.stackLimit}
        variant="underline"
        textAlign="center"
        fullWidth
        onchange={(e) => updateConsumable("stackLimit", Number(e.currentTarget.value))}
      />
    </div>
  </div>
</StatsCard>
