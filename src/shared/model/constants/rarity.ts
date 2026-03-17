import type { RarityType } from '../../../entities/consumable/model';

export const RARITY_COLORS: Record<RarityType, { dark: string; light: string }> = {
  common: { dark: '#9CA3AF', light: '#F3F4F6' },
  uncommon: { dark: '#10B981', light: '#D1FAE5' },
  rare: { dark: '#3B82F6', light: '#DBEAFE' },
  epic: { dark: '#A855F7', light: '#F3E8FF' },
  legendary: { dark: '#F97316', light: '#FFEDD5' },
};
