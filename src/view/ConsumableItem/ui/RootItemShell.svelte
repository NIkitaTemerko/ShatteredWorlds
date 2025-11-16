<script lang="ts">
   import type { ShwItem } from '../../../documents/Item/ShwItem';
   import {
      typeColors,
   } from '../constants/consumableConstats';
   import ItemHeader from "./ItemHeader.svelte";
   import BasicStats from "./BasicStats.svelte";
   import UsesAndActivations from "./UsesAndActivations.svelte";
   import BombStats from "./BombStats.svelte";
   import PotionsAndFood from "./PotionsAndFood.svelte";
   import Scroll from "./Scroll.svelte";
   import Poison from "./Poison.svelte";
   import {getUpdateConsumable} from "../utils/updateConsumable";


   export let item: ShwItem;

   /**
    * Унифицированный метод, который гарантирует, что мы не «съедим» соседние поля,
    * передавая в обновление сам объект consumable и патч‑путь одновременно.
    */
   const updateConsumable = getUpdateConsumable(item);

</script>

<!-- ======================== МАКЕТ ======================== -->
<div
   class="consumable-card"
   style="--dark:{typeColors[item.system.consumable.consumableType]?.dark}; --light:{typeColors[item.system.consumable.consumableType]?.light}"
>
   <!-- ===== HEADER ===== -->
   <ItemHeader item={item} />

   <!-- ===== BASIC STATS ===== -->
   <BasicStats item={item} />

   <!-- ===== USES & ACTIVATION ===== -->
   <UsesAndActivations item={item} />

   <!-- ===== DESCRIPTION ===== -->
   <section class="description" style="--dark: #6B7280; --light: #F3F4F6">
    <div class="section-header">Описание</div>
    <textarea
       bind:value={item.system.consumable.description}
       placeholder="Описание предмета..."
       on:change={(e) => updateConsumable('description', e.currentTarget.value)}
    ></textarea>
   </section>

   <!-- ===== TYPE‑SPECIFIC DETAILS ===== -->
   <BombStats item={item} />

   <PotionsAndFood item={item} />

   <Scroll item={item} />

   <Poison item={item} />
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
