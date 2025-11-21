import { ItemFactory, getConsumableImage } from '../../../documents/Item/ItemFactory';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { ConsumableType } from '../../../documents/Item/types/ConsumableDataTypes';

export const getUpdateConsumable = (item: ShwItem) =>
  async function updateConsumable(path: string, value: any, e?: Event) {
    e?.stopPropagation();

    if (path === 'consumableType') {
      const consumable = ItemFactory.createConsumable(value as ConsumableType, {
        name: item.name,
      });
      const img = getConsumableImage(value as ConsumableType);

      await item.update({
        system: consumable,
        img: img,
      });
      return;
    }

    await item.update({
      // сохраняем текущие данные, чтобы не потерять вложенные поля
      system: item.system,
      [`system.${path}`]: value,
    });
  };
