import { z } from 'zod';
import { AbilitySystemSchema } from './ability';
import { ConsumableSystemSchema } from './consumable';
import { EquipmentSystemSchema } from './equipment';
import { ResourceSystemSchema } from './resource';
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

  const EquipmentItemSchema = z.object({
    baseId: z.string().min(1, 'baseId обязателен'),
    type: z.literal('equipment'),
    name: z.string().min(1, 'name обязателен'),
    img: foundryIcon.optional(),
    effects: z.array(z.unknown()).optional(),
    flags: z.record(z.string(), z.unknown()).optional(),
    pendingLinks: z.unknown().optional(),
    system: EquipmentSystemSchema,
  });

  const ResourceItemSchema = z.object({
    baseId: z.string().min(1, 'baseId обязателен'),
    type: z.literal('resource'),
    name: z.string().min(1, 'name обязателен'),
    img: foundryIcon.optional(),
    effects: z.array(z.unknown()).optional(),
    flags: z.record(z.string(), z.unknown()).optional(),
    pendingLinks: z.unknown().optional(),
    system: ResourceSystemSchema,
  });

  const ItemCoreSchema = z.discriminatedUnion('type', [
    ConsumableItemSchema,
    AbilityItemSchema,
    SpellItemSchema,
    EquipmentItemSchema,
    ResourceItemSchema,
  ]);

  const ItemCoresArraySchema = z.array(ItemCoreSchema);

  return {
    ItemCoreSchema,
    ItemCoresArraySchema,
    ConsumableItemSchema,
    AbilityItemSchema,
    SpellItemSchema,
    EquipmentItemSchema,
    ResourceItemSchema,
  };
}

export type ValidatedItemCore = z.infer<ReturnType<typeof createItemCoreSchemas>['ItemCoreSchema']>;
