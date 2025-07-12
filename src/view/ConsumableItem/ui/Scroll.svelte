<script lang="ts">
   import type { ShwItem } from "../../../documents/Item/ShwItem";
   import { getUpdateConsumable } from "../utils/updateConsumable";

   export let item: ShwItem;

   const updateConsumable = getUpdateConsumable(item)
</script>
{#if item.system.consumable.consumableType === 'scroll'
   && item.system.consumable?.spell !== undefined
   && item.system.consumable?.requirements !== undefined}
      <section class="section-grid type-specific">
         <div class="stat-block full">
            <label for="spell-name">Название заклинания</label>
            <input
               id="spell-name"
               type="text"
               value={item.system.consumable.spell.name}
               on:change={(e) => updateConsumable('spell.name', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label for="spell-level">Уровень</label>
            <input
               id="spell-level"
               type="number"
               min="0"
               max="9"
               value={item.system.consumable.spell.level}
               on:change={(e) => updateConsumable('spell.level', Number(e.currentTarget.value))}
            />
         </div>
         <div class="stat-block">
            <label for="spell-school">Школа</label>
            <input
               id="spell-school"
               type="text"
               value={item.system.consumable.spell.school}
               on:change={(e) => updateConsumable('spell.school', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label for="spell-requirements">Треб. характеристика</label>
            <input
               id="spell-requirements"
               type="text"
               value={item.system.consumable.requirements.ability}
               on:change={(e) => updateConsumable('requirements.ability', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label for="spell-difficulty">Сложность</label>
            <input
               id="spell-difficulty"
               type="number"
               min="0"
               value={item.system.consumable.requirements.dc}
               on:change={(e) => updateConsumable('requirements.dc', Number(e.currentTarget.value))}
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

   .stat-block.full {
      grid-column: 1 / -1;
   }

   .stat-block label {
      font-weight: 600;
      font-size: var(--font-size-12);
      color: var(--dark);
   }
   .stat-block input {
      border: 1px solid var(--color-border-light-2);
      padding: 0.25rem 0.4rem;
      text-align: center;
   }

   .type-specific {
      border-left: 4px solid var(--dark);
   }
</style>
