<script lang="ts">
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { ConsumableType } from '../../../documents/Item/types/ConsumableDataTypes';
import {ItemFactory} from "../../../documents/Item/ItemFactory";
import {consumableTypes, damageTypes, rarityTypes, saveTypes, typeColors,} from '../constants/consumableConstats';

export let item: ShwItem;

async function updateConsumable(path: string, value: any) {
   if (path === 'consumableType') {
      const consumable = ItemFactory.createConsumable(
         value as ConsumableType,
         { name: item.name }
      );

      await item.update({
         'system.consumable': consumable,
         img: consumable.img
      });
      return;
   }
   await item.update({
      [`system.consumable.${path}`]: value,
   });
}
</script>

<div
   class="consumable-sheet"
   style="--dark:{typeColors[item.system.consumable.consumableType]?.dark}; --light:{typeColors[item.system.consumable.consumableType]?.light}"
>
   <div class="header">
      <img src={item.img} data-edit="img" title={item.name} height="72" width="72" alt="img" />
      <div class="name-section">
         <h1>
            <input
               type="text"
               value={item.name}
               placeholder="Название предмета"
               on:change={(e) => item.update({ name: e.currentTarget.value })}
            />
         </h1>
      </div>

      <div class="type-section">
         <select
            value={item.system.consumable.consumableType}
            on:change={(e) => {
               e.stopPropagation();
               updateConsumable('consumableType', e.currentTarget.value)}
            }
         >
            {#each consumableTypes as type}
               <option value={type.value}>{type.label}</option>
            {/each}
         </select>
      </div>
   </div>

   <div class="stats-grid">
      <div class="stat-block">
         <div class="stat-header">Редкость</div>
         <div class="stat-value">
            <select
               value={item.system.consumable.rarity}
               on:change={(e) => updateConsumable('rarity', e.currentTarget.value)}
            >
               {#each rarityTypes as rarity}
                  <option value={rarity.value}>{rarity.label}</option>
               {/each}
            </select>
         </div>
      </div>

   </div>

   <div class="description">
        <textarea
           value={item.system.consumable.description ?? ''}
           placeholder="Описание предмета..."
           on:change={(e) => updateConsumable('description', e.currentTarget.value)}
        />
   </div>

   {#if item.system.consumable.consumableType === 'bomb'}
      <div class="stats-grid">
         <div class="stat-block">
            <div class="stat-header">Урон</div>
            <div class="stat-value">
               <input
                  type="number"
                  min="0"
                  value={item.system.consumable.damage?.amount ?? 0}
                  on:change={(e) => updateConsumable('damage.amount', e.currentTarget.value)}
               />
            </div>
         </div>
         <div class="stat-block">
            <div class="stat-header">Тип урона</div>
            <div class="stat-value">
               <select
                  value={item.system.consumable.damage?.type}
                  on:change={(e) => updateConsumable('damage.type', e.currentTarget.value)}
               >
                  {#each damageTypes as type}
                     <option value={type.value}>{type.label}</option>
                  {/each}
               </select>
            </div>
         </div>
         <div class="stat-block">
            <div class="stat-header">Спасбросок</div>
            <div class="stat-value">
               <select
                  value={item.system.consumable.save?.type}
                  on:change={(e) => updateConsumable('save.type', e.currentTarget.value)}
               >
                  {#each saveTypes as type}
                     <option value={type.value}>{type.label}</option>
                  {/each}
               </select>
            </div>
         </div>
         <div class="stat-block">
            <div class="stat-header">Сила спасброска</div>
            <div class="stat-value">
               <input
                  type="number"
                  min="0"
                  value={item.system.consumable.save?.dc}
                  on:change={(e) => updateConsumable('save.dc', Number(e.currentTarget.value))}
               />
            </div>
         </div>
      </div>
   {/if}
</div>

<style>
   .consumable-sheet {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
   }

   .header {
      display: flex;
      gap: 1rem;
      align-items: center;
   }

   .name-section {
      flex: 1;
   }

   .name-section input {
      width: 100%;
      font-size: var(--font-size-20);
      border: 1px solid var(--color-border-light-1);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
   }

   .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(120px, 1fr));
      gap: 2px;
      background: var(--color-border-light-3);
      padding: 2px;
   }

   .stat-block {
      display: flex;
      flex-direction: column;
   }

   .stat-header {
      background: var(--dark);
      color: #fff;
      padding: 0.35rem 0.25rem;
      text-align: center;
      font-weight: bold;
      font-size: var(--font-size-14);
   }

   .stat-value {
      background: var(--light);
      padding: 0.35rem 0.25rem;
      text-align: center;
   }

   .stat-value input,
   .stat-value select {
      background: transparent;
      border: none;
      width: 100%;
      text-align: center;
   }

   .uses {
      display: flex;
      justify-content: center;
      gap: 0.25rem;
   }

   .uses input {
      width: 3rem;
   }

   .description textarea {
      width: 100%;
      min-height: 100px;
      resize: vertical;
      border: 1px solid var(--color-border-light-1);
      padding: 0.5rem;
      border-radius: 3px;
   }

   .effect-row input {
      border: 1px solid var(--color-border-light-1);
      padding: 0.25rem;
      border-radius: 3px;
   }

   .bomb-stats {
      background: var(--light);
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
   }

   .stat-row {
      display: flex;
      gap: 1rem;
      align-items: center;
   }

   button {
      background: var(--dark);
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
   }

   button:hover {
      filter: brightness(1.1);
   }

   .remove {
      padding: 0.25rem 0.5rem;
      font-size: 1.2em;
      line-height: 1;
   }
</style>
