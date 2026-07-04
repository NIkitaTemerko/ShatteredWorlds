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

      const item =
        (game.items?.get(id) as ShwItem | undefined) ??
        (actor.items.get(id) as ShwItem | undefined);

      if (!item || item.type !== 'ability') continue;

      seenIds.add(id);
      abilities.push(item);
    }
  }

  return abilities;
}

/** ability id → названия надетой экипировки, к которой привязана способность */
export function getEquipmentLinkedAbilitySources(
  actor: ShwActor<'character'>,
): Map<string, string[]> {
  const sources = new Map<string, string[]>();

  for (const equipment of getEquippedItems(actor)) {
    const linkedIds = (equipment.system as EquipmentSystem).linkedItemIds ?? [];

    for (const id of linkedIds) {
      if (!id) continue;

      const existing = sources.get(id);
      if (existing) {
        if (!existing.includes(equipment.name)) {
          existing.push(equipment.name);
        }
        continue;
      }

      sources.set(id, [equipment.name]);
    }
  }

  return sources;
}

export function getEquipmentLinkedAbilityIds(actor: ShwActor<'character'>): Set<string> {
  return new Set(getEquipmentLinkedAbilitySources(actor).keys());
}
