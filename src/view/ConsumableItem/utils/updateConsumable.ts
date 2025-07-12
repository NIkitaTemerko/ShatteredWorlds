import { ItemFactory } from '../../../documents/Item/ItemFactory';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { ConsumableType } from '../../../documents/Item/types/ConsumableDataTypes';

export const getUpdateConsumable = (item: ShwItem) =>
   async function updateConsumable(path: string, value: any, e?: Event) {
      e?.stopPropagation();

      if (path === 'consumableType') {
         const consumable = ItemFactory.createConsumable(value as ConsumableType, {
            name: item.name,
         });

         await item.update({
            'system.consumable': consumable,
            img: consumable.img,
            type: item.type,
            name: item.name,
         });
         return;
      }

      await item.update({
         // сохраняем текущие данные, чтобы не потерять вложенные поля
         'system.consumable': item.system.consumable,
         [`system.consumable.${path}`]: value,
      });
   };
