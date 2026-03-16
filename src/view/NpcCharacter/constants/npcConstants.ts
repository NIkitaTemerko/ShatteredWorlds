import type { AdditionalAttributes } from '../../../shared/model/types';

export const NPC_EDITABLE_KEYS = new Set<keyof AdditionalAttributes>([
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
]);
