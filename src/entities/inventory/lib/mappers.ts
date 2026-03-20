import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { ConsumableType } from '../../../documents/Item/types/ConsumableDataTypes';
import type { ItemType } from '../../../documents/Item/types/ItemDataInterface';
import type { I18nKey } from '../../../shared/i18n';
import { t } from '../../../shared/i18n';
import { RARITY_COLORS } from '../../../shared/model/constants';
import type { FlatItem } from '../../../shared/ui/tree';
import { EQUIPMENT_SLOT_KEYS } from '../model/constants';

// Ключи локализации для типов предметов
const itemTypeKeys: Record<ItemType, I18nKey> = {
  consumable: 'inventory.categories.consumable',
  ability: 'inventory.categories.ability',
  weapon: 'inventory.categories.weapon',
  equipment: 'inventory.categories.equipment',
  treasure: 'inventory.categories.treasure',
  spell: 'tabs.spells',
};

// Ключи локализации для типов расходников
const consumableTypeKeys: Record<ConsumableType, I18nKey> = {
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

      // Add subcategory for equipment by slot
      if (item.type === 'equipment' && 'slot' in item.system) {
        path.push(t(EQUIPMENT_SLOT_KEYS[item.system.slot] as I18nKey));
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
        color: RARITY_COLORS[rarity]?.dark,
        badge: {
          color: RARITY_COLORS[rarity]?.dark ?? RARITY_COLORS.common.dark,
          label: rarity,
        },
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
