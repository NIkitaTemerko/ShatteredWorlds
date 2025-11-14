<script lang="ts">
   import type { ShwItem } from "../../../documents/Item/ShwItem";
   import { getUpdateConsumable } from "../utils/updateConsumable";
   import { Input } from "../../../shared/ui";

   export let item: ShwItem;

   const updateConsumable = getUpdateConsumable(item)
</script>
{#if item.system.consumable.consumableType === 'scroll'
   && item.system.consumable?.spell !== undefined
   && item.system.consumable?.requirements !== undefined}
      <section class="section-grid type-specific">
         <div class="stat-block full">
            <label for="spell-name">Название заклинания</label>
            <Input
               id="spell-name"
               type="text"
               value={item.system.consumable.spell.name}
               onchange={(e) => updateConsumable('spell.name', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label for="spell-level">Уровень</label>
            <Input
               id="spell-level"
               type="number"
               min="0"
               max="9"
               value={item.system.consumable.spell.level}
               onchange={(e) => updateConsumable('spell.level', Number(e.currentTarget.value))}
            />
         </div>
         <div class="stat-block">
            <label for="spell-school">Школа</label>
            <Input
               id="spell-school"
               type="text"
               value={item.system.consumable.spell.school}
               onchange={(e) => updateConsumable('spell.school', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label for="spell-requirements">Треб. характеристика</label>
            <Input
               id="spell-requirements"
               type="text"
               value={item.system.consumable.requirements.ability}
               onchange={(e) => updateConsumable('requirements.ability', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label for="spell-difficulty">Сложность</label>
            <Input
               id="spell-difficulty"
               type="number"
               min="0"
               value={item.system.consumable.requirements.dc}
               onchange={(e) => updateConsumable('requirements.dc', Number(e.currentTarget.value))}
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
   :global(.stat-block .shw-input) {
      border: 1px solid var(--color-border-light-2);
      padding: 0.25rem 0.4rem;
      text-align: center;
   }

   .type-specific {
      border-left: 4px solid var(--dark);
   }
</style>
