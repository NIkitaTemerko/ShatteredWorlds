<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { SpellCategory, SpellKind } from "../../../documents/Item/types/SpellDataTypes";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";

  interface Props {
    item: ShwItem;
    onCategoryChange: (category: SpellCategory, event?: Event) => void;
    onKindChange: (kind: SpellKind, event?: Event) => void;
  }

  let { item, onCategoryChange, onKindChange }: Props = $props();

  const system = $derived(item.system as import("../../../documents/Item/types/SpellDataTypes").SpellSystem);
  const img = $derived(item.img);

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
    onCategoryChange(value, event);
  }

  function handleKindChange(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value as SpellKind;
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
      placeholder={t("spell.header.namePlaceholder")}
      onchange={(e) => item.update({ name: e.currentTarget.value })}
      variant="underline"
    />

    <div class="type-wrapper">
      <span class="type-label">{t("spell.header.categoryLabel")}</span>
      <SelectInput
        value={system.category}
        options={SPELL_CATEGORIES}
        variant="underline"
        onchange={handleCategoryChange}
      />
    </div>

    <div class="type-wrapper">
      <span class="kind-label">{t("spell.header.kindLabel")}</span>
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
