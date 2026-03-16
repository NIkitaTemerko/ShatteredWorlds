<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type {
    AbilityCategory,
    ActiveAbilityKind,
    PassiveAbilityKind,
  } from "../../../documents/Item/types/AbilityDataTypes";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { ABILITY_CATEGORIES, ACTIVE_KINDS, PASSIVE_KINDS } from "../constants/abilityConstants";

  interface Props {
    item: ShwItem;
    onCategoryChange: (category: AbilityCategory, event?: Event) => void;
    onKindChange: (kind: ActiveAbilityKind | PassiveAbilityKind, event?: Event) => void;
  }

  let { item, onCategoryChange, onKindChange }: Props = $props();

  const system = $derived(item.system as import("../../../documents/Item/types/AbilityDataTypes").AbilitySystem);
  const img = $derived(item.img);

  const kindOptions = $derived(system.category === "active" ? ACTIVE_KINDS : PASSIVE_KINDS);

  function handleCategoryChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as AbilityCategory;
    onCategoryChange(value, event);
  }

  function handleKindChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as ActiveAbilityKind | PassiveAbilityKind;
    onKindChange(value, event);
  }
</script>

<header class="card-header">
  <img src={img} data-edit="img" title={item.name} height="72" width="72" alt="img" />

  <div class="header-main">
    <Input
      class="header-name-input"
      type="text"
      bind:value={item.name}
      placeholder={t("ability.header.namePlaceholder")}
      onchange={(e) => item.update({ name: e.currentTarget.value })}
      variant="underline"
    />

    <div class="type-wrapper">
      <span class="type-label">{t("ability.header.categoryLabel")}</span>
      <SelectInput
        value={system.category}
        options={ABILITY_CATEGORIES}
        variant="underline"
        onchange={handleCategoryChange}
      />
    </div>

    <div class="type-wrapper">
      <span class="kind-label">{t("ability.header.kindLabel")}</span>
      <SelectInput
        value={system.category === "active" ? system.activeKind : system.passiveKind}
        options={kindOptions}
        variant="underline"
        onchange={handleKindChange}
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

  .header-main :global(.header-name-input) {
    font-size: 20px;
    font-weight: 700;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }

  .type-label {
    opacity: 0.8;
    font-size: 20px;
  }

  .kind-label {
    opacity: 0.8;
    font-size: 16px;
  }
</style>
