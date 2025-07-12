<script lang="ts">
   import type { ShwItem } from '../../../documents/Item/ShwItem';
   import type { ConsumableType } from '../../../documents/Item/types/ConsumableDataTypes';
   import { ItemFactory } from '../../../documents/Item/ItemFactory';
   import {
      activationTypes, applicationTypes,
      consumableTypes,
      damageTypes, effectTypes, perTypes,
      rarityTypes,
      saveTypes,
      typeColors,
   } from '../constants/consumableConstats';
   import ItemHeader from "./ItemHeader.svelte";
   import BasicStats from "./BasicStats.svelte";
   import UsesAndActivations from "./UsesAndActivations.svelte";
   import BombStats from "./BombStats.svelte";


   export let item: ShwItem;

   /**
    * Унифицированный метод, который гарантирует, что мы не «съедим» соседние поля,
    * передавая в обновление сам объект consumable и патч‑путь одновременно.
    */
   async function updateConsumable(path: string, value: any, e?: Event) {
      e?.stopPropagation();

      if (path === 'consumableType') {
         const consumable = ItemFactory.createConsumable(value as ConsumableType, {
            name: item.name,
         });

         await item.update({
            'system.consumable': consumable,
            img: consumable.img,
            type: item.type,
            name: item.name,
         });
         return;
      }

      await item.update({
         // сохраняем текущие данные, чтобы не потерять вложенные поля
         'system.consumable': item.system.consumable,
         [`system.consumable.${path}`]: value,
      });
   }

   // 1) Всегда возвращает массив эффектов
   function getEffects() {
      return (item.system.consumable as any).effects as any[];
   }

   // 2) Добавляем новый элемент, подставляя шаблон по типу
   function addEffect() {
      const effects = [...getEffects()];
      if (item.system.consumable.consumableType === 'potion') {
         effects.push({ type: 'heal', amount: 0, duration: 1, attribute: '' });
      } else {
         effects.push({ type: 'бафф', value: 0, duration: 1 });
      }
      updateConsumable('effects', effects);
   }

   // 3) Удаляем по индексу
   function removeEffect(idx: number) {
      const effects = getEffects().filter((_, i) => i !== idx);
      updateConsumable('effects', effects);
   }

   // 4) Обновляем любое поле
   function updateEffect(idx: number, field: string, value: any) {
      const effects = getEffects().map((e, i) =>
         i === idx ? { ...e, [field]: value } : e
      );
      updateConsumable('effects', effects);
   }

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


   {#if item.system.consumable.consumableType === 'potion' || item.system.consumable.consumableType === 'food'}
      <section class="section-grid fourth type-specific effects-section">
         {#if item.system.consumable.consumableType === 'food' && item.system.consumable.nutrition !== undefined}
            <div class="stat-block full header">
               <h3>Пищевая ценность</h3>
            </div>
            <div class="stat-block full nutrition-section">
               <div class="stat-block">
                  <label for="nutrition-duration">Длительность насыщения</label>
                  <input
                     id="nutrition-duration"
                     type="text"
                     bind:value={item.system.consumable.nutrition.duration}
                     on:change={(e) => updateConsumable('nutrition.duration', e)}
                  />
               </div>
               <div class="stat-block">
                  <label for="nutrition-duration">Сила насыщения</label>
                  <input
                     id="nutrition-duration"
                     type="text"
                     bind:value={item.system.consumable.nutrition.value}
                     on:change={(e) => updateConsumable('nutrition.duration', e)}
                  />
               </div>
            </div>
         {/if}
         <!-- заголовок на всю ширину -->
         <div class="stat-block full header">
            <h3>Эффекты</h3>
            <button type="button" class="add-btn" on:click={addEffect}>+ Добавить эффект</button>
         </div>

         {#each getEffects() as eff, idx}
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
                  <input
                     id="effect-type"
                     type="text"
                     bind:value={eff.type}
                     on:change={(e) => updateEffect(idx, 'type', e.currentTarget.value)}
                  />
               {/if}
            </div>

            <!-- Сила или Значение -->
            <div class="stat-block">
               <label for="effect-value">
                  Сила
               </label>
               <input
                  id="effect-value"
                  type="number"
                  min="0"
                  value={item.system.consumable.consumableType === 'potion' ? eff.amount : eff.value}
                  on:change={(e) => updateEffect(idx, item.system.consumable.consumableType === 'potion' ? 'amount' : 'value', Number(e.currentTarget.value))}
               />
            </div>

            <!-- Длительность -->
            <div class="stat-block">
               <label for="effect-duration">Длительность</label>
               <input
                  id="effect-duration"
                  type="number"
                  min="1"
                  bind:value={eff.duration}
                  on:change={(e) => updateEffect(idx, 'duration', Number(e.currentTarget.value))}
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
                  <input
                     id="effect-attribute"
                     type="text"
                     bind:value={eff.attribute}
                     on:change={(e) => updateEffect(idx, 'attribute', e.currentTarget.value)}
                  />
               </div>
            {/if}

         {/each}
      </section>






   {:else if item.system.consumable.consumableType === 'scroll' &&
   item.system.consumable?.spell !== undefined &&
   item.system.consumable?.requirements !== undefined}
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


   {:else if item.system.consumable.consumableType === 'poison'
      && item.system.consumable.damage !== undefined
      && item.system.consumable.save !== undefined}
      <section class="section-grid type-specific">
         <div class="stat-block">
            <label for="damage-initial">Начальный урон</label>
            <input
               id="damage-initial"
               type="text"
               value={item.system.consumable.damage.initial}
               on:change={(e) => updateConsumable('damage.initial', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label for="damage-recurring">Повтор. урон</label>
            <input
               id="damage-recurring"
               type="text"
               value={item.system.consumable.damage.recurring}
               on:change={(e) => updateConsumable('damage.recurring', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label for="damage-duration">Длительность (раунд)</label>
            <input
               id="damage-duration"
               type="number"
               min="1"
               value={item.system.consumable.damage.duration}
               on:change={(e) => updateConsumable('damage.duration', Number(e.currentTarget.value))}
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
</div>

<!-- ======================== СТИЛИ ======================== -->
<style>
   h3 {
      margin: 0;
      padding: 0;
      border: none;
      font-size: var(--font-size-16);
   }
   /* overall card */
   .consumable-card {
      background: var(--light);
      border: 2px solid var(--dark);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
   }

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

   .section-grid.fourth {
      display: grid;
      grid-template-columns: repeat(3, 1fr) 20px;
      gap: 0.5rem;
      align-items: end;
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

   .stat-block.full {
      grid-column: 1 / -1;
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
   .stat-block .devider {
      pointer-events: none;
      font-weight: bold;
   }

   /* description */
   .description textarea {
      width: 100%;
      min-height: 100px;
      resize: vertical;
      border: 1px solid var(--color-border-light-1);
      padding: 0.5rem;
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

   /* type‑specific emphasiser */
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
