<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { SpellCategory, SpellKind } from "../../../documents/Item/types/SpellDataTypes";
  import { t } from "../../../shared/i18n";
  import { cn } from "../../../shared/lib/cn";
  import { Input, SelectInput } from "../../../shared/ui";

  interface Props {
    item: ShwItem;
    onCategoryChange: (category: SpellCategory) => void;
    onKindChange: (kind: SpellKind) => void;
  }

  let { item, onCategoryChange, onKindChange }: Props = $props();

  const system = $derived(item.system as import("../../../documents/Item/types/SpellDataTypes").SpellSystem);

  const SPELL_CATEGORIES = [
    { value: "code", label: "spell.category.code" },
    { value: "elemental", label: "spell.category.elemental" },
    { value: "dark", label: "spell.category.dark" },
    { value: "holy", label: "spell.category.holy" },
    { value: "arcane", label: "spell.category.arcane" },
  ];

  const SPELL_KINDS = [
    { value: "attack", label: "spell.spellKind.attack" },
    { value: "heal", label: "spell.spellKind.heal" },
    { value: "support", label: "spell.spellKind.support" },
    { value: "debuff", label: "spell.spellKind.debuff" },
    { value: "control", label: "spell.spellKind.control" },
    { value: "movement", label: "spell.spellKind.movement" },
    { value: "summon", label: "spell.spellKind.summon" },
    { value: "utility", label: "spell.spellKind.utility" },
  ];

  function handleCategoryChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as SpellCategory;
    onCategoryChange(value);
  }

  function handleKindChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as SpellKind;
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
      placeholder={t("spell.header.namePlaceholder")}
      onchange={(e) => item.update({ name: e.currentTarget.value })}
      variant="underline"
    />

    <div class="type-wrapper">
      <span class="tw:opacity-80 tw:text-[20px]">{t("spell.header.categoryLabel")}</span>
      <SelectInput
        value={system.category}
        options={SPELL_CATEGORIES}
        variant="underline"
        onchange={handleCategoryChange}
      />
    </div>

    <div class="type-wrapper">
      <span class="tw:opacity-80 tw:text-[16px]">{t("spell.header.kindLabel")}</span>
      <SelectInput value={system.spellKind} options={SPELL_KINDS} variant="underline" onchange={handleKindChange} />
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
    gap: 0.1rem;
  }

  .type-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
