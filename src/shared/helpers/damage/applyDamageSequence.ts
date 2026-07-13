import { computeRawDamage } from '../../model/damage/computeRawDamage';
import type {
  ActorCombatState,
  DamageEntry,
  DamageSequenceResult,
} from '../../model/damage/types';
import { resolveDefenseDetailed } from './resolveDefense';

export interface DamageSequenceOptions {
  /** Разовый ручной барьер — поглощает урон, но не сохраняется на акторе. */
  oneTimeBarrier?: number;
}

export function applyDamageSequence(
  entries: DamageEntry[],
  state: ActorCombatState,
  options: DamageSequenceOptions = {},
): DamageSequenceResult {
  let currentBarrier = state.barrier;
  let oneTimeBarrier = Math.max(0, options.oneTimeBarrier ?? 0);
  let currentHealth = state.health;
  let barrierLost = 0;
  let oneTimeBarrierLost = 0;
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
        oneTimeBarrierAbsorbed: 0,
        overflow: 0,
        defenseSteps: [],
        hpDamage: 0,
        barrierAfter: currentBarrier,
        healthAfter: currentHealth,
      });
      return;
    }

    const totalBarrierPool = currentBarrier + oneTimeBarrier;
    const barrierHit = Math.min(totalBarrierPool, raw);
    const fromOneTime = Math.min(oneTimeBarrier, barrierHit);
    const fromBarrier = barrierHit - fromOneTime;
    const overflow = raw - barrierHit;

    oneTimeBarrier -= fromOneTime;
    currentBarrier -= fromBarrier;
    barrierLost += fromBarrier;
    oneTimeBarrierLost += fromOneTime;

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
      barrierAbsorbed: fromBarrier,
      oneTimeBarrierAbsorbed: fromOneTime,
      overflow,
      defenseSteps: defense.steps,
      hpDamage: defense.hpDamage,
      barrierAfter: currentBarrier,
      healthAfter: currentHealth,
    });
  });

  return {
    barrierLost,
    oneTimeBarrierLost,
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
  options: DamageSequenceOptions = {},
): DamageSequenceResult {
  return applyDamageSequence(entries, state, options);
}
