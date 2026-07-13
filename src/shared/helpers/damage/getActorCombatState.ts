import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ActorCombatState } from '../../model/damage/types';

export function getActorCombatState(actor: ShwActor<'character'> | ShwActor<'npc'>): ActorCombatState {
  const sys = actor.system;
  const totals = sys.totals;
  const attrs = sys.additionalAttributes;

  return {
    barrier: sys.barrier?.value ?? 0,
    health: sys.health.value,
    armorClass: totals.armorClass ?? attrs.armorClass ?? 0,
    damageReduction: totals.damageReduction ?? attrs.damageReduction ?? 0,
    psiDefense: totals.psiDefense ?? attrs.psiDefense ?? 0,
    massCategory: totals.massCategory ?? attrs.massCategory ?? 2,
  };
}
