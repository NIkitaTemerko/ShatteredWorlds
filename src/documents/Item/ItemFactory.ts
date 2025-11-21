import type {
  AbilityCategory,
  AbilitySystem,
  ActiveAbilityKind,
  PassiveAbilityKind,
} from './types/AbilityDataTypes';
import type { ConsumableData, ConsumableType } from './types/ConsumableDataTypes';
import type { BaseItemData } from './types/ItemDataInterface';

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
}
