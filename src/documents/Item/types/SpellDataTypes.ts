import type {
  AbilityEffect,
  ActionType,
  AttackRoll,
  Cooldown,
  RangeDefinition,
  ResourceCost,
  SavingThrow,
  Targeting,
} from './AbilityDataTypes';
import type { BaseItemData } from './ItemDataInterface';

// ============================================================================
// Spell Categories
// ============================================================================

export type SpellCategory = 'code' | 'elemental' | 'dark' | 'holy' | 'arcane';

// ============================================================================
// Spell System Base
// ============================================================================

export interface SpellSystemCommon extends BaseItemData {
  kind: 'spell';
  category: SpellCategory;
  cooldown?: Cooldown | null;
  resourceCosts?: ResourceCost[];
  maxRank?: number;
  currentRank?: number;
}

// ============================================================================
// Spell Types (все заклинания активные по сути)
// ============================================================================

export type SpellKind =
  | 'attack'
  | 'heal'
  | 'support'
  | 'debuff'
  | 'control'
  | 'movement'
  | 'summon'
  | 'utility';

export interface SpellSystem extends SpellSystemCommon {
  spellKind: SpellKind;
  actionType: ActionType;
  castTime?: number;
  range: RangeDefinition;
  targeting: Targeting;
  attackRoll?: AttackRoll | null;
  savingThrow?: SavingThrow | null;
  effects: AbilityEffect[];
  channeled?: boolean;
  togglable?: boolean;
  usesPerRest?: number | null;
  usesPerEncounter?: number | null;
}
