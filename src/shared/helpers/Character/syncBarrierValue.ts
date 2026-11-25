import type { ShwActorSystem, ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';

type ActorSystemWithBarrier = ShwActorSystem | ShwNpcSystem;

export function ensureBarrierField(sys: ActorSystemWithBarrier): void {
  if (!sys.barrier) {
    sys.barrier = { value: 0 };
  }
}

export function syncBarrierValue(sys: ActorSystemWithBarrier): void {
  ensureBarrierField(sys);
  const maxBarrier = sys.totals?.barrier ?? 0;
  const current = Math.max(0, sys.barrier.value);
  const combatActive =
    typeof game !== 'undefined' &&
    !!(game.combat as { started?: boolean } | null | undefined)?.started;
  sys.barrier.value = combatActive ? current : Math.max(maxBarrier, current);
}

export function clampMassCategoryTotal(sys: ActorSystemWithBarrier): void {
  if (sys.totals && typeof sys.totals.massCategory === 'number') {
    sys.totals.massCategory = Math.max(1, sys.totals.massCategory);
  }
}
