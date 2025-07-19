<script lang="ts">
/** StatsPanel.svelte — редактируемые характеристики
 *  ➜ теперь три отдельные кнопки ▲ ● ▼ для выбора режима
 */
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

function updateBase(key: string, value: number) {
   actor.update({ [`system.attributes.${key}.value`]: value });
}
const onChangeValue = (key: string, ev: Event) => {
   updateBase(key, Number((ev.currentTarget as HTMLInputElement).value));
};

const setMode = (key: string, mode: Mode) => {
   m = { ...m, [key]: mode };
};

const roll = (k: string, isSave = false) => {
   actor.roll?.(k as any, isSave, m[k]);
};
</script>

<section class="stats-panel">
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
        <button class="roll" type="button" aria-label={`Бросок ${col.label}`} on:click={()=>roll(col.key,false)}>🎲</button>

        <div class="switch">
          <button class="adv {col.mode==='adv' ? 'active' : ''}"    type="button" aria-label="Преимущество"   on:click={()=>setMode(col.key,'adv')}>▲</button>
          <button class="norm {col.mode==='normal' ? 'active' : ''}" type="button" aria-label="Обычный"        on:click={()=>setMode(col.key,'normal')}>●</button>
          <button class="dis {col.mode==='dis' ? 'active' : ''}"     type="button" aria-label="Помеха"          on:click={()=>setMode(col.key,'dis')}>▼</button>
        </div>

        <button class="roll" type="button" aria-label={`Спасбросок ${col.saveLabel}`} on:click={()=>roll(col.key,true)}>🛡️</button>
      </div>
    </div>
  {/each}
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

.cell:hover {
   background: var(--hover);
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
</style>
