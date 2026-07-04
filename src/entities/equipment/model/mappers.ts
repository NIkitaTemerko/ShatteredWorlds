import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { EquipmentSystem } from '../../../documents/Item/types/EquipmentDataTypes';
import { EQUIPMENT_SLOT_KEYS } from '../../../entities/inventory/model/constants';
import type { I18nKey } from '../../../shared/i18n';
import { t } from '../../../shared/i18n';
import { isItemEquipped } from '../../../shared/helpers/Character/equipmentState';
import { RARITY_COLORS } from '../../../shared/model/constants';
import type { FlatItem } from '../../../shared/ui/tree';

/**
 * Maps equipment items to flat tree structure grouped by slot.
 * Path structure: [Slot, ItemName]
 */
export function mapEquipmentToFlatItems(items: ShwItem[]): FlatItem[] {
  return items
    .filter((item) => item.type === 'equipment')
    .map((item) => {
      const system = item.system as EquipmentSystem;
      const slot = system.slot ?? 'body';
      const path: string[] = [t(EQUIPMENT_SLOT_KEYS[slot] as I18nKey), item.name];
      const rarity = system.rarity ?? 'common';

      return {
        id: (item.id ?? item._id) || '',
        label: item.name,
        path,
        color: RARITY_COLORS[rarity]?.dark,
        icon: item.img && item.img !== 'icons/svg/item-bag.svg' ? item.img : undefined,
        badge: {
          color: RARITY_COLORS[rarity]?.dark ?? RARITY_COLORS.common.dark,
          label: rarity,
        },
        data: item,
      };
    });
}

export function collectionToEquipmentItems(
  items: Collection<import('../../../documents/Item/ShwItem').ShwItem>,
): ShwItem[] {
  return Array.from(items).filter((item) => item.type === 'equipment' && isItemEquipped(item));
}
