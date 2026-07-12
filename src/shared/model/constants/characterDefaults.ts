import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { ADDITIONAL_ATTRIBUTE_LABELS } from './attributes';

/** Набор статов, которые редактируются через additionalAttributes */
export const EDITABLE_STATS = new Set([
  'actions',
  'bonusActions',
  'reactions',
  'initiative',
  'impulse',
] as const);

/** i18n-ключи для названий атрибутов (используются в чат-сообщениях) */
export const STAT_NAME_KEYS = {
  fortune: 'attributes.fortune',
  force: 'attributes.force',
  finesse: 'attributes.finesse',
  will: 'attributes.will',
  presence: 'attributes.presence',
  natural: 'attributes.natural',
} as const;

/** Базовое макс. HP персонажа — только derived, не в JSON. */
export const HEALTH_BASE = 20;

/** Игровая база combat-статов — только derived, не в JSON. */
export const ADDITIONAL_STAT_BASE = {
  actions: 2,
  bonusActions: 1,
  reactions: 1,
  impulse: 0,
  initiative: 0,
  barrier: 0,
  psiDefense: 0,
  damageReduction: 0,
} as const;

export type AdditionalStatBaseKey = keyof typeof ADDITIONAL_STAT_BASE;

/** Все ключи additionalAttributes (для breakdown / totals). */
export const ALL_ADDITIONAL_KEYS = Object.keys(
  ADDITIONAL_ATTRIBUTE_LABELS,
) as (keyof ShwActorSystem['additionalAttributes'])[];

/** Ключи additionalAttributes, для которых применяется ADDITIONAL_STAT_BASE. */
export const ADDITIONAL_STAT_KEYS = Object.keys(
  ADDITIONAL_STAT_BASE,
) as AdditionalStatBaseKey[];

export function additionalTotal(
  key: AdditionalStatBaseKey,
  manual: number,
  progressionBonus: number,
): number {
  return ADDITIONAL_STAT_BASE[key] + manual + progressionBonus;
}

/** Init persisted-полей (TypeDataModel schema initial). Ручной бонус по умолчанию 0. */
export const CHAR_DEFAULTS = {
  utility: {
    speed: 20,
    level: 1,
  },

  additionalAttributes: {
    actions: 0,
    bonusActions: 0,
    reactions: 0,
    impulse: 0,
    initiative: 0,
    barrier: 0,
    psiDefense: 0,
    range: 0,
    damageReduction: 0,
    armorClass: 0,
  } satisfies ShwActorSystem['additionalAttributes'],

  totals: {
    fortune: 0,
    force: 0,
    finesse: 0,
    will: 0,
    presence: 0,
    actions: 0,
    bonusActions: 0,
    reactions: 0,
    impulse: 0,
    initiative: 0,
    barrier: 0,
    psiDefense: 0,
    damageReduction: 0,
    health: 0,
    healthCoefficient: 0,
    speed: 0,
    range: 0,
    armorClass: 0,
  } satisfies ShwActorSystem['totals'],
} as const;
