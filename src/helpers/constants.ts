import type { ShwActorSystem } from '../documents/Actor/types/ShwActorSystem';

export const STAT_KEYS: (keyof ShwActorSystem['attributes'])[] = [
  'fortune',
  'force',
  'perception',
  'psyDefence',
  'diplomacy',
] as const;
export const UTIL_KEYS: (keyof ShwActorSystem['utility'])[] = ['speed', 'level'] as const;
export const ADDITIONAL_KEYS: (keyof ShwActorSystem['additionalAttributes'])[] = [
  'actions',
  'bonusActions',
  'reactions',
  'impulse',
  'initiative',
  'additionalCloseCombatDamage',
  'additionalRangeDamage',
  'range',
  'damageReduction',
  'armorClass',
] as const;
export const HELPER_KEYS: (keyof ShwActorSystem['helpers'])[] = [
  'totalHealth',
  'totalImpulse',
  'totalSpeed',
  'totalFortune',
  'totalForce',
  'totalPerception',
  'totalPsyDefence',
  'totalDiplomacy',
  'totalActions',
  'totalBonusActions',
  'totalReactions',
  'totalInitiative',
] as const;

export const ATTR_RIM = 15;
export const ATTR_MAX_RIM = 25;
