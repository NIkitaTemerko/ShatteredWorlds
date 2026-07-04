import { z } from 'zod';
import { rarity } from './common';

export const ResourceSystemSchema = z.object({
  kind: z.literal('resource').default('resource'),
  name: z.string().default(''),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity,
  price: z.number().default(0),
  quantity: z.number().default(1),
  stackLimit: z.number().default(99),
  category: z.enum(['raw', 'refined', 'magical', 'organic', 'special']),
  resourceType: z.string(),
});
