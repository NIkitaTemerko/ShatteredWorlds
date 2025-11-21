import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { AbilityCategory } from '../../../documents/Item/types/AbilityDataTypes';
import { t } from '../../../shared/i18n';
import type { FlatItem } from '../../../shared/ui/tree';
import { ABILITY_CATEGORY_COLORS } from './constants';

// Ability category translation keys
const abilityCategoryKeys: Record<AbilityCategory, string> = {
  active: 'ability.category.active',
  passive: 'ability.category.passive',
};

/**
 * Maps ability items to flat tree structure with hierarchical paths
 * Path structure: [Category (Active/Passive), AbilityName]
 */
export function mapAbilitiesToFlatItems(items: ShwItem[]): FlatItem[] {
  // Filter only ability items
  const abilityItems = items.filter((item) => item.type === 'ability');

  return abilityItems.map((item) => {
    const abilitySystem = item.system as unknown as { category?: AbilityCategory };
    const category: AbilityCategory = abilitySystem.category ?? 'active';

    const path: string[] = [t(abilityCategoryKeys[category]), item.name];

    return {
      id: (item.id ?? item._id) || '',
      label: item.name,
      path,
      color: ABILITY_CATEGORY_COLORS[category],
      data: item,
    };
  });
}

/**
 * Converts Foundry ShwItem collection to ShwItem array (abilities only)
 */
export function collectionToAbilityItems(
  items: Collection<import('../../../documents/Item/ShwItem').ShwItem>,
): ShwItem[] {
  return Array.from(items).filter((item) => item.type === 'ability');
}
