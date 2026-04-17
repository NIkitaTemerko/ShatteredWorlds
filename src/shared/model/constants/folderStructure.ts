/**
 * Структура автопапок: тип предмета → i18n-ключ корневой папки,
 * подтипы → i18n-ключи подпапок, поле system для определения подтипа.
 */
export interface FolderDefinition {
  rootKey: string;
  subtypeField?: string;
  subfolders?: Record<string, string>;
}

export const FOLDER_STRUCTURE: Record<string, FolderDefinition> = {
  consumable: {
    rootKey: 'SHW.inventory.categories.consumable',
    subtypeField: 'consumableType',
    subfolders: {
      potion: 'SHW.inventory.consumableTypes.potion',
      bomb: 'SHW.inventory.consumableTypes.bomb',
      scroll: 'SHW.inventory.consumableTypes.scroll',
      food: 'SHW.inventory.consumableTypes.food',
      poison: 'SHW.inventory.consumableTypes.poison',
    },
  },
  equipment: {
    rootKey: 'SHW.inventory.categories.equipment',
    subtypeField: 'slot',
    subfolders: {
      head: 'SHW.equipment.slot.head',
      cloak: 'SHW.equipment.slot.cloak',
      amulet: 'SHW.equipment.slot.amulet',
      hands: 'SHW.equipment.slot.hands',
      body: 'SHW.equipment.slot.body',
      belt: 'SHW.equipment.slot.belt',
      'one-hand': 'SHW.equipment.slot.oneHand',
      'two-hand': 'SHW.equipment.slot.twoHand',
      boots: 'SHW.equipment.slot.boots',
      ring: 'SHW.equipment.slot.ring',
    },
  },
  ability: {
    rootKey: 'SHW.inventory.categories.ability',
    subtypeField: 'category',
    subfolders: {
      active: 'SHW.ability.category.active',
      passive: 'SHW.ability.category.passive',
    },
  },
  spell: {
    rootKey: 'SHW.tabs.spells',
    subtypeField: 'category',
    subfolders: {
      code: 'SHW.spell.category.code',
      elemental: 'SHW.spell.category.elemental',
      dark: 'SHW.spell.category.dark',
      holy: 'SHW.spell.category.holy',
      arcane: 'SHW.spell.category.arcane',
    },
  },
  resource: {
    rootKey: 'SHW.inventory.categories.resource',
    subtypeField: 'category',
    subfolders: {
      raw: 'SHW.resource.category.raw',
      refined: 'SHW.resource.category.refined',
      magical: 'SHW.resource.category.magical',
      organic: 'SHW.resource.category.organic',
      special: 'SHW.resource.category.special',
    },
  },
};
