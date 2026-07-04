import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import { isItemEquipped } from './equipmentState';

/** Предметы экипировки на акторе с флагом equipped. */
export function getEquippedItems(actor: ShwActor<'character'>): ShwItem[] {
  return Array.from(actor.items).filter((item) => item.type === 'equipment' && isItemEquipped(item));
}
