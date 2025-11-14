<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import type { AttributeKey } from '../../model';
  import { ATTRIBUTE_COLORS } from '../../model';
  import { Input } from '../Input';

  interface Props {
    actor: ShwActor<'character' | 'npc'>;
    isNpc?: boolean;
  }

  let { actor, isNpc = false }: Props = $props();

  const sys = $derived(actor.system);
  const n = (v: unknown, d = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : d);

  interface ColumnData {
    key: AttributeKey;
    label: string;
    dark: string;
    light: string;
    hover: string;
    base: number;
    extra: number;
    total: number;
    charBonus: number;
    saveBonus: number;
    charBonusBase?: number;
    saveBonusBase?: number;
    saveLabel: string;
  }

  const columns = $derived<ColumnData[]>(
    [
      { key: 'fortune' as const, label: 'Фортуна' },
      { key: 'force' as const, label: 'Напор' },
      { key: 'perception' as const, label: 'Восприятие' },
      { key: 'psyDefence' as const, label: 'Пси‑защита' },
      { key: 'diplomacy' as const, label: 'Дипломатия' },
    ].map((c) => {
      const attr = (sys as any).attributes[c.key];
      const colors = ATTRIBUTE_COLORS[c.key];
      const base = n(attr.value);
      const extra = n(attr.extra);
      return {
        ...c,
        ...colors,
        base,
        extra,
        total: base + extra,
        charBonus: n(attr.charBonus),
        saveBonus: n(attr.saveBonus),
        charBonusBase: isNpc ? n(attr.charBonusBase) : undefined,
        saveBonusBase: isNpc ? n(attr.saveBonusBase) : undefined,
        saveLabel: `СБ‑${c.label}`,
      };
    })
  );

  function updateBase(key: string, value: number) {
    actor.update({ [`system.attributes.${key}.value`]: value });
  }

  function updateAttr(key: string, field: string, value: number) {
    actor.update({ [`system.attributes.${key}.${field}`]: value });
  }

  const onChangeValue = (key: string, ev: Event, field: string = 'value') => {
    const value = Number((ev.currentTarget as HTMLInputElement).value);
    if (field === 'value') {
      updateBase(key, value);
    } else {
      updateAttr(key, field, value);
    }
  };
</script>

<div class="stats-panel general-panel">
  {#each columns as col}
    <div class="stat-col flexcol" style="--dark:{col.dark}; --light:{col.light}; --hover:{col.hover};">
      <div class="cell header">{col.label}</div>
      <div class="cell value">
        <Input class="tw:w-10" variant="underline" type="number" value={col.base} min="-999" max="999" onchange={(e) => onChangeValue(col.key, e)} />
      </div>

      <div class="cell subheader">Доп. {col.label}</div>
      <div class="cell value">
        {#if isNpc}
          <Input class="tw:w-10" variant="underline" type="number" value={col.extra} min="-999" max="999" onchange={(e) => onChangeValue(col.key, e, 'extra')} />
        {:else}
          {col.extra}
        {/if}
      </div>

      <div class="cell subheader">Бонус характеристики</div>
      <div class="cell value">
        {#if isNpc && col.charBonusBase !== undefined}
          <Input
            class="tw:w-10"
            variant="underline"
            type="number"
            value={col.charBonusBase}
            min="-999"
            max="999"
            onchange={(e) => onChangeValue(col.key, e, 'charBonusBase')}
          />({col.charBonus})
        {:else}
          {col.charBonus}
        {/if}
      </div>

      <div class="cell subheader">{col.saveLabel}</div>
      <div class="cell value">
        {#if isNpc && col.saveBonusBase !== undefined}
          <Input
            class="tw:w-10"
            variant="underline"
            type="number"
            value={col.saveBonusBase}
            min="-999"
            max="999"
            onchange={(e) => onChangeValue(col.key, e, 'saveBonusBase')}
          />({col.saveBonus})
        {:else}
          {col.saveBonus}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .stats-panel {
    display: flex;
    flex-direction: column;
    background: var(--color-border-light-3);
  }

  .general-panel {
    flex-direction: row;
    gap: 2px;
    padding: 2px;
  }

  .stat-col {
    flex: 1 1 0;
    min-width: 6rem;
  }

  .stat-col:last-child {
    border-right: none;
  }

  .cell {
    padding: 0.35rem 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    width: 100%;
    font-family: var(--font-primary);
    font-size: var(--font-size-14);
  }

  .header,
  .subheader {
    background: var(--dark);
    color: #000;
  }

  .value {
    background: var(--light);
    color: #000;
  }



  @media (max-width: 900px) {
    .stats-panel {
      flex-wrap: wrap;
    }
    .stat-col {
      flex: 1 1 45%;
      margin-bottom: 4px;
    }
  }
</style>
