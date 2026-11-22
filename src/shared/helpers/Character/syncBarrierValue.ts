import type { ShwActorSystem, ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';

type ActorSystemWithBarrier = ShwActorSystem | ShwNpcSystem;

export function ensureBarrierField(sys: ActorSystemWithBarrier): void {
  if (!sys.barrier) {
    sys.barrier = { value: 0 };
  }
}

export function syncBarrierValue(sys: ActorSystemWithBarrier, allowOvercharge = false): void {
  ensureBarrierField(sys);
  const maxBarrier = sys.totals?.barrier ?? 0;
  const current = Math.max(0, sys.barrier.value);
  sys.barrier.value = allowOvercharge ? current : Math.min(current, maxBarrier);

  const combatActive =
    typeof game !== 'undefined' &&
    !!(game.combat as { started?: boolean } | null | undefined)?.started;
  if (!combatActive) {
    sys.barrier.value = allowOvercharge ? Math.max(maxBarrier, current) : maxBarrier;
  }
}

export function clampMassCategoryTotal(sys: ActorSystemWithBarrier): void {
  if (sys.totals && typeof sys.totals.massCategory === 'number') {
    sys.totals.massCategory = Math.max(1, sys.totals.massCategory);
  }
}
