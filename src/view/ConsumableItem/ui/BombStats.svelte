<script lang="ts">
   import { damageTypes, saveTypes } from "../constants/consumableConstats.js";
   import type {ShwItem} from "../../../documents/Item/ShwItem";
   import {getUpdateConsumable} from "../utils/updateConsumable";
   export let item: ShwItem;

   const updateConsumable = getUpdateConsumable(item)
</script>

{#if item.system.consumable.consumableType === 'bomb'
   && item.system.consumable.damage !== undefined
   && item.system.consumable.save !== undefined}
   <section class="section-grid type-specific">
      <div class="stat-block">
         <label for="damage">Урон</label>
         <input
            id="damage"
            type="number"
            min="0"
            value={item.system.consumable.damage.amount}
            on:change={(e) => updateConsumable('damage.amount', Number(e.currentTarget.value))}
         />
      </div>
      <div class="stat-block">
         <label for="damage-type">Тип урона</label>
         <select
            id="damage-type"
            value={item.system.consumable.damage.type}
            on:change={(e) => updateConsumable('damage.type', e.currentTarget.value)}
         >
            {#each damageTypes as type}
               <option value={type.value}>{type.label}</option>
            {/each}
         </select>
      </div>
      <div class="stat-block">
         <label for="radius">Радиус (футы)</label>
         <input
            id="radius"
            type="number"
            min="0"
            value={item.system.consumable.radius}
            on:change={(e) => updateConsumable('radius', Number(e.currentTarget.value))}
         />
      </div>
      <div class="stat-block">
         <label for="save">Спасбросок</label>
         <select
            id="save"
            value={item.system.consumable.save.type}
            on:change={(e) => updateConsumable('save.type', e.currentTarget.value)}
         >
            {#each saveTypes as type}
               <option value={type.value}>{type.label}</option>
            {/each}
         </select>
      </div>
      <div class="stat-block">
         <label for="save-dc">Сложность</label>
         <input
            id="save-dc"
            type="number"
            min="0"
            value={item.system.consumable.save.dc}
            on:change={(e) => updateConsumable('save.dc', Number(e.currentTarget.value))}
         />
      </div>
</section>
{/if}

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
   .stat-block input,
   .stat-block select {
      border: 1px solid var(--color-border-light-2);
      padding: 0.25rem 0.4rem;
      text-align: center;
   }

   /* type‑specific emphasiser */
   .type-specific {
      border-left: 4px solid var(--dark);
   }

</style>
