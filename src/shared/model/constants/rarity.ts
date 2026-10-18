import type { RarityType } from '../../../entities/consumable/model';

/** Crystal accent pairs for StatsCard `--dark` / `--light`. */
export const RARITY_COLORS: Record<RarityType, { dark: string; light: string }> = {
  common: { dark: '#6e6488', light: 'rgb(74 66 92 / 35%)' },
  uncommon: { dark: '#2a9b8f', light: 'rgb(42 155 143 / 28%)' },
  rare: { dark: '#8b4fc9', light: 'rgb(139 79 201 / 28%)' },
  epic: { dark: '#b57aef', light: 'rgb(181 122 239 / 28%)' },
  legendary: { dark: '#c4922a', light: 'rgb(196 146 42 / 28%)' },
};
