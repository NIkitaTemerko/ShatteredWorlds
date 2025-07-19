<script lang="ts">
import type { ShwActor } from '../../../documents/Actor/ShwActor';
export let actor: ShwActor;

const sys = actor.system;
const n = (v: unknown, d = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : d);

type Mode = 'adv' | 'normal' | 'dis';
let m: Record<string, Mode> = {
   fortune: 'normal',
   force: 'normal',
   perception: 'normal',
   psyDefence: 'normal',
   diplomacy: 'normal',
   natural: 'normal',
};

const naturalColors = {
   dark: '#3498db',
   light: '#87ceeb',
   hover: '#5dade2'
};

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
   mode: m[c.key] as Mode,
   saveLabel: `СБ‑${c.label}`,
}));

$: natRoll = 20;
$: rollBonus = 0;
$: cubes = 1;

function updateBase(key: string, value: number) {
   actor.update({ [`system.attributes.${key}.value`]: value });
}
const onChangeValue = (key: string, ev: Event) => {
   updateBase(key, Number((ev.currentTarget as HTMLInputElement).value));
};

const setMode = (key: string, mode: Mode) => {
   m = { ...m, [key]: mode };
};

const roll = (k: string, isSave = false, natValue?: number, bonus?: number, cubes?: number) => {
   actor.roll?.(k as any, isSave, m[k], natValue, bonus, cubes);
};
</script>

<section>
   <div class="stats-panel">
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

      <div class="cell actions">
        <button class="roll" type="button" aria-label={`Бросок ${col.label}`} on:click={()=>roll(col.key,false)}>
           <i class="fa-solid fa-dice-d20" style="color: white"></i>
        </button>

        <div class="switch">
          <button class="adv {col.mode==='adv' ? 'active' : ''}"    type="button" aria-label="Преимущество"   on:click={()=>setMode(col.key,'adv')}>▲</button>
          <button class="norm {col.mode==='normal' ? 'active' : ''}" type="button" aria-label="Обычный"        on:click={()=>setMode(col.key,'normal')}>●</button>
          <button class="dis {col.mode==='dis' ? 'active' : ''}"     type="button" aria-label="Помеха"          on:click={()=>setMode(col.key,'dis')}>▼</button>
        </div>

        <button class="roll" type="button" aria-label={`Спасбросок ${col.saveLabel}`} on:click={()=>roll(col.key,true)}>
           <i class="fa-solid fa-shield-quartered" style="color: white"></i>
        </button>
      </div>
    </div>
  {/each}
   </div>
   <div class="stats-panel">
      <div class="cell actions" style="--dark:{naturalColors.dark}; --light:{naturalColors.light}; --hover:{naturalColors.hover};">
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
               Кубы
               <input type="number" bind:value={cubes} min="0" max="999" />
            </label>
         </div>


         <button class="roll constructor" type="button" aria-label={`Бросок`} on:click={()=>roll('natural',false, natRoll, rollBonus, cubes)}>
            <i class="fa-solid fa-dice-d20" style="color: white"></i>
         </button>

         <div class="switch natural">
            <button class="adv {m.natural ==='adv' ? 'active' : ''}"    type="button" aria-label="Преимущество"   on:click={()=>setMode('natural','adv')}>▲</button>
            <button class="norm {m.natural ==='normal' ? 'active' : ''}" type="button" aria-label="Обычный"        on:click={()=>setMode('natural','normal')}>●</button>
            <button class="dis {m.natural ==='dis' ? 'active' : ''}"     type="button" aria-label="Помеха"          on:click={()=>setMode('natural','dis')}>▼</button>
         </div>
      </div>
   </div>
</section>

<style>
.stats-panel{
  display:flex;
  gap:2px;
  padding:2px;
  background:var(--color-border-light-3);
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
