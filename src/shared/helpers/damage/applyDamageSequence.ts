import { computeRawDamage } from '../../model/damage/computeRawDamage';
import type {
  ActorCombatState,
  DamageEntry,
  DamageSequenceResult,
} from '../../model/damage/types';
import { resolveDefenseDetailed } from './resolveDefense';

export function applyDamageSequence(
  entries: DamageEntry[],
  state: ActorCombatState,
): DamageSequenceResult {
  let currentBarrier = state.barrier;
  let currentHealth = state.health;
  let barrierLost = 0;
  let healthLost = 0;
  const breakdown: DamageSequenceResult['entries'] = [];

  entries.forEach((entry, index) => {
    const raw = computeRawDamage(entry, state.massCategory);
    const barrierBefore = currentBarrier;

    if (raw <= 0) {
      breakdown.push({
        id: entry.id,
        type: entry.type,
        order: index + 1,
        raw: 0,
        barrierBefore,
        barrierAbsorbed: 0,
        overflow: 0,
        defenseSteps: [],
        hpDamage: 0,
        barrierAfter: currentBarrier,
        healthAfter: currentHealth,
      });
      return;
    }

    const barrierHit = Math.min(currentBarrier, raw);
    const overflow = raw - barrierHit;
    currentBarrier -= barrierHit;
    barrierLost += barrierHit;

    const defense =
      overflow > 0
        ? resolveDefenseDetailed(overflow, entry.type, state, entry.penetration ?? 0)
        : { hpDamage: 0, steps: [] };

    currentHealth = Math.max(0, currentHealth - defense.hpDamage);
    healthLost += defense.hpDamage;

    breakdown.push({
      id: entry.id,
      type: entry.type,
      order: index + 1,
      raw,
      barrierBefore,
      barrierAbsorbed: barrierHit,
      overflow,
      defenseSteps: defense.steps,
      hpDamage: defense.hpDamage,
      barrierAfter: currentBarrier,
      healthAfter: currentHealth,
    });
  });

  return {
    barrierLost,
    healthLost,
    finalBarrier: currentBarrier,
    finalHealth: currentHealth,
    entries: breakdown,
  };
}

/** Preview полной последовательности без изменения актора. */
export function previewDamageSequence(
  entries: DamageEntry[],
  state: ActorCombatState,
): DamageSequenceResult {
  return applyDamageSequence(entries, state);
}
