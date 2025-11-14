<script lang="ts">
   import type {ShwItem} from "../../../documents/Item/ShwItem";
   import {getUpdateConsumable} from "../utils/updateConsumable";
   import {applicationTypes, saveTypes} from "../constants/consumableConstats";
   import { Input } from "../../../shared/ui";

   export let item: ShwItem;

   const updateConsumable = getUpdateConsumable(item)
</script>

{#if item.system.consumable.consumableType === 'poison'
   && item.system.consumable.damage !== undefined
   && item.system.consumable.save !== undefined}
      <section class="section-grid type-specific">
      <div class="stat-block">
         <label for="damage-initial">Начальный урон</label>
         <Input
            id="damage-initial"
            type="text"
            value={item.system.consumable.damage.initial}
            onchange={(e) => updateConsumable('damage.initial', e.currentTarget.value)}
         />
      </div>
      <div class="stat-block">
         <label for="damage-recurring">Повтор. урон</label>
         <Input
            id="damage-recurring"
            type="text"
            value={item.system.consumable.damage.recurring}
            onchange={(e) => updateConsumable('damage.recurring', e.currentTarget.value)}
         />
      </div>
      <div class="stat-block">
         <label for="damage-duration">Длительность (раунд)</label>
         <Input
            id="damage-duration"
            type="number"
            min="1"
            value={item.system.consumable.damage.duration}
            onchange={(e) => updateConsumable('damage.duration', Number(e.currentTarget.value))}
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
         <Input
            id="save-dc"
            type="number"
            min="0"
            value={item.system.consumable.save.dc}
            onchange={(e) => updateConsumable('save.dc', Number(e.currentTarget.value))}
         />
      </div>
      <div class="stat-block full">
         <label for="application">Применение</label>
         <select
            id="application"
            bind:value={item.system.consumable.application}
            on:change={(e) => updateConsumable('application', e.currentTarget.value, e)}
         >
            {#each applicationTypes as type}
               <option value={type.value}>{type.label}</option>
            {/each}
         </select>
      </div>
   </section>
{/if}

<style>
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

   .stat-block.full {
      grid-column: 1 / -1;
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

   .type-specific {
      border-left: 4px solid var(--dark);
   }

</style>
