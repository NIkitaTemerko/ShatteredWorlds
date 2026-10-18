<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { RARITY_TYPES, type RarityType, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { RARITY_COLORS } from "../../../shared/model/constants";
  import { getUpdateConsumable } from "../utils/updateConsumable";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = $derived(getUpdateConsumable(item));

  const system = $derived.by(() => {
    if (!item.isConsumable()) throw new Error("Item is not a consumable");
    return item.system;
  });

  function handleRarityChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as RarityType;
    updateConsumable("rarity", value);
  }

  const currentRarityColors = $derived(RARITY_COLORS[system.rarity]);
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

  <div class="stat-col" style="--dark: #c4922a; --light: rgb(196 146 42 / 28%)">
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

  <div class="stat-col" style="--dark: #6e6488; --light: rgb(74 66 92 / 35%)">
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

  <div class="stat-col" style="--dark: #4ec4b6; --light: rgb(78 196 182 / 28%)">
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
