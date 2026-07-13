import type { ShwActor } from '../../../documents/Actor/ShwActor';

type CombatantLike = {
  actor?: ShwActor | null;
  actorId?: string | null;
};

export function resolveCombatantActor(combatant: CombatantLike): ShwActor | null {
  if (combatant.actor?.type === 'character' || combatant.actor?.type === 'npc') {
    return combatant.actor;
  }
  if (!combatant.actorId) return null;
  const actor = game.actors?.get(combatant.actorId) as ShwActor | undefined;
  if (!actor || (actor.type !== 'character' && actor.type !== 'npc')) return null;
  return actor;
}

export async function restoreActorBarrier(actor: ShwActor): Promise<void> {
  if (!actor.id) return;
  const fresh = (game.actors?.get(actor.id) ?? actor) as ShwActor;
  const maxBarrier =
    fresh.system.totals?.barrier ?? fresh.system.additionalAttributes?.barrier ?? 0;
  const currentBarrier = fresh.system.barrier?.value ?? 0;
  if (currentBarrier === maxBarrier) return;
  await fresh.update({ 'system.barrier.value': maxBarrier });
}

export async function restoreBarrierForCombatant(combatant: CombatantLike): Promise<void> {
  const actor = resolveCombatantActor(combatant);
  if (!actor) return;
  await restoreActorBarrier(actor);
}

export function isForwardTurnChange(
  prior: { round: number; turn?: number | null },
  current: { round: number; turn?: number | null },
): boolean {
  if (current.round > prior.round) return true;
  if (
    current.round === prior.round &&
    prior.turn != null &&
    current.turn != null &&
    current.turn > prior.turn
  ) {
    return true;
  }
  return false;
}

type CombatTurnChangeCombat = {
  started?: boolean;
  combatant?: CombatantLike | null;
  combatants?: { get: (id: string) => CombatantLike | undefined };
};

/** Fallback через combatTurnChange (после обновления Combat в БД). */
export async function handleCombatTurnChangeBarrierRestore(
  combat: CombatTurnChangeCombat,
  prior: { round: number; turn?: number | null },
  current: { combatantId?: string | null; round: number; turn?: number | null },
): Promise<void> {
  if (!combat?.started) return;
  if (!isForwardTurnChange(prior, current)) return;

  const combatant =
    (current.combatantId ? combat.combatants?.get(current.combatantId) : undefined) ??
    combat.combatant ??
    null;
  if (!combatant) return;

  await restoreBarrierForCombatant(combatant);
}
