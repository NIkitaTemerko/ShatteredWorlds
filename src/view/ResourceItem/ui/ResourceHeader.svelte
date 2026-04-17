<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { ResourceCategory, ResourceData } from "../../../documents/Item/types/ResourceDataTypes";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { getCategoryOptions } from "../../../entities/resource";
  import { getUpdateResource } from "../utils/updateResource";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateResource = getUpdateResource(item);

  const img = $derived(item.img);
  const system = $derived(item.system as ResourceData);

  function handleCategoryChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as ResourceCategory;
    updateResource("category", value, event);
  }
</script>

<header class="card-header">
  <img src={img} data-edit="img" title={item.name} height="72" width="72" alt="img" />

  <div class="header-main">
    <Input
      class="header-name-input"
      type="text"
      bind:value={item.name}
      placeholder={t("resource.header.namePlaceholder")}
      onchange={(e) => item.update({ name: e.currentTarget.value })}
      variant="underline"
    />

    <div class="header-category">
      <span class="category-label">{t("resource.header.categoryLabel")}</span>
      <SelectInput
        value={system.category}
        options={getCategoryOptions()}
        variant="underline"
        onchange={handleCategoryChange}
      />
    </div>
  </div>
</header>

<style>
  .card-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0;
  }

  .header-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .header-main :global(.header-name-input) {
    font-size: 20px;
    font-weight: 700;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }

  .header-category {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-label {
    font-size: var(--font-size-12);
    font-weight: 600;
    white-space: nowrap;
  }
</style>
