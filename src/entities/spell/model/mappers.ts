import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { SpellCategory, SpellSystem } from '../../../documents/Item/types/SpellDataTypes';
import { t } from '../../../shared/i18n';
import type { FlatItem } from '../../../shared/ui/tree';
import { SPELL_CATEGORY_COLORS } from './constants';

/** Узел дерева - категория заклинаний */
export interface SpellCategoryNode {
  category: SpellCategory;
  spells: ShwItem[];
}

// Spell category translation keys
const spellCategoryKeys = {
  code: 'spell.category.code',
  elemental: 'spell.category.elemental',
  dark: 'spell.category.dark',
  holy: 'spell.category.holy',
  arcane: 'spell.category.arcane',
} as const;

/** Преобразует список заклинаний в дерево по категориям */
export function mapSpellsToTree(spells: ShwItem[]): SpellCategoryNode[] {
  const categories: SpellCategory[] = ['code', 'elemental', 'dark', 'holy', 'arcane'];

  return categories.map((category) => ({
    category,
    spells: spells.filter((spell) => {
      if (!spell.isSpell()) return false;
      return (spell.system as SpellSystem).category === category;
    }),
  }));
}

/**
 * Maps spell items to flat tree structure with hierarchical paths
 * Path structure: [Category, SpellName]
 */
export function mapSpellsToFlatItems(items: ShwItem[]): FlatItem[] {
  // Filter only spell items
  const spellItems = items.filter((item) => item.type === 'spell');

  return spellItems.map((item) => {
    const spellSystem = item.system as unknown as { category?: SpellCategory };
    const category: SpellCategory = spellSystem.category ?? 'arcane';

    const path: string[] = [t(spellCategoryKeys[category]), item.name];

    return {
      id: (item.id ?? item._id) || '',
      label: item.name,
      path,
      color: SPELL_CATEGORY_COLORS[category],
      data: item,
    };
  });
}

/**
 * Converts Foundry ShwItem collection to ShwItem array (spells only)
 */
export function collectionToSpellItems(
  items: Collection<import('../../../documents/Item/ShwItem').ShwItem>,
): ShwItem[] {
  return Array.from(items).filter((item) => item.type === 'spell');
}
