<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { ResourceCategory, ResourceData } from "../../../documents/Item/types/ResourceDataTypes";
  import { t } from "../../../shared/i18n";
  import { AutocompleteInput, Input, SelectInput } from "../../../shared/ui";
  import { RARITY_TYPES, type RarityType } from "../../../entities/consumable";
  import { StatsCard } from "../../../entities/consumable/ui/StatsCard";
  import { getCategoryColor, getTypeOptions } from "../../../entities/resource";
  import { RARITY_COLORS } from "../../../shared/model/constants";
  import { getUpdateResource } from "../utils/updateResource";
  import ResourceHeader from "./ResourceHeader.svelte";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  if (!item.isResource()) throw new Error("Item is not a resource");

  const system = $derived(item.system as ResourceData);
  const updateResource = getUpdateResource(item);
  const categoryColors = $derived(getCategoryColor(system.category));
  const currentRarityColors = $derived(RARITY_COLORS[system.rarity]);
</script>

<div class="resource-card">
  <ResourceHeader {item} />

  <!-- Основные характеристики -->
  <StatsCard columns={3}>
    <div class="stat-col" style="--dark: {currentRarityColors.dark}; --light: {currentRarityColors.light}">
      <div class="stat-header">{t("item.basicStats.rarity")}</div>
      <div class="stat-body">
        <SelectInput
          value={system.rarity}
          options={RARITY_TYPES}
          variant="underline"
          fullWidth
          onchange={(e) => {
            const val = (e.currentTarget as HTMLSelectElement).value as RarityType;
            updateResource("rarity", val);
          }}
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
          onchange={(e) => updateResource("price", Number(e.currentTarget.value))}
        />
      </div>
    </div>

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
          onchange={(e) => updateResource("weight", Number(e.currentTarget.value))}
        />
      </div>
    </div>
  </StatsCard>

  <!-- Количество и стек -->
  <StatsCard columns={2}>
    <div class="stat-col" style="--dark: {categoryColors.dark}; --light: {categoryColors.light}">
      <div class="stat-header">{t("item.basicStats.quantity")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={system.quantity}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateResource("quantity", Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col" style="--dark: {categoryColors.dark}; --light: {categoryColors.light}">
      <div class="stat-header">{t("item.basicStats.stack")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="1"
          value={system.stackLimit}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateResource("stackLimit", Number(e.currentTarget.value))}
        />
      </div>
    </div>
  </StatsCard>

  <!-- Тип ресурса (автокомплит) -->
  <StatsCard columns={1}>
    <div class="stat-col" style="--dark: {categoryColors.dark}; --light: {categoryColors.light}">
      <div class="stat-header">{t("resource.header.typeLabel")}</div>
      <div class="stat-body">
        <AutocompleteInput
          value={system.resourceType}
          options={getTypeOptions()}
          placeholder={t("resource.header.typePlaceholder")}
          variant="underline"
          fullWidth
          onchange={(val) => updateResource("resourceType", val)}
        />
      </div>
    </div>
  </StatsCard>

  <!-- Описание -->
  <section class="description" style="--dark: #6B7280; --light: #F3F4F6">
    <div class="section-header">{t("item.description.title")}</div>
    <textarea
      bind:value={system.description}
      placeholder={t("item.description.placeholder")}
      onchange={(e) => updateResource("description", e.currentTarget.value)}
    ></textarea>
  </section>
</div>

<style>
  .resource-card {
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
    width: 100%;
    min-height: 80px;
    resize: vertical;
    border: none;
    padding: 0.5rem;
    background: var(--light);
    font-family: inherit;
    font-size: var(--font-size-14);
    color: #000;
  }

  .description textarea:focus {
    outline: none;
    background: color-mix(in srgb, var(--light) 90%, white);
  }

  .description textarea::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
</style>
