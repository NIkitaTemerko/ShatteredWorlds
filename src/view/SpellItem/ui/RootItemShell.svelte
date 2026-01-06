<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { SpellCategory, SpellKind } from "../../../documents/Item/types/SpellDataTypes";
  import { t } from "../../../shared/i18n";
  import { getUpdateSpell } from "../utils/updateSpell";
  import SpellBasicStats from "./SpellBasicStats.svelte";
  import SpellHeader from "./SpellHeader.svelte";
  import SpellDetails from "./SpellDetails.svelte";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateSpell = getUpdateSpell(item);

  function handleCategoryChange(category: SpellCategory, event?: Event) {
    updateSpell("category", category, event);
  }

  function handleKindChange(kind: SpellKind, event?: Event) {
    updateSpell("spellKind", kind, event);
  }

  function handleUpdate(path: string, value: any) {
    updateSpell(path, value);
  }
</script>

<div class="spell-card">
  <!-- HEADER -->
  <SpellHeader {item} onCategoryChange={handleCategoryChange} onKindChange={handleKindChange} />

  <!-- BASIC STATS -->
  <SpellBasicStats {item} onUpdate={handleUpdate} />

  <!-- DESCRIPTION -->
  <section class="description" style="--dark: #6B7280; --light: #F3F4F6">
    <div class="section-header">{t("item.description.title")}</div>
    <textarea
      bind:value={item.system.description}
      placeholder={t("item.description.placeholder")}
      onchange={(e) => updateSpell("description", e.currentTarget.value)}
    ></textarea>
  </section>

  <!-- SPELL DETAILS -->
  <SpellDetails {item} onUpdate={handleUpdate} />
</div>

<style>
  .spell-card {
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
