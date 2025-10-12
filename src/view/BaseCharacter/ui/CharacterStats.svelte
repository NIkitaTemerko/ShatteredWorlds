<script lang="ts">
import type { ShwActor } from '../../../documents/Actor/ShwActor';
export let actor: ShwActor;

const sys = actor.system;
const n = (v: unknown, d = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : d);

type Mode = 'adv' | 'normal' | 'dis';
type RollType = 'natural' | 'fortune' | 'force' | 'perception' | 'psyDefence' | 'diplomacy';

let activeTab: RollType = 'natural';
let mod: Mode = 'normal';

const tabs: Array<{ id: RollType; label: string; colors: { dark: string; light: string; hover: string } }> = [
  {id: 'natural', label: 'Натуральный', colors: {dark: '#3498db', light: '#87ceeb', hover: '#5dade2'}},
  {id: 'fortune', label: 'Фортуна', colors: {dark: '#f08c00', light: '#ffd580', hover: '#ffae40'}},
  {id: 'force', label: 'Напор', colors: {dark: '#d7263d', light: '#ff9aa5', hover: '#eb607f'}},
  {id: 'perception', label: 'Восприятие', colors: {dark: '#198754', light: '#80d9b3', hover: '#4db083'}},
  {id: 'psyDefence', label: 'Пси‑защита', colors: {dark: '#8e44ad', light: '#c39bd3', hover: '#a86fc0'}},
  {id: 'diplomacy', label: 'Дипломатия', colors: {dark: '#6c757d', light: '#dee2e6', hover: '#a5acb2'}},
];

$: columns = [
   {key: 'fortune', label: 'Фортуна', dark: '#f08c00', light: '#ffd580', hover: '#ffae40'},
   {key: 'force', label: 'Напор', dark: '#d7263d', light: '#ff9aa5', hover: '#eb607f'},
   {key: 'perception', label: 'Восприятие', dark: '#198754', light: '#80d9b3', hover: '#4db083'},
   {key: 'psyDefence', label: 'Пси‑защита', dark: '#8e44ad', light: '#c39bd3', hover: '#a86fc0'},
   {key: 'diplomacy', label: 'Дипломатия', dark: '#6c757d', light: '#dee2e6', hover: '#a5acb2'},
].map((c) => ({
   ...c,
   base: n((sys as any).attributes[c.key].value),
   extra: n((sys as any).attributes[c.key].extra),
   charBonus: n((sys as any).attributes[c.key].charBonus),
   saveBonus: n((sys as any).attributes[c.key].saveBonus),
   saveLabel: `СБ‑${c.label}`,
}));

$: natRoll = 20;
$: rollBonus = 0;
$: actions = 1;

function updateBase(key: string, value: number) {
   actor.update({ [`system.attributes.${key}.value`]: value });
}
const onChangeValue = (key: string, ev: Event) => {
   updateBase(key, Number((ev.currentTarget as HTMLInputElement).value));
};

</script>

<section>
   <div class="stats-panel general-panel">
     {#each columns as col}
        <div class="stat-col flexcol" style="--dark:{col.dark}; --light:{col.light}; --hover:{col.hover};">
          <div class="cell header">{col.label}</div>
          <div class="cell value"><input type="number" value={col.base} min="-999" max="999" on:change={(e)=>onChangeValue(col.key,e)} /></div>

          <div class="cell subheader">Доп. {col.label}</div>
          <div class="cell value">{col.extra}</div>

          <div class="cell subheader">Бонус характеристики</div>
          <div class="cell value">{col.charBonus}</div>

          <div class="cell subheader">{col.saveLabel}</div>
          <div class="cell value">{col.saveBonus}</div>
        </div>
     {/each}
   </div>
   <div class="stats-panel secondary-panel">
     <div class="tabs">
       {#each tabs as tab}
         <button
           class="tab {activeTab === tab.id ? 'active' : ''}"
           style="--dark:{tab.colors.dark}; --light:{tab.colors.light}; --hover:{tab.colors.hover};"
           on:click={() => activeTab = tab.id}>
           {tab.label}
         </button>
       {/each}
     </div>

     <div class="cell actions"
          style="--dark:{tabs.find(t => t.id === activeTab)?.colors.dark}; --light:{tabs.find(t => t.id === activeTab)?.colors.light}; --hover:{tabs.find(t => t.id === activeTab)?.colors.hover};">
       <div class="roll-value">
          <label>
             База
             <input type="number" bind:value={natRoll} min="0" max="999" />
          </label>
       </div>
       <div class="roll-value bonus">
          <label>
             Бонус
             <input type="number" bind:value={rollBonus} min="0" max="999" />
          </label>
       </div>
       <div class="roll-value">
        <label>
           Действия
           <input type="number" bind:value={actions} min="0" max="999" />
        </label>
     </div>


     <button class="roll constructor" type="button" aria-label={`Бросок`} on:click={()=>actor.roll(activeTab,false, mod, natRoll, rollBonus, actions)}>
      <i class="fa-solid fa-dice-d20" style="color: white"></i>
     </button>
     {#if (activeTab !== 'natural')}
       <button class="roll constructor" type="button" aria-label={`Бросок`} on:click={()=>actor.roll(activeTab,true, mod, natRoll, rollBonus, actions)}>
        <i class="fa-solid fa-shield" style="color: white"></i>
       </button>
     {/if}
     <div class="switch natural">
      <button class="adv {mod ==='adv' ? 'active' : ''}"    type="button" aria-label="Преимущество"   on:click={()=> mod = 'adv'}>▲</button>
      <button class="norm {mod ==='normal' ? 'active' : ''}" type="button" aria-label="Обычный"        on:click={()=> mod = 'normal'}>●</button>
      <button class="dis {mod ==='dis' ? 'active' : ''}"     type="button" aria-label="Помеха"          on:click={()=> mod = 'dis'}>▼</button>
     </div>
      </div>
   </div>
</section>

<style>
.stats-panel{
  display:flex;
  flex-direction: column;
  background: var(--color-border-light-3);
}

.general-panel {
  flex-direction: row;
  gap: 2px;
  padding: 2px;
}

.secondary-panel {
  padding: 10px 0;
}

.tabs {
  display: flex;
  gap: 0;
  padding: 0;
}

.tab {
  flex: 1;
  padding: 8px;
  border-radius: 0;
  background: var(--light);
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #000;
  margin: 0;
}

.tab:hover {
  background: var(--hover);
}

.tab.active {
  background: var(--dark);
}

.stat-col{
  flex:1 1 0;
  min-width:6rem;
}
.stat-col:last-child{
  border-right:none;
}
.cell{
  padding:0.35rem 0.25rem;
  display:flex;
  justify-content:center;
  align-items:center;
  font-weight:700;
  width: 100%;
  font-family:var(--font-primary);
  font-size:var(--font-size-14);
}

.header,.subheader{
  background:var(--dark);
  color:#000;
}
.value{
  background:var(--light);
  color:#000;
}
.value input{
  width:3rem;
  text-align:center;
  background:transparent;
  border:none;
}
.actions{
  background:var(--light);
  display:flex;
  justify-content:space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  padding: 0;
}

.roll-value {
   min-width: 5rem;
   background:var(--light);
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 1rem;
}

.roll-value input {
   text-align:center;
   background:transparent;
   border:none;
}

.roll-value.bonus {
  background-color: var(--dark);
  color: #fff;
  height: 100%;
}
.roll-value.bonus input {
   color: #fff;
}

.roll{
   --color-shadow-primary: transparent;
  flex:1 1 0;
  border:none;
  border-radius:0;
  padding:0.3rem;
  height: 100%;
  font-size:var(--font-size-12);
  cursor:pointer;
  background-color: var(--dark);
  margin: 0;
}

.roll i {
   font-size: 14px;
   width: 16px;
   text-align: center;
}

.roll.constructor i {
   font-size: 30px;
   width: 36px;
   text-align: center;
}

.roll:hover{
   background: var(--hover);
}
/* колонка переключателя */
.switch{
   --color-shadow-primary: transparent;
  display:flex;
  flex-direction:column;
  flex:1 1 0;
  margin: 0;
  margin-left: -1px;
}

.switch button{
   --color-shadow-primary: transparent;
   outline: none;
  border:none;
  border-radius:0;
  padding:0.15rem;
  font-size:var(--font-size-12);
  cursor:pointer;
  background:var(--light);
  color:#888;
  line-height:1;
  width: 100%;
}
.switch button:hover{
   background: var(--hover);
}

.switch button.active{
   box-shadow: none;
   background:var(--dark);
}

.switch button.active:hover{
   background: var(--hover);
}

@media (max-width:900px){
  .stats-panel{
    flex-wrap:wrap;
  }
  .stat-col{
    flex:1 1 45%;
    margin-bottom:4px;
  }
}

.switch.natural{
   flex: 0 1 0;
   min-width: 5rem;
   height: 100%;
   & > button {
      flex-grow: 1;
   }
}
</style>
