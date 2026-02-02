import { getAbilityImage, getConsumableImage, getSpellImage, ItemFactory } from './ItemFactory';
import type { AbilitySystem } from './types/AbilityDataTypes';
import type { ConsumableData } from './types/ConsumableDataTypes';
import type { SpellSystem } from './types/SpellDataTypes';

// Flattened: system IS the item data directly (no nested structure)
type ShwItemSystem = ConsumableData | AbilitySystem | SpellSystem;

export class ShwItem extends Item {
  // @ts-expect-error
  declare system: ShwItemSystem;
  declare type: any;
  declare name: string;
  declare img: string;
  declare update: (
    data?: object,
    operation?: Partial<Omit<foundry.abstract.types.DatabaseUpdateOperation, 'updates'>>,
  ) => Promise<this | undefined>;

  // Type guards
  isConsumable(): this is { system: ConsumableData } {
    return this.type === 'consumable';
  }

  isAbility(): this is { system: AbilitySystem } {
    return this.type === 'ability';
  }

  isSpell(): this is { system: SpellSystem } {
    return this.type === 'spell';
  }

  private prepareConsumable() {
    if (this.isConsumable() && !this.system.consumableType) {
      const item = ItemFactory.createConsumable('bomb', {
        name: this.name,
      });
      // Flatten: assign item fields directly to system
      Object.assign(this.system, item);
      if (!this.img || this.img === 'icons/svg/item-bag.svg') {
        this.img = getConsumableImage('bomb');
      }
    }
  }

  private prepareAbility() {
    if (this.isAbility() && !this.system.kind) {
      const item = ItemFactory.createAbility('active', 'attack', {
        name: this.name,
      });
      Object.assign(this.system, item);
      if (!this.img || this.img === 'icons/svg/item-bag.svg') {
        this.img = getAbilityImage(this.system.category);
      }
    }
  }

  private prepareSpell() {
    if (this.isSpell() && !this.system.kind) {
      const item = ItemFactory.createSpell('arcane', 'attack', {
        name: this.name,
      });
      Object.assign(this.system, item);
      if (!this.img || this.img === 'icons/svg/item-bag.svg') {
        this.img = getSpellImage(this.system.category);
      }
    }
  }

  private async useConsumable() {
    if (!this.isConsumable()) return false;
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
    if (!this.isConsumable()) return;
    const potion = this.system;
    if (potion.consumableType !== 'potion') return;

    for (const effect of potion.effects) {
      console.log(`Применяем эффект ${effect.type} с силой ${effect.amount}`);
    }
  }

  private async useBomb() {
    if (!this.isConsumable()) return;
    const bomb = this.system;
    if (bomb.consumableType !== 'bomb') return;

    console.log(
      `Взрыв наносит ${bomb.damage.amount} урона ${bomb.damage.type} типа в радиусе ${bomb.radius} футов`,
    );
  }

  prepareBaseData() {
    if (this.type === 'consumable') {
      this.prepareConsumable();
    } else if (this.type === 'ability') {
      this.prepareAbility();
    } else if (this.type === 'spell') {
      this.prepareSpell();
    }
  }

  async use() {
    if (this.type === 'consumable') {
      return this.useConsumable();
    } else if (this.type === 'ability') {
      return this.useAbility();
    } else if (this.type === 'spell') {
      return this.useSpell();
    }
  }

  private async useAbility() {
    if (!this.isAbility()) return false;
    const ability = this.system;

    console.log(`Using ability: ${this.name} (${ability.category})`);

    // Проверка resource costs будет реализована позже
    if (ability.resourceCosts && ability.resourceCosts.length > 0) {
      console.log('Resource costs:', ability.resourceCosts);
    }

    return true;
  }

  private async useSpell() {
    if (!this.isSpell()) return false;
    const spell = this.system;

    console.log(`Using spell: ${this.name} (${spell.category})`);

    // Проверка resource costs будет реализована позже
    if (spell.resourceCosts && spell.resourceCosts.length > 0) {
      console.log('Resource costs:', spell.resourceCosts);
    }

    return true;
  }
}
