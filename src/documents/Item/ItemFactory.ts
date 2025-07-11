import type { ConsumableData, ConsumableType } from './types/ConsumableDataTypes';
import type { BaseItemData } from './types/ItemDataInterface';

// biome-ignore lint/complexity/noStaticOnlyClass: смысла 0
export class ItemFactory {
   static createConsumable(type: ConsumableType, baseData: Partial<BaseItemData>): ConsumableData {
      const base: BaseItemData = {
         name: '',
         description: '',
         stackLimit: 1,
         price: 0,
         weight: 0,
         quantity: 1,
         rarity: 'common',
         img: 'icons/svg/item-bag.svg',
         ...baseData,
      };

      const baseConsumable = {
         ...base,
         type: 'consumable' as const,
         uses: {
            value: 1,
            max: 1,
            per: 'charges' as const,
         },
         activation: {
            type: 'action' as const,
            cost: 1,
         },
      };

      switch (type) {
         case 'potion':
            return {
               ...baseConsumable,
               img: 'icons/consumables/potions/bottle-bulb-corked-glowing-red.webp',
               consumableType: 'potion',
               effects: [],
            };

         case 'bomb':
            return {
               ...baseConsumable,
               img: 'icons/weapons/thrown/bomb-fuse-black-grey.webp',
               consumableType: 'bomb',
               damage: {
                  amount: 50,
                  type: 'fire',
               },
               radius: 5,
               save: {
                  type: 'perception',
                  dc: 13,
               },
            };

         case 'scroll':
            return {
               ...baseConsumable,
               img: 'icons/sundries/scrolls/scroll-bound-blue-brown.webp',
               consumableType: 'scroll',
               spell: {
                  name: '',
                  level: 1,
                  school: '',
               },
               requirements: {
                  ability: '',
                  dc: 10,
               },
            };

         case 'food':
            return {
               ...baseConsumable,
               img: 'icons/consumables/grains/bread-loaf-sliced-wheat-brown.webp',
               consumableType: 'food',
               nutrition: {
                  value: 1,
                  duration: 24,
               },
               effects: [],
            };

         case 'poison':
            return {
               ...baseConsumable,
               img: 'icons/consumables/potions/potion-jar-corked-labeled-poison-skull-green.webp',
               consumableType: 'poison',
               damage: {
                  initial: '1d4',
                  recurring: '1d4',
                  duration: 3,
               },
               save: {
                  type: 'psyDefence',
                  dc: 13,
               },
               application: 'injury',
            };
      }
   }
}
