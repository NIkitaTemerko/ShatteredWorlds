import { z } from 'zod';
import { AbilitySystemSchema } from './ability';
import { ConsumableSystemSchema } from './consumable';
import { SpellSystemSchema } from './spell';

export function createItemCoreSchemas(foundryIcons: Set<string>) {
  const foundryIcon = z.string().refine((p) => foundryIcons.has(p), {
    message: 'Иконка не найдена в встроенном наборе Foundry',
  });

  const ConsumableItemSchema = z.object({
    baseId: z.string().min(1, 'baseId обязателен'),
    type: z.literal('consumable'),
    name: z.string().min(1, 'name обязателен'),
    img: foundryIcon.optional(),
    effects: z.array(z.unknown()).optional(),
    flags: z.record(z.string(), z.unknown()).optional(),
    pendingLinks: z.unknown().optional(),
    system: ConsumableSystemSchema,
  });

  const AbilityItemSchema = z.object({
    baseId: z.string().min(1, 'baseId обязателен'),
    type: z.literal('ability'),
    name: z.string().min(1, 'name обязателен'),
    img: foundryIcon.optional(),
    effects: z.array(z.unknown()).optional(),
    flags: z.record(z.string(), z.unknown()).optional(),
    pendingLinks: z.unknown().optional(),
    system: AbilitySystemSchema,
  });

  const SpellItemSchema = z.object({
    baseId: z.string().min(1, 'baseId обязателен'),
    type: z.literal('spell'),
    name: z.string().min(1, 'name обязателен'),
    img: foundryIcon.optional(),
    effects: z.array(z.unknown()).optional(),
    flags: z.record(z.string(), z.unknown()).optional(),
    pendingLinks: z.unknown().optional(),
    system: SpellSystemSchema,
  });

  const ItemCoreSchema = z.discriminatedUnion('type', [
    ConsumableItemSchema,
    AbilityItemSchema,
    SpellItemSchema,
  ]);

  const ItemCoresArraySchema = z.array(ItemCoreSchema);

  return {
    ItemCoreSchema,
    ItemCoresArraySchema,
    ConsumableItemSchema,
    AbilityItemSchema,
    SpellItemSchema,
  };
}

export type ValidatedItemCore = z.infer<ReturnType<typeof createItemCoreSchemas>['ItemCoreSchema']>;
