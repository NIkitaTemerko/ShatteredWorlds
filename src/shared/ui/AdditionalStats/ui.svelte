<script lang="ts">
  import type {
    AdditionalAttributes,
    CharacterHelpers,
    NpcHelpers,
  } from '../../model';
  import {
    ADDITIONAL_ATTRIBUTE_LABELS,
    ADDITIONAL_ATTRIBUTE_ICONS,
    ADDITIONAL_ATTRIBUTE_COLORS,
  } from '../../model';

  interface Props {
    stats: AdditionalAttributes;
    helpers: CharacterHelpers | NpcHelpers;
    editableKeys?: Set<keyof AdditionalAttributes>;
    onUpdate: (key: keyof AdditionalAttributes, value: number) => void;
  }

  let {
    stats,
    helpers,
    editableKeys = new Set<keyof AdditionalAttributes>([
      'actions',
      'bonusActions',
      'reactions',
      'impulse',
      'initiative',
    ]),
    onUpdate,
  }: Props = $props();

  const isEditable = (k: keyof AdditionalAttributes) => editableKeys.has(k);

  function handleChange(key: keyof AdditionalAttributes, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value === '' ? 0 : Number(target.value);
    onUpdate(key, value);
  }

  const allEntries = $derived(Object.entries(stats) as Array<[keyof AdditionalAttributes, number]>);
  const editableEntries = $derived(allEntries.filter(([k]) => isEditable(k)));
  const readonlyEntries = $derived(allEntries.filter(([k]) => !isEditable(k)));
  const orderedEntries = $derived([...editableEntries, ...readonlyEntries]);

  const hasHelper = (key: keyof AdditionalAttributes): boolean => {
    return ['impulse', 'range', 'damageReduction'].includes(key);
  };

  const getHelperValue = (key: keyof AdditionalAttributes): number | undefined => {
    switch (key) {
      case 'impulse':
        return 'totalImpulse' in helpers ? helpers.totalImpulse : undefined;
      case 'range':
        return 'totalRange' in helpers ? (helpers as NpcHelpers).totalRange : undefined;
      case 'damageReduction':
        return 'totalDamageReduction' in helpers ? (helpers as NpcHelpers).totalDamageReduction : undefined;
      default:
        return undefined;
    }
  };
</script>

<div class="stats-grid">
  {#each orderedEntries as [key, value]}
    <div class="stat-tile {isEditable(key) ? 'editable' : 'readonly'}" data-key={key}>
      <i class={ADDITIONAL_ATTRIBUTE_ICONS[key]} style="color: {ADDITIONAL_ATTRIBUTE_COLORS[key]}" aria-hidden="true"></i>
      <span class="label">{ADDITIONAL_ATTRIBUTE_LABELS[key]}</span>
      {#if isEditable(key)}
        <input class="stat-input" type="number" min="0" {value} onchange={(e) => handleChange(key, e)} />
        {#if hasHelper(key)}
          {@const helperValue = getHelperValue(key)}
          {#if helperValue !== undefined}
            <span>({helperValue})</span>
          {/if}
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
