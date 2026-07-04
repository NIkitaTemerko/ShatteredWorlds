import { z } from 'zod';
import { rarity, StatModifierBlockSchema } from './common';

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
  statBonuses: StatModifierBlockSchema.nullable().default(null),
  linkedItemIds: z.array(z.string()).default([]),
});
