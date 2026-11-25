<script lang="ts">
  import type { StatModifier } from '../../../documents/Item/types/AbilityDataTypes';
  import type { CharacterStatPath } from '../../model/characterStatPaths';
  import BonusCharacteristics from './ui.svelte';

  let modifiers = $state<StatModifier[]>([
    { stat: 'attributes.fortune.value', mode: 'add', value: 2 },
    { stat: 'totals.health', mode: 'mul', value: 1.5 },
  ]);

  function handleAdd(stat: CharacterStatPath) {
    modifiers = [...modifiers, { stat, mode: 'add', value: 1 }];
  }

  function handleRemove(index: number) {
    modifiers = modifiers.filter((_, i) => i !== index);
  }

  function handleUpdateValue(index: number, value: number) {
    modifiers = modifiers.map((mod, i) => (i === index ? { ...mod, value } : mod));
  }

  function handleUpdateMode(index: number, mode: 'add' | 'mul' | 'override') {
    modifiers = modifiers.map((mod, i) => (i === index ? { ...mod, mode } : mod));
  }
</script>

<div class="demo">
  <p class="hint">Add / edit / remove stat modifiers (uses Select + Input + ActionIcon)</p>
  <BonusCharacteristics
    {modifiers}
    onAdd={handleAdd}
    onRemove={handleRemove}
    onUpdateValue={handleUpdateValue}
    onUpdateMode={handleUpdateMode}
  />
</div>

<style>
  .demo {
    width: 28rem;
    color: var(--shw-color-text, #e8e4f0);
  }

  .hint {
    margin: 0 0 0.75rem;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }
</style>
