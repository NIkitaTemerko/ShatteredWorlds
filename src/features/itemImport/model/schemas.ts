import { z } from 'zod';
import foundryIconsList from '../../../shared/data/foundryIcons.json';

// Общие схемы
const FOUNDRY_ICONS = new Set(foundryIconsList);

const rarity = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common');
const foundryIcon = z.string().refine((p) => FOUNDRY_ICONS.has(p), {
  message: 'Иконка не найдена в встроенном наборе Foundry',
});

// Базовые поля для всех консьюмаблов
const BaseConsumableFields = {
  quantity: z.number().default(1),
  stackLimit: z.number().default(99),
  price: z.number().default(0),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity,
  activation: z
    .object({
      type: z.enum(['action', 'bonus', 'reaction']).default('action'),
      cost: z.number().default(1),
    })
    .default({ type: 'action', cost: 1 }),
  uses: z
    .object({
      value: z.number().default(1),
      max: z.number().default(1),
      per: z.enum(['charges', 'uses', 'turns']).default('charges'),
    })
    .default({ value: 1, max: 1, per: 'charges' }),
};

// === Консьюмаблы по типам ===

const PotionSystemSchema = z.object({
  ...BaseConsumableFields,
  consumableType: z.literal('potion'),
  effects: z
    .array(
      z.object({
        type: z.enum(['heal', 'buff', 'cure']),
        amount: z.number(),
        duration: z.number(),
        attribute: z.string().optional(),
      }),
    )
    .min(1, 'Зелье должно иметь хотя бы один эффект'),
});

const BombSystemSchema = z.object({
  ...BaseConsumableFields,
  consumableType: z.literal('bomb'),
  damage: z.object({
    amount: z.number(),
    type: z.enum(['fire', 'acid', 'cold', 'lightning', 'poison', 'physical', 'force']),
  }),
  radius: z.number().min(1, 'Радиус бомбы должен быть >= 1'),
  save: z.object({
    type: z.enum(['force', 'perception', 'psyDefence', 'fortune', 'diplomacy']),
    dc: z.number(),
  }),
});

const ScrollSystemSchema = z.object({
  ...BaseConsumableFields,
  consumableType: z.literal('scroll'),
  spell: z.object({
    name: z.string().min(1),
    level: z.number(),
    school: z.string(),
  }),
  requirements: z.object({
    ability: z.enum(['fortune', 'force', 'perception', 'psyDefence', 'diplomacy']),
    dc: z.number(),
  }),
});

const FoodSystemSchema = z.object({
  ...BaseConsumableFields,
  consumableType: z.literal('food'),
  nutrition: z.object({
    value: z.number(),
    duration: z.number(),
  }),
  effects: z
    .array(
      z.object({
        type: z.string(),
        duration: z.number(),
        value: z.number(),
      }),
    )
    .default([]),
});

const PoisonSystemSchema = z.object({
  ...BaseConsumableFields,
  consumableType: z.literal('poison'),
  damage: z.object({
    initial: z.union([z.string(), z.number()]),
    recurring: z.union([z.string(), z.number()]),
    duration: z.number(),
  }),
  save: z.object({
    type: z.enum(['force', 'perception', 'psyDefence', 'fortune', 'diplomacy']),
    dc: z.number(),
  }),
  application: z.enum(['contact', 'injury', 'ingested', 'inhaled']),
});

const ConsumableSystemSchema = z.discriminatedUnion('consumableType', [
  PotionSystemSchema,
  BombSystemSchema,
  ScrollSystemSchema,
  FoodSystemSchema,
  PoisonSystemSchema,
]);

// Ability
const AbilitySystemSchema = z.object({
  abilityType: z.enum(['active', 'passive']).default('active'),
  category: z.enum(['active', 'passive']).default('active'),
  kind: z.literal('ability').default('ability'),
  name: z.string().default(''),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity,
  activeKind: z.enum(['attack', 'defense', 'utility', 'movement']).optional(),
  passiveKind: z.enum(['stat-bonus', 'aura', 'triggered']).optional(),
  cooldown: z.unknown().nullable().default(null),
  resourceCosts: z.array(z.unknown()).default([]),
  maxRank: z.number().default(1),
  currentRank: z.number().default(1),
  actionType: z.enum(['action', 'bonus', 'reaction']).optional(),
  castTime: z.number().optional(),
  range: z.unknown().optional(),
  targeting: z.unknown().optional(),
  mode: z.enum(['always-on', 'toggle']).optional(),
  statBonuses: z.unknown().nullable().optional(),
  aura: z.unknown().nullable().optional(),
  triggers: z.array(z.unknown()).nullable().optional(),
});

// Spell
const SpellSystemSchema = z.object({
  category: z.enum(['code', 'elemental', 'dark', 'holy', 'arcane']).default('arcane'),
  spellKind: z.enum(['attack', 'defense', 'utility', 'movement']).default('attack'),
  kind: z.literal('spell').default('spell'),
  name: z.string().default(''),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity,
  level: z.number().default(1),
  resourceCosts: z.array(z.unknown()).default([]),
  castTime: z.number().default(0),
  range: z.unknown().optional(),
  targeting: z.unknown().optional(),
  damage: z.unknown().optional(),
  effects: z.array(z.unknown()).default([]),
});

// Главная схема - discriminated по type
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

export const ItemCoreSchema = z.discriminatedUnion('type', [
  ConsumableItemSchema,
  AbilityItemSchema,
  SpellItemSchema,
]);

export const ItemCoresArraySchema = z.array(ItemCoreSchema);
export type ValidatedItemCore = z.infer<typeof ItemCoreSchema>;
