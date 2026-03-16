import { z } from 'zod';

export const rarity = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common');

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
