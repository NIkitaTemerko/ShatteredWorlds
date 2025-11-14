<script lang="ts">
import { rarityTypes } from "../constants/consumableConstats";
import type { ShwItem } from "../../../documents/Item/ShwItem";
import { getUpdateConsumable } from "../utils/updateConsumable";
import { Input } from "../../../shared/ui";

export let item: ShwItem;

const updateConsumable = getUpdateConsumable(item)
</script>

<section class="section-grid third">
   <div class="stat-block">
      <label for="rarity">Редкость</label>
      <select
         id="rarity"
         bind:value={item.system.consumable.rarity}
         on:change={(e) => updateConsumable('rarity', e.currentTarget.value)}
      >
         {#each rarityTypes as rarity}
            <option value={rarity.value}>{rarity.label}</option>
         {/each}
      </select>
   </div>

   <div class="stat-block">
      <label for="price">Цена</label>
      <Input
         id="price"
         type="number"
         min="0"
         bind:value={item.system.consumable.price}
         onchange={(e) => updateConsumable('price', Number(e.currentTarget.value))}
      />
   </div>

   <div class="stat-block">
      <label for="weight">Вес</label>
      <Input
         id="weight"
         type="number"
         min="0"
         step="0.01"
         bind:value={item.system.consumable.weight}
         onchange={(e) => updateConsumable('weight', Number(e.currentTarget.value))}
      />
   </div>

   <div class="stat-block">
      <label for="quantity">Кол-во</label>
      <Input
         id="quantity"
         type="number"
         min="0"
         bind:value={item.system.consumable.quantity}
         onchange={(e) => updateConsumable('quantity', Number(e.currentTarget.value))}
      />
   </div>

   <div class="stat-block">
      <label for="stackLimit">Стек</label>
      <Input
         id="stackLimit"
         type="number"
         min="1"
         bind:value={item.system.consumable.stackLimit}
         onchange={(e) => updateConsumable('stackLimit', Number(e.currentTarget.value))}
      />
   </div>
</section>

<style>
   /* sections */
   section {
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid var(--color-border-light-2);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
   }

   .section-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 0.5rem;
   }

   .section-grid.third {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
   }

   .stat-block {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      position: relative;
   }

   .stat-block label {
      font-weight: 600;
      font-size: var(--font-size-12);
      color: var(--dark);
   }
   .stat-block select {
      border: 1px solid var(--color-border-light-2);
      padding: 0.25rem 0.4rem;
      text-align: center;
   }
   :global(.stat-block .shw-input) {
      border: 1px solid var(--color-border-light-2);
      padding: 0.25rem 0.4rem;
      text-align: center;
   }
</style>
