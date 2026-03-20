import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';

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
  perception: 'attributes.perception',
  psyDefence: 'attributes.psyDefence',
  diplomacy: 'attributes.diplomacy',
  natural: 'attributes.natural',
} as const;

/** Значения по-умолчанию для инициализации базовых данных персонажа */
export const CHAR_DEFAULTS = {
  utility: {
    actions: 2,
    reactions: 0,
    bonusActions: 1,
    impulses: 0,
    speed: 20,
    level: 1,
    initiative: 0,
  },

  additionalAttributes: {
    actions: 2,
    bonusActions: 1,
    reactions: 0,
    impulse: 0,
    initiative: 0,
    range: 0,
    damageReduction: 0,
    armorClass: 0,
    additionalCloseCombatDamage: 0,
    additionalRangeDamage: 0,
  } satisfies ShwActorSystem['additionalAttributes'],

  helpers: {
    totalHealth: 0,
    totalImpulse: 0,
    totalSpeed: 0,
    totalFortune: 0,
    totalForce: 0,
    totalPerception: 0,
    totalPsyDefence: 0,
    totalDiplomacy: 0,
    totalActions: 0,
    totalBonusActions: 0,
    totalReactions: 0,
    totalInitiative: 0,
  },
} as const;
