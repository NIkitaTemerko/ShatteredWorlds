import foundryIconsList from '../../../shared/data/foundryIcons.json';

// Категории иконок по типам предметов
const ICON_CATEGORIES: Record<string, string[]> = {
  potion: ['icons/consumables/potions/'],
  bomb: ['icons/weapons/thrown/bomb'],
  scroll: ['icons/sundries/scrolls/'],
  food: ['icons/consumables/food/'],
  poison: ['icons/consumables/potions/', 'icons/consumables/poison/'],
  ability: ['icons/skills/'],
  spell: ['icons/magic/'],
};

/**
 * Фильтрует иконки по типу предмета
 */
export function getIconsForType(type: string, consumableType?: string): string[] {
  const category = consumableType || type;
  const prefixes = ICON_CATEGORIES[category] || [];
  if (prefixes.length === 0) return [];

  return (foundryIconsList as string[]).filter((icon) =>
    prefixes.some((prefix) => icon.startsWith(prefix)),
  );
}
