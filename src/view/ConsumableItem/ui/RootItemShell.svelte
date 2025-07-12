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
   <section class="description">
    <textarea
       bind:value={item.system.consumable.description}
       placeholder="Описание предмета..."
       on:change={(e) => updateConsumable('description', e.currentTarget.value)}
    />
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
      background: var(--light);
      border: 2px solid var(--dark);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
   }

   /* sections */
   section {
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid var(--color-border-light-2);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
   }

   .description textarea {
      width: 100%;
      min-height: 100px;
      resize: vertical;
      border: 1px solid var(--color-border-light-1);
      padding: 0.5rem;
   }
</style>
