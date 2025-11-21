import type { BaseItemData } from './ItemDataInterface';

// ============================================================================
// Resource System
// ============================================================================

export type AbilityResourcePoolId = 'divinity' | 'karma' | 'mana' | 'void' | 'energy';

export type AbilityResourceType = AbilityResourcePoolId | 'stack';

export type ResourceScope = 'actor' | 'item';

export type ResourceSpendMode = 'spend' | 'reserve' | 'over-time';

export type ResourceAmountKind = 'fixed' | 'dynamic';

export interface FixedResourceAmount {
  kind: 'fixed';
  value: number;
}

export interface DynamicResourceAmount {
  kind: 'dynamic';
  min?: number | null;
  max?: number | 'all' | null;
  step?: number;
  formulaHint?: string;
}

export type ResourceAmount = FixedResourceAmount | DynamicResourceAmount;

export interface ResourceCost {
  type: AbilityResourceType;
  scope: ResourceScope;
  spendMode: ResourceSpendMode;
  amount: ResourceAmount;
  releaseOn?: 'end-of-effect' | 'manual' | 'rest' | null;
  perTickValue?: number | null;
  tickUnit?: 'round' | 'turn' | 'minute' | null;
  timing?: 'on-cast' | 'on-hit' | 'on-resolution';
}

// ============================================================================
// Common Structures
// ============================================================================

export interface Cooldown {
  value: number;
  unit: 'round' | 'turn' | 'minute' | 'day';
  sharedGroupId?: string;
}

export interface Duration {
  value: number;
  unit: 'round' | 'turn' | 'minute' | 'hour' | 'until-rest' | 'permanent';
  concentration?: boolean;
}

export interface ScalingFormula {
  basedOn: 'caster-level' | 'character-level' | 'ability-rank' | string;
  step: 'per-level' | 'per-2-levels' | 'per-3-levels';
  extraDice?: string;
  extraFlat?: number;
}

// ============================================================================
// Effects
// ============================================================================

export type EffectType = 'damage' | 'heal' | 'buff' | 'debuff' | 'movement' | 'summon' | 'custom';

export type ModifierMode = 'add' | 'mul' | 'override';

export interface StatModifier {
  stat: string;
  mode: ModifierMode;
  value: number;
  scaling?: ScalingFormula | null;
  condition?: string;
}

export interface StatModifierBlock {
  modifiers: StatModifier[];
}

export interface DamageEffect {
  formula: string;
  damageType: string;
  scaling?: ScalingFormula | null;
}

export interface HealEffect {
  formula: string;
  scaling?: ScalingFormula | null;
}

export interface MovementEffect {
  kind: 'dash' | 'teleport' | 'push' | 'pull';
  distance: number;
}

export interface SummonEffect {
  creatureId: string;
  count: number;
  duration: Duration;
}

export interface AbilityEffect {
  type: EffectType;
  damage?: DamageEffect;
  heal?: HealEffect;
  buff?: StatModifierBlock;
  debuff?: StatModifierBlock;
  movement?: MovementEffect;
  summon?: SummonEffect;
  duration?: Duration | null;
  tags?: string[];
  descriptionOverride?: string;
}

// ============================================================================
// Ability Base
// ============================================================================

export type AbilityCategory = 'active' | 'passive';

export interface AbilitySystemCommon extends BaseItemData {
  kind: 'ability';
  category: AbilityCategory;
  cooldown?: Cooldown | null;
  resourceCosts?: ResourceCost[];
  maxRank?: number;
  currentRank?: number;
}

// ============================================================================
// Active Abilities
// ============================================================================

export type ActiveAbilityKind =
  | 'attack'
  | 'heal'
  | 'support'
  | 'debuff'
  | 'control'
  | 'movement'
  | 'summon'
  | 'utility';

export type ActionType = 'action' | 'bonus' | 'reaction' | 'free';

export interface RangeDefinition {
  kind: 'self' | 'melee' | 'ranged' | 'area';
  distance?: number;
  radius?: number;
  shape?: 'circle' | 'cone' | 'line';
}

export interface Targeting {
  targetType: 'self' | 'ally' | 'enemy' | 'any';
  maxTargets?: number | 'all';
  requiresLineOfSight?: boolean;
}

export interface AttackRoll {
  stat: string;
  vsDefense: string;
  advantage?: 'none' | 'advantage' | 'disadvantage';
}

export interface SavingThrow {
  defenseStat: string;
  dcFormula: string;
  onSuccess: 'no-effect' | 'half-effect' | 'reduced-effect';
}

export interface ActiveAbilitySystem extends AbilitySystemCommon {
  category: 'active';
  activeKind: ActiveAbilityKind;
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

// ============================================================================
// Passive Abilities
// ============================================================================

export type PassiveAbilityKind = 'stat-bonus' | 'aura' | 'triggered' | 'mechanic';

export type AuraAffect = 'self' | 'allies' | 'enemies' | 'everyone';

export interface AuraDefinition {
  radius: number;
  shape: 'circle' | 'cone' | 'line';
  affect: AuraAffect;
  effects: AbilityEffect[];
  isToggle?: boolean;
  requiresConcentration?: boolean;
}

export type TriggerEvent =
  | 'on-hit'
  | 'on-crit'
  | 'on-take-damage'
  | 'on-kill'
  | 'on-start-turn'
  | 'on-end-turn'
  | 'on-move'
  | 'custom';

export interface TriggerDefinition {
  event: TriggerEvent;
  condition?: string;
  cooldown?: Cooldown | null;
  effects: AbilityEffect[];
}

export interface PassiveAbilitySystem extends AbilitySystemCommon {
  category: 'passive';
  passiveKind: PassiveAbilityKind;
  mode: 'always-on' | 'toggle' | 'triggered';
  statBonuses?: StatModifierBlock | null;
  aura?: AuraDefinition | null;
  triggers?: TriggerDefinition[] | null;
}

// ============================================================================
// Unified Type
// ============================================================================

export type AbilitySystem = ActiveAbilitySystem | PassiveAbilitySystem;
