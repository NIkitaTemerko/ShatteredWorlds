import type {
  AbilityCategory,
  AbilitySystem,
  ActiveAbilityKind,
  PassiveAbilityKind,
} from './types/AbilityDataTypes';
import type { ConsumableData, ConsumableType } from './types/ConsumableDataTypes';
import type { EquipmentSlot, EquipmentSystem } from './types/EquipmentDataTypes';
import type { BaseItemData } from './types/ItemDataInterface';
import type { ResourceCategory, ResourceData } from './types/ResourceDataTypes';
import type { SpellCategory, SpellKind, SpellSystem } from './types/SpellDataTypes';

/**
 * Get default image path for consumable type
 */
export function getConsumableImage(type: ConsumableType): string {
  switch (type) {
    case 'potion':
      return 'icons/consumables/potions/bottle-bulb-corked-glowing-red.webp';
    case 'bomb':
      return 'icons/weapons/thrown/bomb-fuse-black-grey.webp';
    case 'scroll':
      return 'icons/sundries/scrolls/scroll-bound-blue-brown.webp';
    case 'food':
      return 'icons/consumables/grains/bread-loaf-sliced-wheat-brown.webp';
    case 'poison':
      return 'icons/consumables/potions/potion-jar-corked-labeled-poison-skull-green.webp';
  }
}

/**
 * Get default image path for ability type
 */
export function getAbilityImage(category: AbilityCategory): string {
  switch (category) {
    case 'active':
      return 'icons/svg/dice-target.svg';
    case 'passive':
      return 'icons/svg/aura.svg';
  }
}

/**
 * Get default image path for spell category
 */
export function getSpellImage(category: SpellCategory): string {
  switch (category) {
    case 'code':
      return 'icons/svg/book.svg';
    case 'elemental':
      return 'icons/svg/fire.svg';
    case 'dark':
      return 'icons/svg/skull.svg';
    case 'holy':
      return 'icons/svg/angel.svg';
    case 'arcane':
      return 'icons/svg/portal.svg';
  }
}

/**
 * Дефолтные иконки для слотов снаряжения
 */
const EQUIPMENT_SLOT_IMAGES: Record<EquipmentSlot, string> = {
  head: 'icons/equipment/head/helm-barbute-brass-steel.webp',
  cloak: 'icons/equipment/back/cloak-collared-blue.webp',
  amulet: 'icons/equipment/neck/amulet-geometric-gold-green.webp',
  hands: 'icons/equipment/hand/gauntlet-armored-grey.webp',
  body: 'icons/equipment/chest/breastplate-banded-steel-grey.webp',
  belt: 'icons/equipment/waist/belt-buckle-gold.webp',
  'one-hand': 'icons/weapons/swords/sword-guard-steel-green.webp',
  'two-hand': 'icons/weapons/swords/greatsword-crossguard-steel.webp',
  boots: 'icons/equipment/feet/boots-armored-steel.webp',
  ring: 'icons/equipment/finger/ring-cabochon-bronze-green.webp',
};

export function getEquipmentImage(slot: EquipmentSlot): string {
  return EQUIPMENT_SLOT_IMAGES[slot];
}

/**
 * Дефолтные иконки для категорий ресурсов
 */
const RESOURCE_CATEGORY_IMAGES: Record<ResourceCategory, string> = {
  raw: 'icons/commodities/stone/ore-pile-grey.webp',
  refined: 'icons/commodities/metal/ingot-steel.webp',
  magical: 'icons/commodities/gems/gem-faceted-rough-purple.webp',
  organic: 'icons/commodities/bones/bones-stack-grey.webp',
  special: 'icons/commodities/stone/stone-nugget-gold.webp',
};

export function getResourceImage(category: ResourceCategory): string {
  return RESOURCE_CATEGORY_IMAGES[category];
}

// biome-ignore lint/complexity/noStaticOnlyClass: смысла 0
export class ItemFactory {
  static createConsumable(type: ConsumableType, baseData: Partial<BaseItemData>): ConsumableData {
    const base = {
      name: '',
      description: '',
      weight: 0,
      rarity: 'common' as const,
      stackLimit: 1,
      price: 0,
      quantity: 1,
      ...baseData,
    };

    const baseConsumable = {
      ...base,
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
          consumableType: 'potion',
          effects: [],
        };

      case 'bomb':
        return {
          ...baseConsumable,
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
          consumableType: 'poison',
          damage: {
            initial: 10,
            recurring: 10,
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

  static createAbility(
    category: 'active',
    kind: ActiveAbilityKind,
    baseData: Partial<BaseItemData>,
  ): AbilitySystem;
  static createAbility(
    category: 'passive',
    kind: PassiveAbilityKind,
    baseData: Partial<BaseItemData>,
  ): AbilitySystem;
  static createAbility(
    category: AbilityCategory,
    kind: ActiveAbilityKind | PassiveAbilityKind,
    baseData: Partial<BaseItemData>,
  ): AbilitySystem {
    const base = {
      name: '',
      description: '',
      weight: 0,
      rarity: 'common' as const,
      ...baseData,
    };

    const commonAbility = {
      ...base,
      kind: 'ability' as const,
      category,
      cooldown: null,
      resourceCosts: [],
      maxRank: 1,
      currentRank: 1,
    };

    if (category === 'active') {
      return {
        ...commonAbility,
        category: 'active',
        activeKind: kind as ActiveAbilityKind,
        actionType: 'action',
        castTime: 0,
        range: {
          kind: 'melee',
          distance: 5,
          radius: 0,
          shape: 'circle',
        },
        targeting: {
          targetType: 'enemy',
          maxTargets: 1,
          requiresLineOfSight: true,
        },
        attackRoll: null,
        savingThrow: null,
        effects: [],
        channeled: false,
        togglable: false,
        usesPerRest: null,
        usesPerEncounter: null,
      };
    }

    const passiveKind = kind as PassiveAbilityKind;

    return {
      ...commonAbility,
      category: 'passive',
      passiveKind,
      mode: 'always-on',
      statBonuses: passiveKind === 'stat-bonus' ? { modifiers: [] } : null,
      aura:
        passiveKind === 'aura'
          ? {
              radius: 5,
              shape: 'circle',
              affect: 'allies',
              effects: [],
              isToggle: false,
              requiresConcentration: false,
            }
          : null,
      triggers: passiveKind === 'triggered' ? [] : null,
    };
  }

  static createSpell(
    category: SpellCategory,
    kind: SpellKind,
    baseData: Partial<BaseItemData>,
  ): SpellSystem {
    const base = {
      name: '',
      description: '',
      weight: 0,
      rarity: 'common' as const,
      ...baseData,
    };

    return {
      ...base,
      kind: 'spell' as const,
      category,
      spellKind: kind,
      actionType: 'action',
      castTime: 0,
      range: {
        kind: 'ranged',
        distance: 30,
        radius: 0,
        shape: 'circle',
      },
      targeting: {
        targetType: 'enemy',
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      attackRoll: null,
      savingThrow: null,
      effects: [],
      channeled: false,
      togglable: false,
      usesPerRest: null,
      usesPerEncounter: null,
      cooldown: null,
      resourceCosts: [],
      maxRank: 1,
      currentRank: 1,
    };
  }

  static createEquipment(slot: EquipmentSlot, baseData: Partial<BaseItemData>): EquipmentSystem {
    const base = {
      name: '',
      description: '',
      weight: 0,
      rarity: 'common' as const,
      price: 0,
      ...baseData,
    };

    return {
      ...base,
      kind: 'equipment' as const,
      slot,
      armorClass: 0,
      statBonuses: null,
      linkedItemIds: [],
    };
  }

  static createResource(
    category: ResourceCategory,
    resourceType: string,
    baseData: Partial<BaseItemData>,
  ): ResourceData {
    const base = {
      name: '',
      description: '',
      weight: 0,
      rarity: 'common' as const,
      price: 0,
      quantity: 1,
      stackLimit: 99,
      ...baseData,
    };

    return {
      ...base,
      kind: 'resource' as const,
      category,
      resourceType,
    };
  }
}
