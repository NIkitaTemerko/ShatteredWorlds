import { ItemFactory, getConsumableImage } from './ItemFactory';
import type { ConsumableData } from './types/ConsumableDataTypes';

// Flattened: system IS the consumable data directly (no nested .consumable)
type ShwItemSystem = ConsumableData;

export class ShwItem extends Item {
  // @ts-ignore
  declare system: ShwItemSystem;
  declare type: any;
  declare name: string;
  declare img: string;
  declare update: (
    data?: object,
    operation?: Partial<Omit<foundry.abstract.types.DatabaseUpdateOperation, 'updates'>>,
  ) => Promise<this | undefined>;


  private prepareConsumable() {
    if (!this.system.consumableType && this.type === 'consumable') {
      const item = ItemFactory.createConsumable('bomb', {
        name: this.name,
      });
      // Flatten: assign item fields directly to system
      Object.assign(this.system, item);
      this.img = getConsumableImage('bomb');
    }
  }

  private async useConsumable() {
    const consumable = this.system;

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
      'system.uses.value': Math.max(0, consumable.quantity - 1),
    });

    return true;
  }

  private async usePotion() {
    const potion = this.system;
    if (potion.consumableType !== 'potion') return;

    for (const effect of potion.effects) {
      console.log(`Применяем эффект ${effect.type} с силой ${effect.amount}`);
    }
  }

  private async useBomb() {
    const bomb = this.system;
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
