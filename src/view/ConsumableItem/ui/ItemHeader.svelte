<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { getUpdateConsumable } from "../utils/updateConsumable";
  import { Input, SelectInput } from "../../../shared/ui";
  import { CONSUMABLE_TYPES, type ConsumableType } from "../../../entities/consumable/model";
  import { cn } from "../../../shared/lib/cn";
  import { t } from "../../../shared/i18n";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);

  function handleTypeChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as ConsumableType;
    updateConsumable("consumableType", value, event);
  }
</script>

<header class="card-header">
  <img src={item.img} data-edit="img" title={item.name} height="72" width="72" alt="img" />

  <div class="header-main">
    <Input
      class={cn("tw:text-[20px] tw:font-bold tw:py-[0.4rem]")}
      type="text"
      bind:value={item.name}
      placeholder={t("item.header.namePlaceholder")}
      onchange={(e) => item.update({ name: e.currentTarget.value })}
      variant="underline"
    />

    <div class="type-wrapper">
      <span class="tw:opacity-80 tw:text-[20px]">{t("item.header.typeLabel")}</span>
      <SelectInput
        value={item.system.consumable.consumableType}
        options={CONSUMABLE_TYPES}
        variant="underline"
        onchange={handleTypeChange}
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

  .type-wrapper {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
</style>
