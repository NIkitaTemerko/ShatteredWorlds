import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import { getEquipmentLinkedAbilities } from './getEquipmentLinkedAbilities';

/** Способности персонажа: свои + привязанные к экипировке (дубли по id скрываются). */
export function getCharacterAbilityPool(actor: ShwActor<'character'>): ShwItem[] {
  const owned = Array.from(actor.items).filter((item) => item.type === 'ability');
  const linked = getEquipmentLinkedAbilities(actor);
  const seenIds = new Set<string>();
  const merged: ShwItem[] = [];

  for (const item of [...owned, ...linked]) {
    const id = item.id ?? item._id;
    if (!id || seenIds.has(id)) continue;

    seenIds.add(id);
    merged.push(item);
  }

  return merged;
}
