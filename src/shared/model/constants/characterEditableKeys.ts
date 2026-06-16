import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';

/** Поля additionalAttributes, редактируемые вручную на листе персонажа. */
export const CHARACTER_EDITABLE_KEYS = new Set<keyof ShwActorSystem['additionalAttributes']>([
  'actions',
  'bonusActions',
  'reactions',
  'impulse',
  'initiative',
]);
