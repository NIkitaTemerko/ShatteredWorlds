import { getEquipmentImage, ItemFactory } from '../../../documents/Item/ItemFactory';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { EquipmentSlot } from '../../../documents/Item/types/EquipmentDataTypes';

export const getUpdateEquipment = (item: ShwItem) =>
  async function updateEquipment(path: string, value: any, e?: Event) {
    e?.stopPropagation();

    if (path === 'slot') {
      const equipment = ItemFactory.createEquipment(value as EquipmentSlot, {
        name: item.name,
      });
      const img = getEquipmentImage(value as EquipmentSlot);

      await item.update({
        system: equipment,
        img: img,
      });
      return;
    }

    await item.update({
      system: item.system,
      [`system.${path}`]: value,
    });
  };
