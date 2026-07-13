import { z } from 'zod';
import {
  migrateLegacyAbilityKey,
  migrateLegacyStatPath,
} from '../../../../shared/helpers/migrateLegacyStatKeys';
import { CHARACTER_STAT_OPTIONS } from '../../../../shared/model/characterStatPaths';
import { combatDamageTypeSchema } from '../../../../shared/model/damage/zodSchema';

const VALID_STAT_PATHS = CHARACTER_STAT_OPTIONS.map((option) => option.value);

export const rarity = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common');

export const abilityTypeSchema = z.preprocess(
  (value) => (typeof value === 'string' ? migrateLegacyAbilityKey(value) : value),
  z.enum(['fortune', 'force', 'finesse', 'will', 'presence']),
);

export const statPathSchema = z.preprocess(
  (value) => (typeof value === 'string' ? migrateLegacyStatPath(value) : value),
  z.enum([VALID_STAT_PATHS[0], ...VALID_STAT_PATHS.slice(1)]),
);

export const RangeSchema = z.object({
  kind: z.enum(['self', 'melee', 'ranged', 'area']),
  distance: z.number().optional(),
  radius: z.number().optional(),
  shape: z.enum(['circle', 'cone', 'line']).optional(),
});

export const TargetingSchema = z.object({
  targetType: z.enum(['self', 'ally', 'enemy', 'any']),
  maxTargets: z.union([z.number(), z.literal('all')]).optional(),
  requiresLineOfSight: z.boolean().optional(),
});

export const CooldownSchema = z.object({
  value: z.number(),
  unit: z.enum(['round', 'turn', 'minute', 'day']),
  sharedGroupId: z.string().optional(),
});

export const DurationSchema = z.object({
  value: z.number(),
  unit: z.enum(['round', 'turn', 'minute', 'hour', 'until-rest', 'permanent']),
  concentration: z.boolean().optional(),
});

export const ScalingFormulaSchema = z.object({
  basedOn: z.union([z.enum(['caster-level', 'character-level', 'ability-rank']), z.string()]),
  step: z.enum(['per-level', 'per-2-levels', 'per-3-levels']),
  extraDice: z.string().optional(),
  extraFlat: z.number().optional(),
});

export const StatModifierSchema = z.object({
  stat: statPathSchema,
  mode: z.enum(['add', 'mul', 'override']).default('add'),
  value: z.number().default(0),
  scaling: ScalingFormulaSchema.nullable().optional().default(null),
  condition: z.string().optional(),
});

export const StatModifierBlockSchema = z.object({
  modifiers: z.array(StatModifierSchema).default([]),
});

export const DamageEffectSchema = z.object({
  formula: z.string(),
  damageType: combatDamageTypeSchema,
  scaling: ScalingFormulaSchema.nullable().optional(),
});

export const HealEffectSchema = z.object({
  formula: z.string(),
  scaling: ScalingFormulaSchema.nullable().optional(),
});

export const MovementEffectSchema = z.object({
  kind: z.enum(['dash', 'teleport', 'push', 'pull']),
  distance: z.number(),
});

export const SummonEffectSchema = z.object({
  creatureId: z.string(),
  count: z.number(),
  duration: DurationSchema,
});

export const AbilityEffectSchema = z.object({
  type: z.enum(['damage', 'heal', 'buff', 'debuff', 'movement', 'summon', 'custom']),
  damage: DamageEffectSchema.optional(),
  heal: HealEffectSchema.optional(),
  buff: StatModifierBlockSchema.optional(),
  debuff: StatModifierBlockSchema.optional(),
  movement: MovementEffectSchema.optional(),
  summon: SummonEffectSchema.optional(),
  duration: DurationSchema.nullable().optional(),
  tags: z.array(z.string()).optional(),
  descriptionOverride: z.string().optional(),
});

export const AttackRollSchema = z.object({
  stat: z.string(),
  vsDefense: z.string(),
  advantage: z.enum(['none', 'advantage', 'disadvantage']).optional(),
});

export const SavingThrowSchema = z.object({
  defenseStat: z.string(),
  dcFormula: z.string(),
  onSuccess: z.enum(['no-effect', 'half-effect', 'reduced-effect']),
});

export const FixedResourceAmountSchema = z.object({
  kind: z.literal('fixed'),
  value: z.number(),
});

export const DynamicResourceAmountSchema = z.object({
  kind: z.literal('dynamic'),
  min: z.number().nullable().optional(),
  max: z
    .union([z.number(), z.literal('all')])
    .nullable()
    .optional(),
  step: z.number().optional(),
  formulaHint: z.string().optional(),
});

export const ResourceAmountSchema = z.discriminatedUnion('kind', [
  FixedResourceAmountSchema,
  DynamicResourceAmountSchema,
]);

export const ResourceCostSchema = z.object({
  type: z.enum(['divinity', 'karma', 'mana', 'void', 'energy', 'stack']),
  scope: z.enum(['actor', 'item']),
  spendMode: z.enum(['spend', 'reserve', 'over-time']),
  amount: ResourceAmountSchema,
  releaseOn: z.enum(['end-of-effect', 'manual', 'rest']).nullable().optional(),
  perTickValue: z.number().nullable().optional(),
  tickUnit: z.enum(['round', 'turn', 'minute']).nullable().optional(),
  timing: z.enum(['on-cast', 'on-hit', 'on-resolution']).optional(),
});

export const AuraDefinitionSchema = z.object({
  radius: z.number(),
  shape: z.enum(['circle', 'cone', 'line']),
  affect: z.enum(['self', 'allies', 'enemies', 'everyone']),
  effects: z.array(AbilityEffectSchema).default([]),
  isToggle: z.boolean().optional(),
  requiresConcentration: z.boolean().optional(),
});

export const TriggerDefinitionSchema = z.object({
  event: z.enum([
    'on-hit',
    'on-crit',
    'on-take-damage',
    'on-kill',
    'on-start-turn',
    'on-end-turn',
    'on-move',
    'custom',
  ]),
  condition: z.string().optional(),
  cooldown: CooldownSchema.nullable().optional(),
  effects: z.array(AbilityEffectSchema).default([]),
});
