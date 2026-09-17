<script lang="ts">
  import type { StatModifierBlock } from '../../../documents/Item/types/AbilityDataTypes';
  import StatBonusesEditor from './StatBonusesEditor.svelte';

  let statBonuses = $state<StatModifierBlock>({
    modifiers: [
      { stat: 'attributes.fortune.value', mode: 'add', value: 2 },
      { stat: 'totals.health', mode: 'mul', value: 1.25 },
    ],
  });
</script>

<div class="frame">
  <StatBonusesEditor
    {statBonuses}
    onUpdate={(next) => (statBonuses = next)}
    title="Stat bonuses"
    subtitle="Modifiers"
  />
</div>

<style>
  .frame {
    width: min(32rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
