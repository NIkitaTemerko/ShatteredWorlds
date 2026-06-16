import type { ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { STAT_KEYS } from '../../model/constants/actorKeys';
import { NPC_DEFAULTS } from '../../model/constants/npcDefaults';

function ensureTotals(
  sys: ShwNpcSystem,
): asserts sys is ShwNpcSystem & { totals: ShwNpcSystem['totals'] } {
  if (!sys.totals) {
    sys.totals = {
      ...NPC_DEFAULTS.totals,
      fortune: 0,
      force: 0,
      finesse: 0,
      will: 0,
      presence: 0,
      actions: 0,
      bonusActions: 0,
      reactions: 0,
      initiative: 0,
      impulse: 0,
      barrier: 0,
      psiDefense: 0,
    } as ShwNpcSystem['totals'];
  }
}

export function prepareNpcDerivedData(sys: ShwNpcSystem) {
  ensureTotals(sys);

  const attrs = sys.attributes;
  const add = sys.additionalAttributes;

  sys.totals.impulse = add.impulse;
  sys.totals.health = sys.health.max;
  sys.totals.speed = sys.utility.speed;
  sys.totals.damageReduction = add.damageReduction;
  sys.totals.armorClass = add.armorClass;
  sys.totals.range = add.range;

  for (const k of STAT_KEYS) {
    sys.totals[k] = attrs[k].value;
  }

  sys.totals.actions = add.actions;
  sys.totals.bonusActions = add.bonusActions;
  sys.totals.reactions = add.reactions;
  sys.totals.initiative = add.initiative;
  sys.totals.barrier = add.barrier;
  sys.totals.psiDefense = add.psiDefense;

  for (const k of STAT_KEYS) {
    const a = attrs[k];
    a.charBonus = (a.charBonusBase ?? 0) + Math.floor(a.value / 5);
    a.saveBonus = (a.saveBonusBase ?? 0) + Math.floor(a.value / 5);
  }
}
