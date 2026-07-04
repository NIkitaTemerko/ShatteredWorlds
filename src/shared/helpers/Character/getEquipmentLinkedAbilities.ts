import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { EquipmentSystem } from '../../../documents/Item/types/EquipmentDataTypes';
import { getEquippedItems } from './getEquippedItems';

/** Способности, привязанные к надетой экипировке (без дублей по id). */
export function getEquipmentLinkedAbilities(actor: ShwActor<'character'>): ShwItem[] {
  const seenIds = new Set<string>();
  const abilities: ShwItem[] = [];

  for (const equipment of getEquippedItems(actor)) {
    const linkedIds = (equipment.system as EquipmentSystem).linkedItemIds ?? [];

    for (const id of linkedIds) {
      if (seenIds.has(id)) continue;

      const item = game.items?.get(id) as ShwItem | undefined;
      if (!item || item.type !== 'ability') continue;

      seenIds.add(id);
      abilities.push(item);
    }
  }

  return abilities;
}
