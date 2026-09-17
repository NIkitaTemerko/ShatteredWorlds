<script lang="ts">
  import type { DamageSequenceResult } from '../../../../shared/model/damage/types';
  import DamagePreviewLog from './DamagePreviewLog.svelte';

  const result: DamageSequenceResult = {
    barrierLost: 4,
    oneTimeBarrierLost: 0,
    healthLost: 6,
    finalBarrier: 2,
    finalHealth: 18,
    entries: [
      {
        id: 'e1',
        type: 'physical',
        order: 1,
        raw: 12,
        barrierBefore: 6,
        barrierAbsorbed: 4,
        oneTimeBarrierAbsorbed: 0,
        overflow: 8,
        defenseSteps: [
          { layer: 'armorClass', stat: 3, penetration: 1, effectiveStat: 2, blocked: 2 },
          { layer: 'damageReduction', stat: 0, blocked: 0 },
        ],
        hpDamage: 6,
        barrierAfter: 2,
        healthAfter: 18,
      },
    ],
  };
</script>

<div class="panel">
  <DamagePreviewLog {result} />
</div>

<style>
  .panel {
    width: 22rem;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    background: rgb(28 24 40 / 96%);
    box-shadow: var(--shw-shadow-panel);
    padding: 0.75rem;
  }
</style>
