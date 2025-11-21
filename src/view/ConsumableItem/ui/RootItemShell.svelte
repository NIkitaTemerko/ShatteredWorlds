<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { t } from "../../../shared/i18n";
  import { typeColors } from "../constants/consumableConstats";
  import { getUpdateConsumable } from "../utils/updateConsumable";
  import BasicStats from "./BasicStats.svelte";
  import BombStats from "./BombStats.svelte";
  import ItemHeader from "./ItemHeader.svelte";
  import Poison from "./Poison.svelte";
  import PotionsAndFood from "./PotionsAndFood.svelte";
  import Scroll from "./Scroll.svelte";
  import UsesAndActivations from "./UsesAndActivations.svelte";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  if (!item.isConsumable()) throw new Error("Item is not a consumable");
  const system = $derived(item.system);

  /**
   * Унифицированный метод, который гарантирует, что мы не «съедим» соседние поля,
   * передавая в обновление сам объект consumable и патч‑путь одновременно.
   */
  const updateConsumable = getUpdateConsumable(item);
</script>

<!-- ======================== МАКЕТ ======================== -->
<div
  class="consumable-card"
  style="--dark:{typeColors[system.consumableType]?.dark}; --light:{typeColors[system.consumableType]?.light}"
>
  <!-- ===== HEADER ===== -->
  <ItemHeader {item} />

  <!-- ===== BASIC STATS ===== -->
  <BasicStats {item} />

  <!-- ===== USES & ACTIVATION ===== -->
  <UsesAndActivations {item} />

  <!-- ===== DESCRIPTION ===== -->
  <section class="description" style="--dark: #6B7280; --light: #F3F4F6">
    <div class="section-header">{t("item.description.title")}</div>
    <textarea
      bind:value={system.description}
      placeholder={t("item.description.placeholder")}
      onchange={(e) => updateConsumable("description", e.currentTarget.value)}
    ></textarea>
  </section>

  <!-- ===== TYPE‑SPECIFIC DETAILS ===== -->
  <BombStats {item} />

  <PotionsAndFood {item} />

  <Scroll {item} />

  <Poison {item} />
</div>

<!-- ======================== СТИЛИ ======================== -->
<style>
  .consumable-card {
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  /* sections */
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
