import type { ActivationType, ConsumableType, PerType, RarityType, SelectOption } from './types';

// Note: labels are i18n keys - translate with $_() in components
export const ACTIVATION_TYPES: SelectOption<ActivationType>[] = [
  { value: 'action', label: 'consumable.activationType.action' },
  { value: 'bonus', label: 'consumable.activationType.bonus' },
  { value: 'reaction', label: 'consumable.activationType.reaction' },
];

export const PER_TYPES: SelectOption<PerType>[] = [
  { value: 'charges', label: 'consumable.perType.charges' },
  { value: 'uses', label: 'consumable.perType.uses' },
  { value: 'turns', label: 'consumable.perType.turns' },
];

export const RARITY_TYPES: SelectOption<RarityType>[] = [
  { value: 'common', label: 'consumable.rarityType.common' },
  { value: 'uncommon', label: 'consumable.rarityType.uncommon' },
  { value: 'rare', label: 'consumable.rarityType.rare' },
  { value: 'legendary', label: 'consumable.rarityType.legendary' },
];

export const CONSUMABLE_TYPES: SelectOption<ConsumableType>[] = [
  { value: 'potion', label: 'consumable.consumableType.potion' },
  { value: 'bomb', label: 'consumable.consumableType.bomb' },
  { value: 'scroll', label: 'consumable.consumableType.scroll' },
  { value: 'food', label: 'consumable.consumableType.food' },
  { value: 'poison', label: 'consumable.consumableType.poison' },
];

export const DAMAGE_TYPES: SelectOption[] = [
  { value: 'fire', label: 'consumable.damageType.fire' },
  { value: 'cold', label: 'consumable.damageType.cold' },
  { value: 'lightning', label: 'consumable.damageType.lightning' },
  { value: 'acid', label: 'consumable.damageType.acid' },
  { value: 'poison', label: 'consumable.damageType.poison' },
  { value: 'physical', label: 'consumable.damageType.physical' },
  { value: 'force', label: 'consumable.damageType.force' },
];

export const SAVE_TYPES: SelectOption[] = [
  { value: 'force', label: 'consumable.saveType.force' },
  { value: 'perception', label: 'consumable.saveType.perception' },
  { value: 'psyDefence', label: 'consumable.saveType.psyDefence' },
  { value: 'fortune', label: 'consumable.saveType.fortune' },
  { value: 'diplomacy', label: 'consumable.saveType.diplomacy' },
];

export const APPLICATION_TYPES: SelectOption[] = [
  { value: 'injury', label: 'consumable.applicationType.injury' },
  { value: 'contact', label: 'consumable.applicationType.contact' },
  { value: 'ingested', label: 'consumable.applicationType.ingested' },
  { value: 'inhaled', label: 'consumable.applicationType.inhaled' },
];

export const EFFECT_TYPES: SelectOption[] = [
  { value: 'heal', label: 'consumable.effectType.heal' },
  { value: 'buff', label: 'consumable.effectType.buff' },
  { value: 'damage', label: 'consumable.effectType.damage' },
];
