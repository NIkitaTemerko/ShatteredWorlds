<script lang="ts">
  import type { AdditionalAttributes } from '../../../../shared/model/types';
  import type { CharacterTotals } from '../../model';
  import LegacyAdditionalStats from './LegacyAdditionalStats.svelte';

  let stats = $state<AdditionalAttributes>({
    actions: 3,
    bonusActions: 1,
    reactions: 1,
    impulse: 2,
    initiative: 4,
    barrier: 6,
    psiDefense: 2,
    range: 1,
    damageReduction: 0,
    armorClass: 3,
    massCategory: 2,
  });

  const totals = $derived<CharacterTotals>({
    fortune: 10,
    force: 12,
    finesse: 11,
    will: 9,
    presence: 8,
    actions: stats.actions,
    bonusActions: stats.bonusActions,
    reactions: stats.reactions,
    impulse: stats.impulse,
    initiative: stats.initiative + 1,
    barrier: stats.barrier,
    psiDefense: stats.psiDefense,
    damageReduction: stats.damageReduction,
    health: 24,
    healthCoefficient: 2.4,
    speed: 6,
    range: stats.range,
    armorClass: stats.armorClass + 1,
    massCategory: stats.massCategory,
  });

  const editableKeys = new Set<keyof AdditionalAttributes>(['actions', 'bonusActions', 'initiative']);
</script>

<div class="frame">
  <LegacyAdditionalStats
    {stats}
    {totals}
    {editableKeys}
    onUpdate={(key, value) => {
      stats = { ...stats, [key]: value };
    }}
  />
</div>

<style>
  .frame {
    width: min(36rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
