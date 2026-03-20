import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';

/** Ключи основных атрибутов персонажа */
export const STAT_KEYS: (keyof ShwActorSystem['attributes'])[] = [
  'fortune',
  'force',
  'perception',
  'psyDefence',
  'diplomacy',
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
  'totalPerception',
  'totalPsyDefence',
  'totalDiplomacy',
  'totalActions',
  'totalBonusActions',
  'totalReactions',
  'totalInitiative',
] as const;

/** Порог атрибута для получения бонуса импульса */
export const ATTR_RIM = 15;

/** Порог атрибута для получения бонуса дальности */
export const ATTR_MAX_RIM = 25;
