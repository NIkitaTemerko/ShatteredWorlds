<script lang="ts" context="module">
  import type {ShwActorSystem} from "../../../documents/Actor/types/ShwActorSystem";

  /** Тип данных для блока характеристик */
  export type Stats = ShwActorSystem['additionalAttributes'];

  export interface Helpers {
    totalImpulse: number;
    totalHealth: number;
    totalSpeed: number;
  }

  /** Подписи */
  export const LABELS: Record<keyof Stats, string> = {
    actions: "Действия",
    bonusActions: "Бонусные действия",
    reactions: "Реакции",
    impulse: "Импульс",
    additionalCloseCombatDamage: "Урон вблизи",
    additionalRangeDamage: 'Урон на расстоянии',
    range: "Дальность",
    initiative: "Инициатива",
    damageReduction: "Поглощение урона",
    armorClass: "Защита",
  };

  /** Иконки (Font Awesome / Foundry) */
  export const ICONS: Record<keyof Stats, string> = {
    actions: "fas fa-running",
    bonusActions: "fas fa-plus-circle",
    reactions: "fas fa-bolt",
    impulse: "fas fa-forward",
    additionalCloseCombatDamage: "fas fa-sword",
    additionalRangeDamage: "fas fa-crosshairs",
    range: "fas fa-bullseye",
    initiative: "fas fa-dice-six",
    damageReduction: "fas fa-shield-alt",
    armorClass: "fas fa-shield",
  };

  /** Цвета иконок */
  export const ICON_COLORS: Record<keyof Stats, string> = {
    actions: "#198754",          // green
    bonusActions: "#0d6efd",    // blue
    reactions: "#dc3545",       // red
    impulse: "#fd7e14",         // orange
    additionalCloseCombatDamage: "#dc3545",          // red
    range: "#198754",           // green
    initiative: "#6f42c1",      // purple
    damageReduction: "#6f42c1", // purple
    armorClass: "#6c757d",      // gray
    additionalRangeDamage: "#fd7e14",       // orange
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Stats } from "./StatsBlock.svelte";

  export let stats: Stats;
  export let helpers: Helpers;
  const dispatch = createEventDispatcher();

  // какие поля редактируемы
  const editableKeys = new Set<keyof Stats>([
    "actions",
    "bonusActions",
    "reactions",
    "impulse",
    "initiative",
  ]);
  const isEditable = (k: keyof Stats) => editableKeys.has(k);

  function handleChange(key: keyof Stats, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value === "" ? 0 : Number(target.value);
    stats = { ...stats, [key]: value } as Stats;

    // путь в Foundry: system.additionalAttributes.<key>
    const path = `system.additionalAttributes.${key}`;
    dispatch("change", { key, value, path, stats });
  }

  // пересчитывать при изменении stats
  $: allEntries = Object.entries(stats) as Array<[
    keyof Stats,
    Stats[keyof Stats]
  ]>;
  $: editableEntries = allEntries.filter(([k]) => isEditable(k));
  $: readonlyEntries = allEntries.filter(([k]) => !isEditable(k));
  $: orderedEntries = [...editableEntries, ...readonlyEntries];
  $: totalImpulse = helpers.totalImpulse;
</script>

<!-- GRID 4×N Плитки -->
<div class="stats-grid">
  {#each orderedEntries as [key, value]}
    <div
      class="stat-tile {isEditable(key) ? 'editable' : 'readonly'}"
      data-key={key}
    >
      <i class={ICONS[key]} style="color: {ICON_COLORS[key]}" aria-hidden="true"></i>
      <span class="label">{LABELS[key]}</span>
      {#if isEditable(key)}
        <input
          class="stat-input"
          type="number"
          min="0"
          value={value}
          on:change={(e) => handleChange(key, e)}
        />
        {#if key === "impulse"}
          <span>({totalImpulse})</span>
        {/if}
      {:else}
          <span class="value">{value}</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    width: 100%;
    user-select: none;
    font-size: 14px;
    font-weight: 600;
  }

  .stat-tile {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 6px;
    border: 1px solid var(--color-border-light, rgba(0, 0, 0, 0.2));
    height: 40px;
    line-height: 1;
  }

  .stat-tile i {
    font-size: 14px;
    width: 16px;
    text-align: center;
  }

  .stat-tile.editable {
    background: #cfe2ff;
  }
  .stat-tile.readonly {
    background: #d1f7e4;
  }

  .label {
    flex: 1 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .value,
  .stat-input {
    flex: 0 1 auto;
    width: 2.5rem;
    text-align: center;
  }

  .stat-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    font: inherit;
    padding: 0;
    outline: none;
  }
  .stat-input:focus {
    border-bottom-color: var(--color-border-highlight, #666);
  }
</style>
