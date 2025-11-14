<script lang="ts">
   import { activationTypes, perTypes } from "../constants/consumableConstats.js";
   import type { ShwItem } from "../../../documents/Item/ShwItem";
   import { getUpdateConsumable } from "../utils/updateConsumable";
   import { Input } from "../../../shared/ui";
   export let item: ShwItem;

   const updateConsumable = getUpdateConsumable(item)
</script>

<section class="section-grid small-gap">
   <div class="stat-block">
      <label for="uses">Заряды</label>
      <div class="input-group">
         <Input
            id="uses"
            type="number"
            min="0"
            bind:value={item.system.consumable.uses.value}
            onchange={(e) => updateConsumable('uses.value', Number(e.currentTarget.value))}
         />
         <div class="devider">из</div>
         <Input
            type="number"
            min="0"
            bind:value={item.system.consumable.uses.max}
            onchange={(e) => updateConsumable('uses.max', Number(e.currentTarget.value))}
         />
      </div>
      <select
         bind:value={item.system.consumable.uses.per}
         on:change={(e) => updateConsumable('uses.per', e.currentTarget.value)}
      >
         {#each perTypes as per}
            <option value={per.value}>{per.label}</option>
         {/each}
      </select>
   </div>

   <div class="stat-block">
      <label for="activation">Активация</label>
      <select
         bind:value={item.system.consumable.activation.type}
         on:change={(e) => updateConsumable('activation.type', e.currentTarget.value)}
      >
         {#each activationTypes as act}
            <option value={act.value}>{act.label}</option>
         {/each}
      </select>
      <Input
         id="activation"
         type="number"
         min="0"
         bind:value={item.system.consumable.activation.cost}
         onchange={(e) => updateConsumable('activation.cost', Number(e.currentTarget.value))}
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

   .section-grid.small-gap {
      gap: 0.25rem;
   }

   .stat-block {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      position: relative;
   }

   .stat-block > .input-group {
      display: flex;
      gap: 0.25rem;
      align-items: center;
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
   .stat-block .devider {
      pointer-events: none;
      font-weight: bold;
   }
</style>
