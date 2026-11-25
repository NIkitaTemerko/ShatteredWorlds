export const consumableTypes = [
  { value: 'potion', label: 'зелье' },
  { value: 'bomb', label: 'бомба' },
  { value: 'scroll', label: 'свиток' },
  { value: 'food', label: 'еда' },
  { value: 'poison', label: 'яд' },
];
export const rarityTypes = [
  { value: 'common', label: 'обычная' },
  { value: 'uncommon', label: 'необычная' },
  { value: 'rare', label: 'редкая' },
  { value: 'epic', label: 'эпическая' },
  { value: 'legendary', label: 'легендарная' },
];

export const saveTypes = [
  { value: 'force', label: 'сила' },
  { value: 'finesse', label: 'сноровка' },
  { value: 'will', label: 'воля' },
  { value: 'fortune', label: 'удача' },
  { value: 'presence', label: 'присутствие' },
];

/** Crystal triad accents for consumable type chrome. */
export const typeColors = {
  potion: { dark: '#2a9b8f', light: 'rgb(42 155 143 / 28%)' },
  bomb: { dark: '#c45a6a', light: 'rgb(196 90 106 / 28%)' },
  scroll: { dark: '#8b4fc9', light: 'rgb(139 79 201 / 28%)' },
  food: { dark: '#c4922a', light: 'rgb(196 146 42 / 28%)' },
  poison: { dark: '#6e6488', light: 'rgb(74 66 92 / 35%)' },
};

export const activationTypes = [
  { value: 'action', label: 'действие' },
  { value: 'bonus', label: 'бонус' },
  { value: 'reaction', label: 'реакция' },
];
export const perTypes = [
  { value: 'charges', label: 'заряды' },
  { value: 'day', label: 'день' },
  { value: 'combat', label: 'бой' },
];

export const applicationTypes = [
  { value: 'injury', label: 'рана' },
  { value: 'contact', label: 'контакт' },
  { value: 'ingested', label: 'иньекция' },
  { value: 'inhaled', label: 'вдох' },
];

export const effectTypes = [
  { value: 'heal', label: 'лечение' },
  { value: 'buff', label: 'баф' },
  { value: 'damage', label: 'урон' },
];
