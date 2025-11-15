import type { ActivationType, ConsumableType, PerType, RarityType, SelectOption } from './types';

export const ACTIVATION_TYPES: SelectOption<ActivationType>[] = [
  { value: 'action', label: 'действие' },
  { value: 'bonus', label: 'бонус' },
  { value: 'reaction', label: 'реакция' },
];

export const PER_TYPES: SelectOption<PerType>[] = [
  { value: 'charges', label: 'заряды' },
  { value: 'uses', label: 'использования' },
  { value: 'turns', label: 'ходы' },
];

export const RARITY_TYPES: SelectOption<RarityType>[] = [
  { value: 'common', label: 'обычная' },
  { value: 'uncommon', label: 'необычная' },
  { value: 'rare', label: 'редкая' },
  { value: 'legendary', label: 'легендарная' },
];

export const CONSUMABLE_TYPES: SelectOption<ConsumableType>[] = [
  { value: 'potion', label: 'зелье' },
  { value: 'bomb', label: 'бомба' },
  { value: 'scroll', label: 'свиток' },
  { value: 'food', label: 'еда' },
  { value: 'poison', label: 'яд' },
];

export const DAMAGE_TYPES: SelectOption[] = [
  { value: 'fire', label: 'огонь' },
  { value: 'cold', label: 'холод' },
  { value: 'lightning', label: 'молния' },
  { value: 'acid', label: 'кислота' },
  { value: 'poison', label: 'яд' },
  { value: 'physical', label: 'физический' },
  { value: 'force', label: 'силовой' },
];

export const SAVE_TYPES: SelectOption[] = [
  { value: 'force', label: 'сила' },
  { value: 'perception', label: 'восприятие' },
  { value: 'psyDefence', label: 'психозащита' },
  { value: 'fortune', label: 'удача' },
  { value: 'diplomacy', label: 'дипломатия' },
];

export const APPLICATION_TYPES: SelectOption[] = [
  { value: 'injury', label: 'рана' },
  { value: 'contact', label: 'контакт' },
  { value: 'ingested', label: 'иньекция' },
  { value: 'inhaled', label: 'вдох' },
];

export const EFFECT_TYPES: SelectOption[] = [
  { value: 'heal', label: 'лечение' },
  { value: 'buff', label: 'баф' },
  { value: 'damage', label: 'урон' },
];
