<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type {
    AbilityCategory,
    ActiveAbilityKind,
    PassiveAbilityKind,
  } from "../../../documents/Item/types/AbilityDataTypes";
  import { t } from "../../../shared/i18n";
  import { getUpdateAbility } from "../utils/updateAbility";
  import AbilityBasicStats from "./AbilityBasicStats.svelte";
  import AbilityHeader from "./AbilityHeader.svelte";
  import ActiveAbilityDetails from "./ActiveAbilityDetails.svelte";
  import PassiveAbilityDetails from "./PassiveAbilityDetails.svelte";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateAbility = getUpdateAbility(item);

  function handleCategoryChange(category: AbilityCategory) {
    updateAbility("category", category);
  }

  function handleKindChange(kind: ActiveAbilityKind | PassiveAbilityKind) {
    updateAbility("kind", kind);
  }

  function handleUpdate(path: string, value: any) {
    updateAbility(path, value);
  }
</script>

<div class="ability-card">
  <!-- HEADER -->
  <AbilityHeader {item} onCategoryChange={handleCategoryChange} onKindChange={handleKindChange} />

  <!-- BASIC STATS -->
  <AbilityBasicStats {item} onUpdate={handleUpdate} />

  <!-- DESCRIPTION -->
  <section class="description" style="--dark: #6B7280; --light: #F3F4F6">
    <div class="section-header">{t("item.description.title")}</div>
    <textarea
      bind:value={item.system.description}
      placeholder={t("item.description.placeholder")}
      onchange={(e) => updateAbility("description", e.currentTarget.value)}
    ></textarea>
  </section>

  <!-- TYPE-SPECIFIC DETAILS -->
  <ActiveAbilityDetails {item} onUpdate={handleUpdate} />
  <PassiveAbilityDetails {item} onUpdate={handleUpdate} />
</div>

<style>
  .ability-card {
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
    min-height: 100px;
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
