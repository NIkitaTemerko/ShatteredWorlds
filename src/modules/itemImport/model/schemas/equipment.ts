import { z } from 'zod';
import { rarity } from './common';

const StatModifierSchema = z.object({
  stat: z.string(),
  mode: z.enum(['add', 'mul', 'override']).default('add'),
  value: z.number().default(0),
  scaling: z.unknown().nullable().default(null),
  condition: z.string().optional(),
});

const StatModifierBlockSchema = z
  .object({
    modifiers: z.array(StatModifierSchema).default([]),
  })
  .nullable()
  .default(null);

export const EquipmentSystemSchema = z.object({
  kind: z.literal('equipment').default('equipment'),
  name: z.string().default(''),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity,
  price: z.number().default(0),
  slot: z.enum([
    'head',
    'cloak',
    'amulet',
    'hands',
    'body',
    'belt',
    'one-hand',
    'two-hand',
    'boots',
    'ring',
  ]),
  armorClass: z.number().default(0),
  statBonuses: StatModifierBlockSchema,
  linkedItemIds: z.array(z.string()).default([]),
});
