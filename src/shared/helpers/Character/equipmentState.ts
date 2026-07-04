import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { EquipmentSystem } from '../../../documents/Item/types/EquipmentDataTypes';

export function isItemEquipped(item: ShwItem): boolean {
  if (!item.isEquipment()) return false;
  return Boolean((item.system as EquipmentSystem).equipped);
}

export async function setItemEquipped(item: ShwItem, equipped: boolean): Promise<void> {
  if (!item.isEquipment()) return;
  await item.update({ 'system.equipped': equipped });
}

export async function equipItem(item: ShwItem): Promise<void> {
  await setItemEquipped(item, true);
}

export async function unequipItem(item: ShwItem): Promise<void> {
  await setItemEquipped(item, false);
}
