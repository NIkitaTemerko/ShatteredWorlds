<script lang="ts">
   import type { ShwItem } from '../../../documents/Item/ShwItem';
   import type { ConsumableType } from '../../../documents/Item/types/ConsumableDataTypes';
   import { ItemFactory } from '../../../documents/Item/ItemFactory';
   import {
      consumableTypes,
      damageTypes,
      rarityTypes,
      saveTypes,
      typeColors,
   } from '../constants/consumableConstats';

   // Доп‑константы для новой вёрстки
   export const activationTypes = [
      { value: 'action', label: 'действие' },
      { value: 'bonus', label: 'бонус' },
      { value: 'reaction', label: 'реакция' },
   ];
   export const perTypes = [
      { value: 'charges', label: 'заряды' },
      { value: 'day', label: 'день' },
      { value: 'combat', label: 'бой' },
   ];

   export const applicationTypes = [
      { value: 'injury', label: 'рана' },
      { value: 'contact', label: 'контакт' },
      { value: 'ingested', label: 'иньекция' },
      { value: 'inhaled', label: 'вдох' },
   ];

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
</script>

<!-- ======================== МАКЕТ ======================== -->
<div
   class="consumable-card"
   style="--dark:{typeColors[item.system.consumable.consumableType]?.dark}; --light:{typeColors[item.system.consumable.consumableType]?.light}"
>
   <!-- ===== HEADER ===== -->
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

   <!-- ===== BASIC STATS ===== -->
   <section class="section-grid third">
      <div class="stat-block">
         <label>Редкость</label>
         <select
            bind:value={item.system.consumable.rarity}
            on:change={(e) => updateConsumable('rarity', e.currentTarget.value)}
         >
            {#each rarityTypes as rarity}
               <option value={rarity.value}>{rarity.label}</option>
            {/each}
         </select>
      </div>

      <div class="stat-block">
         <label>Цена</label>
         <input
            type="number"
            min="0"
            bind:value={item.system.consumable.price}
            on:change={(e) => updateConsumable('price', Number(e.currentTarget.value))}
         />
      </div>

      <div class="stat-block">
         <label>Вес</label>
         <input
            type="number"
            min="0"
            step="0.01"
            bind:value={item.system.consumable.weight}
            on:change={(e) => updateConsumable('weight', Number(e.currentTarget.value))}
         />
      </div>

      <div class="stat-block">
         <label>Кол-во</label>
         <input
            type="number"
            min="0"
            bind:value={item.system.consumable.quantity}
            on:change={(e) => updateConsumable('quantity', Number(e.currentTarget.value))}
         />
      </div>

      <div class="stat-block">
         <label>Стек</label>
         <input
            type="number"
            min="1"
            bind:value={item.system.consumable.stackLimit}
            on:change={(e) => updateConsumable('stackLimit', Number(e.currentTarget.value))}
         />
      </div>
   </section>

   <!-- ===== USES & ACTIVATION ===== -->
   <section class="section-grid small-gap">
      <div class="stat-block">
         <label>Заряды</label>
         <div class="input-group">
            <input
               type="number"
               min="0"
               bind:value={item.system.consumable.uses.value}
               on:change={(e) => updateConsumable('uses.value', Number(e.currentTarget.value))}
            />
            <div class="devider">из</div>
            <input
               type="number"
               min="0"
               bind:value={item.system.consumable.uses.max}
               on:change={(e) => updateConsumable('uses.max', Number(e.currentTarget.value))}
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
         <label>Активация</label>
         <select
            bind:value={item.system.consumable.activation.type}
            on:change={(e) => updateConsumable('activation.type', e.currentTarget.value)}
         >
            {#each activationTypes as act}
               <option value={act.value}>{act.label}</option>
            {/each}
         </select>
         <input
            type="number"
            min="0"
            bind:value={item.system.consumable.activation.cost}
            on:change={(e) => updateConsumable('activation.cost', Number(e.currentTarget.value))}
         />
      </div>
   </section>

   <!-- ===== DESCRIPTION ===== -->
   <section class="description">
    <textarea
       bind:value={item.system.consumable.description}
       placeholder="Описание предмета..."
       on:change={(e) => updateConsumable('description', e.currentTarget.value)}
    />
   </section>

   <!-- ===== TYPE‑SPECIFIC DETAILS ===== -->
   {#if item.system.consumable.consumableType === 'bomb'
      && item.system.consumable.damage !== undefined
      && item.system.consumable.save !== undefined}
      <section class="section-grid type-specific">
         <div class="stat-block">
            <label>Урон</label>
            <input
               type="number"
               min="0"
               value={item.system.consumable.damage.amount}
               on:change={(e) => updateConsumable('damage.amount', Number(e.currentTarget.value))}
            />
         </div>
         <div class="stat-block">
            <label>Тип урона</label>
            <select
               value={item.system.consumable.damage.type}
               on:change={(e) => updateConsumable('damage.type', e.currentTarget.value)}
            >
               {#each damageTypes as type}
                  <option value={type.value}>{type.label}</option>
               {/each}
            </select>
         </div>
         <div class="stat-block">
            <label>Радиус (футы)</label>
            <input
               type="number"
               min="0"
               value={item.system.consumable.radius}
               on:change={(e) => updateConsumable('radius', Number(e.currentTarget.value))}
            />
         </div>
         <div class="stat-block">
            <label>Спасбросок</label>
            <select
               value={item.system.consumable.save.type}
               on:change={(e) => updateConsumable('save.type', e.currentTarget.value)}
            >
               {#each saveTypes as type}
                  <option value={type.value}>{type.label}</option>
               {/each}
            </select>
         </div>
         <div class="stat-block">
            <label>Сложность</label>
            <input
               type="number"
               min="0"
               value={item.system.consumable.save.dc}
               on:change={(e) => updateConsumable('save.dc', Number(e.currentTarget.value))}
            />
         </div>
      </section>


   {:else if item.system.consumable.consumableType === 'potion' || item.system.consumable.consumableType === 'food'}
      <section class="section-grid type-specific">
         <!-- Для simplicity показываем только список эффектов кол‑вом -->
         <div class="stat-block full">
            <label>Эффекты (кол-во)</label>
            <input
               type="number"
               min="0"
               disabled
            />
            <small class="hint">Редактируется в отдельном окне эффектов</small>
         </div>
      </section>



   {:else if item.system.consumable.consumableType === 'scroll' &&
   item.system.consumable?.spell !== undefined &&
   item.system.consumable?.requirements !== undefined}
      <section class="section-grid type-specific">
         <div class="stat-block full">
            <label>Название заклинания</label>
            <input
               type="text"
               value={item.system.consumable.spell.name}
               on:change={(e) => updateConsumable('spell.name', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label>Уровень</label>
            <input
               type="number"
               min="0"
               max="9"
               value={item.system.consumable.spell.level}
               on:change={(e) => updateConsumable('spell.level', Number(e.currentTarget.value))}
            />
         </div>
         <div class="stat-block">
            <label>Школа</label>
            <input
               type="text"
               value={item.system.consumable.spell.school}
               on:change={(e) => updateConsumable('spell.school', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label>Треб. характеристика</label>
            <input
               type="text"
               value={item.system.consumable.requirements.ability}
               on:change={(e) => updateConsumable('requirements.ability', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label>Сложность</label>
            <input
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
            <label>Начальный урон</label>
            <input
               type="text"
               value={item.system.consumable.damage.initial}
               on:change={(e) => updateConsumable('damage.initial', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label>Повтор. урон</label>
            <input
               type="text"
               value={item.system.consumable.damage.recurring}
               on:change={(e) => updateConsumable('damage.recurring', e.currentTarget.value)}
            />
         </div>
         <div class="stat-block">
            <label>Длительность (раунд)</label>
            <input
               type="number"
               min="1"
               value={item.system.consumable.damage.duration}
               on:change={(e) => updateConsumable('damage.duration', Number(e.currentTarget.value))}
            />
         </div>
         <div class="stat-block">
            <label>Спасбросок</label>
            <select
               value={item.system.consumable.save.type}
               on:change={(e) => updateConsumable('save.type', e.currentTarget.value)}
            >
               {#each saveTypes as type}
                  <option value={type.value}>{type.label}</option>
               {/each}
            </select>
         </div>
         <div class="stat-block">
            <label>Сложность</label>
            <input
               type="number"
               min="0"
               value={item.system.consumable.save.dc}
               on:change={(e) => updateConsumable('save.dc', Number(e.currentTarget.value))}
            />
         </div>
         <div class="stat-block full">
            <label>Применение</label>
            <select
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

   /* hints */
   .hint {
      font-size: var(--font-size-10);
      opacity: 0.6;
      margin-top: 0.25rem;
   }

   /* type‑specific emphasiser */
   .type-specific {
      border-left: 4px solid var(--dark);
   }
</style>
