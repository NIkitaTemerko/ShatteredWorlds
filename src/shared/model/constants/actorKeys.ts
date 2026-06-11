import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';

/** Ключи основных атрибутов персонажа */
export const STAT_KEYS: (keyof ShwActorSystem['attributes'])[] = [
  'fortune',
  'force',
  'finesse',
  'will',
  'presence',
] as const;

/** Ключи утилитарных характеристик */
export const UTIL_KEYS: (keyof ShwActorSystem['utility'])[] = ['speed', 'level'] as const;

/** Ключи дополнительных атрибутов */
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

/** Ключи производных (total) полей в helpers */
export const HELPER_KEYS: (keyof ShwActorSystem['helpers'])[] = [
  'totalHealth',
  'totalImpulse',
  'totalSpeed',
  'totalFortune',
  'totalForce',
  'totalFinesse',
  'totalWill',
  'totalPresence',
  'totalActions',
  'totalBonusActions',
  'totalReactions',
  'totalInitiative',
] as const;
