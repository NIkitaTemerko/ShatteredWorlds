<script lang="ts">
import { consumableTypes } from "../constants/consumableConstats.js";
import type { ShwItem } from "../../../documents/Item/ShwItem";
import { getUpdateConsumable } from "../utils/updateConsumable";

export let item: ShwItem;

const updateConsumable = getUpdateConsumable(item)

</script>

<header class="card-header">
   <img
      src={item.img}
      data-edit="img"
      title={item.name}
      height="72"
      width="72"
      alt="img"
   />

   <div class="header-main">
      <input
         class="item-name"
         type="text"
         bind:value={item.name}
         placeholder="Название предмета"
         on:change={(e) => item.update({ name: e.currentTarget.value })}
      />

      <div class="type-select">
         <select
            bind:value={item.system.consumable.consumableType}
            on:change={(e) => updateConsumable('consumableType', e.currentTarget.value, e)}
         >
            {#each consumableTypes as type}
               <option value={type.value}>{type.label}</option>
            {/each}
         </select>
      </div>
   </div>
</header>

<style>
   /* header */
   .card-header {
      display: flex;
      gap: 1rem;
      align-items: center;
   }

   .header-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
   }

   .item-name {
      font-size: var(--font-size-20);
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--color-border-light-1);
      width: 100%;
   }

   .type-select select {
      width: max-content;
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--color-border-light-2);
   }
</style>
