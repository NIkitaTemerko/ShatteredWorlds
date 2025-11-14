<script lang="ts">
   import type { ShwItem } from "../../../documents/Item/ShwItem";
   import { getUpdateConsumable } from "../utils/updateConsumable";
   import { effectTypes } from "../constants/consumableConstats";
   import { Input } from "../../../shared/ui";

   export let item: ShwItem;

   const updateConsumable = getUpdateConsumable(item)
   const consEffects: any[] = (item?.system?.consumable as any)?.effects ?? []

   // 2) Добавляем новый элемент, подставляя шаблон по типу
   function addEffect() {
      const effects = [...consEffects];
      if (item.system.consumable.consumableType === 'potion') {
         effects.push({ type: 'heal', amount: 0, duration: 1, attribute: '' });
      } else {
         effects.push({ type: 'бафф', value: 0, duration: 1 });
      }
      updateConsumable('effects', effects);
   }

   // 3) Удаляем по индексу
   function removeEffect(idx: number) {
      const effects = consEffects.filter((_, i) => i !== idx);
      updateConsumable('effects', effects);
   }

   // 4) Обновляем любое поле
   function updateEffect(idx: number, field: string, value: any) {
      const effects = consEffects.map((e, i) =>
         i === idx ? { ...e, [field]: value } : e
      );
      updateConsumable('effects', effects);
   }
</script>

{#if item.system.consumable.consumableType === 'potion' || item.system.consumable.consumableType === 'food'}
   <section class="section-grid fourth type-specific effects-section">
         {#if item.system.consumable.consumableType === 'food' && item.system.consumable.nutrition !== undefined}
            <div class="stat-block full header">
               <h3>Пищевая ценность</h3>
            </div>
            <div class="stat-block full nutrition-section">
               <div class="stat-block">
                  <label for="nutrition-duration">Длительность насыщения</label>
                  <Input
                     id="nutrition-duration"
                     type="text"
                     bind:value={item.system.consumable.nutrition.duration}
                     onchange={(e) => updateConsumable('nutrition.duration', e)}
                  />
               </div>
               <div class="stat-block">
                  <label for="nutrition-duration">Сила насыщения</label>
                  <Input
                     id="nutrition-duration"
                     type="text"
                     bind:value={item.system.consumable.nutrition.value}
                     onchange={(e) => updateConsumable('nutrition.duration', e)}
                  />
               </div>
            </div>
         {/if}
         <!-- заголовок на всю ширину -->
         <div class="stat-block full header">
            <h3>Эффекты</h3>
            <button type="button" class="add-btn" on:click={addEffect}>+ Добавить эффект</button>
         </div>

         {#each consEffects as eff, idx}
            <!-- Тип эффекта -->
            <div class="stat-block">
               <label for="effect-type">{item.system.consumable.consumableType === 'potion' ? 'Тип' : 'Бонус'}</label>
               {#if item.system.consumable.consumableType === 'potion'}
                  <select
                     id="effect-type"
                     bind:value={eff.type}
                     on:change={(e) => updateEffect(idx, 'type', e.currentTarget.value)}
                  >
                     {#each effectTypes as et}
                        <option value={et.value}>{et.label}</option>
                     {/each}
                  </select>
               {:else}
                  <Input
                     id="effect-type"
                     type="text"
                     bind:value={eff.type}
                     onchange={(e) => updateEffect(idx, 'type', e.currentTarget.value)}
                  />
               {/if}
            </div>

            <!-- Сила или Значение -->
            <div class="stat-block">
               <label for="effect-value">
                  Сила
               </label>
               <Input
                  id="effect-value"
                  type="number"
                  min="0"
                  value={item.system.consumable.consumableType === 'potion' ? eff.amount : eff.value}
                  onchange={(e) => updateEffect(idx, item.system.consumable.consumableType === 'potion' ? 'amount' : 'value', Number(e.currentTarget.value))}
               />
            </div>

            <!-- Длительность -->
            <div class="stat-block">
               <label for="effect-duration">Длительность</label>
               <Input
                  id="effect-duration"
                  type="number"
                  min="1"
                  bind:value={eff.duration}
                  onchange={(e) => updateEffect(idx, 'duration', Number(e.currentTarget.value))}
               />
            </div>

            <!-- Кнопка удаления -->
            <div class="stat-block">
               <button type="button" class="delete-btn" on:click={() => removeEffect(idx)}>×</button>
            </div>

            <!-- Атрибут только для зелья -->
            {#if item.system.consumable.consumableType === 'potion'}
               <div class="stat-block full">
                  <label for="effect-attribute">Атрибут</label>
                  <Input
                     id="effect-attribute"
                     type="text"
                     bind:value={eff.attribute}
                     onchange={(e) => updateEffect(idx, 'attribute', e.currentTarget.value)}
                  />
               </div>
            {/if}

         {/each}
      </section>
{/if}

<style>
   h3 {
      margin: 0;
      padding: 0;
      border: none;
      font-size: var(--font-size-16);
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

   .section-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 0.5rem;
   }

   .section-grid.fourth {
      display: grid;
      grid-template-columns: repeat(3, 1fr) 20px;
      gap: 0.5rem;
      align-items: end;
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

   /* повторяем секционный фон/бордюр */
   .effects-section {
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid var(--color-border-light-2);
      border-radius: var(--radius);
      padding: 0.75rem;
   }

   /* делаем грид с автоматическим переносом в нужных местах */
   .effects-section {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 0.5rem;
   }

   .effects-section .stat-block.full {
      grid-column: 1 / -1;
   }

   .stat-block.full.header {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
   }

   /* кнопки «+» и «×» можно оставить в том же стиле, что и в других блоках */
   .add-btn {
      background: var(--dark);
      width: auto;
      border: none;
      cursor: pointer;
   }
   .add-btn:hover {
      opacity: 0.8;
   }
   .delete-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: var(--dark);
      cursor: pointer;
   }
   .delete-btn:hover {
      color: #c00;
   }

   .type-specific {
      border-left: 4px solid var(--dark);
   }

   .nutrition-section {
      display: flex;
      gap: 0.5rem;
      flex-direction: row;
   }
   .nutrition-section .stat-block {
      flex: 1;
   }

</style>
