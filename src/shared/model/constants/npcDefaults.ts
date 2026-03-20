import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';

/** Ключи helpers, используемые для NPC */
export const NPC_HELPER_KEYS = [
  'totalImpulse',
  'totalHealth',
  'totalSpeed',
  'totalDamageReduction',
  'totalArmorClass',
  'totalRange',
] as const;

/** Значения по-умолчанию для инициализации базовых данных NPC */
export const NPC_DEFAULTS = {
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
    totalImpulse: 0,
    totalHealth: 0,
    totalSpeed: 0,
    totalDamageReduction: 0,
    totalArmorClass: 0,
    totalRange: 0,
  } satisfies Record<(typeof NPC_HELPER_KEYS)[number], number>,
} as const;
