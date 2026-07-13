import type { ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';

/** Ключи totals, используемые для NPC */
export const NPC_TOTAL_KEYS = [
  'impulse',
  'health',
  'speed',
  'damageReduction',
  'armorClass',
  'range',
] as const;

/** Init persisted-полей NPC */
export const NPC_DEFAULTS = {
  utility: {
    speed: 20,
    speedExtra: 0,
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
    massCategory: 0,
  } satisfies ShwNpcSystem['additionalAttributes'],

  totals: {
    impulse: 0,
    health: 0,
    speed: 0,
    damageReduction: 0,
    armorClass: 0,
    range: 0,
  } satisfies Pick<ShwNpcSystem['totals'], (typeof NPC_TOTAL_KEYS)[number]>,
} as const;
