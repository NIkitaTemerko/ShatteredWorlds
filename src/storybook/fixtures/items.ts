import { ItemFactory } from '../../documents/Item/ItemFactory';
import { STORY_PLACEHOLDER_IMG } from './placeholderImg';

function withTypeGuards<T extends { type: string }>(item: T) {
  return {
    ...item,
    isConsumable() {
      return item.type === 'consumable';
    },
    isAbility() {
      return item.type === 'ability';
    },
    isSpell() {
      return item.type === 'spell';
    },
    isEquipment() {
      return item.type === 'equipment';
    },
    isResource() {
      return item.type === 'resource';
    },
  };
}

export function createAbilityItemFixture(options?: { name?: string; category?: 'active' | 'passive' }) {
  const category = options?.category ?? 'active';
  const system =
    category === 'active'
      ? ItemFactory.createAbility('active', 'attack', {
          name: options?.name ?? 'Удар искры',
          description: 'Быстрая атака ближнего боя.',
        })
      : ItemFactory.createAbility('passive', 'stat-bonus', {
          name: options?.name ?? 'Каменная кожа',
          description: 'Пассивный бонус к характеристикам.',
        });

  return withTypeGuards({
    id: 'story-ability-1',
    _id: 'story-ability-1',
    name: system.name,
    img: STORY_PLACEHOLDER_IMG,
    type: 'ability' as const,
    system,
  });
}

export function createSpellItemFixture(options?: {
  id?: string;
  name?: string;
  category?: 'code' | 'elemental' | 'dark' | 'holy' | 'arcane';
}) {
  const system = ItemFactory.createSpell(options?.category ?? 'elemental', 'attack', {
    name: options?.name ?? 'Spark',
    description: 'Вспышка стихийной энергии.',
  });
  const id = options?.id ?? 'story-spell-1';

  return withTypeGuards({
    id,
    _id: id,
    name: system.name,
    img: STORY_PLACEHOLDER_IMG,
    type: 'spell' as const,
    system,
  });
}

export function createEquipmentItemFixture(options?: { name?: string }) {
  const system = ItemFactory.createEquipment('body', {
    name: options?.name ?? 'Кольчуга путника',
    description: 'Лёгкая защита корпуса.',
  });
  system.armorClass = 2;
  system.equipped = false;
  system.statBonuses = {
    modifiers: [{ stat: 'attributes.force.value', mode: 'add', value: 1 }],
  };

  return withTypeGuards({
    id: 'story-equipment-1',
    _id: 'story-equipment-1',
    name: system.name,
    img: STORY_PLACEHOLDER_IMG,
    type: 'equipment' as const,
    system,
  });
}

export function createConsumableItemFixture(options?: { name?: string }) {
  const system = ItemFactory.createConsumable('bomb', {
    name: options?.name ?? 'Огненная бомба',
    description: 'Взрывается при броске.',
  });

  return withTypeGuards({
    id: 'story-consumable-1',
    _id: 'story-consumable-1',
    name: system.name,
    img: STORY_PLACEHOLDER_IMG,
    type: 'consumable' as const,
    system,
  });
}
