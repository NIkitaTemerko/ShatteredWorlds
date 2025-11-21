import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { ConsumableType } from '../../../documents/Item/types/ConsumableDataTypes';
import type { ItemType } from '../../../documents/Item/types/ItemDataInterface';
import { t } from '../../../shared/i18n';
import type { FlatItem } from '../../../shared/ui/tree';

// Rarity colors for visual distinction (matching consumables)
const rarityColors: Record<string, string> = {
  common: '#9CA3AF',
  uncommon: '#10B981',
  rare: '#3B82F6',
  legendary: '#F97316',
};

// Item type category translation keys
const itemTypeKeys: Record<ItemType, string> = {
  consumable: 'inventory.categories.consumable',
  ability: 'inventory.categories.ability',
  weapon: 'inventory.categories.weapon',
  armor: 'inventory.categories.armor',
  equipment: 'inventory.categories.equipment',
  treasure: 'inventory.categories.treasure',
};

// Consumable type subcategory translation keys
const consumableTypeKeys: Record<ConsumableType, string> = {
  potion: 'inventory.consumableTypes.potion',
  bomb: 'inventory.consumableTypes.bomb',
  scroll: 'inventory.consumableTypes.scroll',
  food: 'inventory.consumableTypes.food',
  poison: 'inventory.consumableTypes.poison',
};

/**
 * Maps inventory items to flat tree structure with hierarchical paths
 * Path structure: [ItemType, Subcategory?, ItemName]
 * Excludes ability items (they have their own tab)
 */
export function mapInventoryToFlatItems(items: ShwItem[]): FlatItem[] {
  return items
    .filter((item) => item.type !== 'ability')
    .map((item) => {
      const itemType = item.type as ItemType;
      const path: string[] = [t(itemTypeKeys[itemType])];

      // Add subcategory for consumables
      if (item.type === 'consumable' && 'consumableType' in item.system) {
        path.push(t(consumableTypeKeys[item.system.consumableType]));
      }

      // Add item name with quantity (only for stackable items)
      let quantity = 1;
      if (item.type === 'consumable' && 'quantity' in item.system) {
        quantity = item.system.quantity ?? 1;
      }
      const label = quantity > 1 ? `${item.name} (×${quantity})` : item.name;
      path.push(label);

      // Get rarity from system data
      const rarity = item.system?.rarity ?? 'common';

      return {
        id: (item.id ?? item._id) || '',
        label,
        path,
        color: rarityColors[rarity],
        data: item,
      };
    });
}

/**
 * Converts Foundry ShwItem collection to ShwItem array
 */
export function collectionToInventoryItems(
  items: Collection<import('../../../documents/Item/ShwItem').ShwItem>,
): ShwItem[] {
  return Array.from(items);
}
