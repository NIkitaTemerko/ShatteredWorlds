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
  'barrier',
  'psiDefense',
  'range',
  'damageReduction',
  'armorClass',
  'massCategory',
] as const;

/** Ключи производных полей в totals (character) */
export const TOTAL_KEYS: (keyof ShwActorSystem['totals'])[] = [
  'health',
  'impulse',
  'speed',
  'fortune',
  'force',
  'finesse',
  'will',
  'presence',
  'actions',
  'bonusActions',
  'reactions',
  'initiative',
  'barrier',
  'psiDefense',
  'damageReduction',
  'massCategory',
] as const;

/** @deprecated Use TOTAL_KEYS */
export const HELPER_KEYS = TOTAL_KEYS;
