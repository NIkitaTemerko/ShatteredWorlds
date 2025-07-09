import { ItemFactory } from './ItemFactory';
import type { ConsumableData, ConsumableType } from './types/ConsumableDataTypes';

interface ShwItemSystem {
   consumable: ConsumableData;
}

export class ShwItem extends Item {
   declare system: ShwItemSystem;
   declare type: 'consumable';
   declare name: string;
   declare img: string;
   declare update: (
      data?: object,
      operation?: Partial<Omit<foundry.abstract.types.DatabaseUpdateOperation, 'updates'>>,
   ) => Promise<undefined | foundry.abstract.Document<object, any>>;

   private prepareConsumable() {
      if (!this.system.consumable && this.type === 'consumable') {
         const item = ItemFactory.createConsumable('bomb', {
            name: this.name,
         });
         this.system.consumable = item;
         this.img = item.img;
      }
   }

   private async useConsumable() {
      const consumable = this.system.consumable;

      if (consumable.quantity <= 0) {
         ui.notifications?.warn(`${this.name} больше нельзя использовать`);
         return false;
      }

      switch (consumable.consumableType) {
         case 'potion':
            await this.usePotion();
            break;
         case 'bomb':
            await this.useBomb();
            break;
      }

      await this.update({
         'system.consumable.uses.value': Math.max(0, consumable.quantity - 1),
      });

      return true;
   }

   private async usePotion() {
      const potion = this.system.consumable;
      if (potion.consumableType !== 'potion') return;

      for (const effect of potion.effects) {
         console.log(`Применяем эффект ${effect.type} с силой ${effect.amount}`);
      }
   }

   private async useBomb() {
      const bomb = this.system.consumable;
      if (bomb.consumableType !== 'bomb') return;

      console.log(
         `Взрыв наносит ${bomb.damage.amount} урона ${bomb.damage.type} типа в радиусе ${bomb.radius} футов`,
      );
   }

   prepareBaseData() {
      if (this.type === 'consumable') {
         this.prepareConsumable();
      }
   }

   async use() {
      if (this.type === 'consumable') {
         return this.useConsumable();
      }
   }
}
