<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { Input, SelectInput } from "../../../shared/ui";
  import { cn } from "../../../shared/lib/cn";
  import { t } from "../../../shared/i18n";
  import type {
    AbilityCategory,
    ActiveAbilityKind,
    PassiveAbilityKind,
  } from "../../../documents/Item/types/AbilityDataTypes";

  interface Props {
    item: ShwItem;
    onCategoryChange: (category: AbilityCategory) => void;
    onKindChange: (kind: ActiveAbilityKind | PassiveAbilityKind) => void;
  }

  let { item, onCategoryChange, onKindChange }: Props = $props();

  const system = $derived(item.system as import("../../../documents/Item/types/AbilityDataTypes").AbilitySystem);

  const ABILITY_CATEGORIES = [
    { value: "active", label: "ability.category.active" },
    { value: "passive", label: "ability.category.passive" },
  ];

  const ACTIVE_KINDS = [
    { value: "attack", label: "ability.activeKind.attack" },
    { value: "heal", label: "ability.activeKind.heal" },
    { value: "support", label: "ability.activeKind.support" },
    { value: "debuff", label: "ability.activeKind.debuff" },
    { value: "control", label: "ability.activeKind.control" },
    { value: "movement", label: "ability.activeKind.movement" },
    { value: "summon", label: "ability.activeKind.summon" },
    { value: "utility", label: "ability.activeKind.utility" },
  ];

  const PASSIVE_KINDS = [
    { value: "stat-bonus", label: "ability.passiveKind.statBonus" },
    { value: "aura", label: "ability.passiveKind.aura" },
    { value: "triggered", label: "ability.passiveKind.triggered" },
    { value: "mechanic", label: "ability.passiveKind.mechanic" },
  ];

  const kindOptions = $derived(system.category === "active" ? ACTIVE_KINDS : PASSIVE_KINDS);

  function handleCategoryChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as AbilityCategory;
    onCategoryChange(value);
  }

  function handleKindChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as ActiveAbilityKind | PassiveAbilityKind;
    onKindChange(value);
  }
</script>

<header class="card-header">
  <img src={item.img} data-edit="img" title={item.name} height="72" width="72" alt="img" />

  <div class="header-main">
    <Input
      class={cn("tw:text-[20px] tw:font-bold tw:py-[0.4rem]")}
      type="text"
      bind:value={item.name}
      placeholder={t("ability.header.namePlaceholder")}
      onchange={(e) => item.update({ name: e.currentTarget.value })}
      variant="underline"
    />

    <div class="type-wrapper">
      <span class="tw:opacity-80 tw:text-[20px]">{t("ability.header.categoryLabel")}</span>
      <SelectInput
        value={system.category}
        options={ABILITY_CATEGORIES}
        variant="underline"
        onchange={handleCategoryChange}
      />
    </div>

    <div class="type-wrapper">
      <span class="tw:opacity-80 tw:text-[16px]">{t("ability.header.kindLabel")}</span>
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
</style>
