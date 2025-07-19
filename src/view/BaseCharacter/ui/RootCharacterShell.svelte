<script lang="ts">
   import { get } from "svelte/store";
   import type { ShwActor } from "../../../documents/Actor/ShwActor";
   import CharacterStats from "./CharacterStats.svelte";
   import CharacterAdditionalStats from "./CharacterAdditionalStats.svelte";

   export let actor: ShwActor<"character">;

   // подписываемся на store
   let tab: Tabs= get(currentTab);
   const unsub = currentTab.subscribe(v => (tab = v));

   function switchTab(t: Tabs) {
      currentTab.set(t);
   }
   function handleChange(e: CustomEvent) {
      const { value, path } = e.detail;
      actor.update({ [path]: value });
   }

   /** важно! отписываемся при уничтожении листа, чтобы не плодить подписки */
   import { onDestroy } from "svelte";
   import {currentTab} from "../store/tabStore";
   import type {Tabs} from "../types";
   onDestroy(unsub);

   export const TABS = [
      { id: "stats",      icon: "fa-chart-simple",          label: "Статы"        },
      { id: "inventory",  icon: "fa-box-open",              label: "Инвентарь"    },
      { id: "equipment",  icon: "fa-shield-halved",         label: "Экипировка"   },
      { id: "spells",     icon: "fa-wand-magic-sparkles",   label: "Заклинания"   },
      { id: "passives",   icon: "fa-circle-half-stroke",    label: "Пассивки"     },
      { id: "abilities",  icon: "fa-person-running",        label: "Способности"  }
   ] as const;
</script>

<nav class="sheet-tabs" data-group="main">
   {#each TABS as { id, icon, label }}
      <a class={`item ${id === tab ? 'active' : ''}`} data-tab={id} title={label} on:click={() => switchTab(id)}>
         <i class={"fa-solid " + icon} aria-hidden="true"></i>
         <span>{label}</span>
      </a>
   {/each}
</nav>

{#if tab === "stats"}
   <CharacterStats {actor}/>
   <CharacterAdditionalStats
      stats   ={actor.system.additionalAttributes}
      helpers ={actor.system.helpers}
      on:change={handleChange}/>
{:else}
   <div>test</div>
{/if}

<style>
   .sheet-tabs{
      --color-shadow-primary: transparent;
      display:flex;
      gap:8px;
      border-bottom:1px solid var(--color-border-light,#999);
      padding-bottom:2px;
   }
   .sheet-tabs .item{
      position:relative;
      padding:2px 4px 6px;
      display:flex;
      flex-direction:column;
      align-items:center;
      font-size:11px;
      color:var(--color-text-light-5,#666);
   }
   .sheet-tabs .item i{
      font-size:17px;
      line-height:1;
   }
   /* подчёркивание */
   .sheet-tabs .item::after{
      content:"";
      position:absolute;
      left:0; right:0; bottom:0;
      height:2px;
      background:transparent;
      transition:background .15s;
   }
   .sheet-tabs .item.active,
   .sheet-tabs .item:hover{
      color:var(--color-text-light-1,#000);
   }
   .sheet-tabs .item.active::after{
      background: rgba(59, 130, 246, 0.22);
   }
</style>
