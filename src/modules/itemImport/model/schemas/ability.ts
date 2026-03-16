import { z } from 'zod';
import { RangeSchema, rarity, TargetingSchema } from './common';

export const ActiveAbilitySystemSchema = z.object({
  category: z.literal('active'),
  kind: z.literal('ability').default('ability'),
  name: z.string().default(''),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity,
  activeKind: z.enum(['attack', 'defense', 'utility', 'movement']),
  actionType: z.enum(['action', 'bonus', 'reaction', 'free']).default('action'),
  castTime: z.number().optional(),
  range: RangeSchema,
  targeting: TargetingSchema,
  cooldown: z.unknown().nullable().default(null),
  resourceCosts: z.array(z.unknown()).default([]),
  maxRank: z.number().default(1),
  currentRank: z.number().default(1),
  attackRoll: z.unknown().nullable().optional(),
  savingThrow: z.unknown().nullable().optional(),
  effects: z.array(z.unknown()).default([]),
  channeled: z.boolean().optional(),
  togglable: z.boolean().optional(),
  usesPerRest: z.number().nullable().optional(),
  usesPerEncounter: z.number().nullable().optional(),
});

export const PassiveAbilitySystemSchema = z.object({
  category: z.literal('passive'),
  kind: z.literal('ability').default('ability'),
  name: z.string().default(''),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity,
  passiveKind: z.enum(['stat-bonus', 'aura', 'triggered']),
  mode: z.enum(['always-on', 'toggle', 'triggered']).default('always-on'),
  cooldown: z.unknown().nullable().default(null),
  resourceCosts: z.array(z.unknown()).default([]),
  maxRank: z.number().default(1),
  currentRank: z.number().default(1),
  statBonuses: z.unknown().nullable().optional(),
  aura: z.unknown().nullable().optional(),
  triggers: z.array(z.unknown()).nullable().optional(),
});

export const AbilitySystemSchema = z.discriminatedUnion('category', [
  ActiveAbilitySystemSchema,
  PassiveAbilitySystemSchema,
]);
