import { getFoundryIconsCached } from '../../../shared/data/foundryIconsLoader';

/** Категории иконок по типам предметов */
const ICON_CATEGORIES: Record<string, string[]> = {
  potion: ['icons/consumables/potions/'],
  bomb: ['icons/weapons/thrown/bomb'],
  scroll: ['icons/sundries/scrolls/'],
  food: ['icons/consumables/food/'],
  poison: ['icons/consumables/potions/', 'icons/consumables/poison/'],
  ability: ['icons/skills/'],
  spell: ['icons/magic/'],
  equipment: ['icons/equipment/'],
};

/** Фильтрует иконки Foundry по типу предмета */
export function getIconsForType(type: string, consumableType?: string): string[] {
  const category = consumableType || type;
  const prefixes = ICON_CATEGORIES[category] || [];
  if (prefixes.length === 0) return [];

  return getFoundryIconsCached().filter((icon) =>
    prefixes.some((prefix) => icon.startsWith(prefix)),
  );
}
