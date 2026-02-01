import { z } from 'zod';
import foundryIconsList from '../../../shared/data/foundryIcons.json';

/**
 * Все допустимые иконки Foundry из встроенного набора
 */
const FOUNDRY_ICONS = new Set(foundryIconsList);

/**
 * Проверяет, является ли путь валидной иконкой Foundry
 * Путь должен начинаться с "icons/" и быть в списке допустимых
 */
const foundryIconValidator = z
  .string()
  .refine((iconPath) => FOUNDRY_ICONS.has(iconPath), {
    message: 'Иконка не найдена в встроенном наборе Foundry',
  });

/**
 * Схема для Consumable (potion/bomb/scroll/food/poison)
 */
const ConsumableSystemSchema = z.object({
  consumableType: z.enum(['potion', 'bomb', 'scroll', 'food', 'poison']).default('potion'),
  quantity: z.number().default(1),
  stackLimit: z.number().default(99),
  price: z.number().default(0),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common'),

  // Defaults для activation
  activation: z
    .object({
      type: z.enum(['action', 'bonus', 'reaction']).default('action'),
      cost: z.number().default(1),
    })
    .default({ type: 'action', cost: 1 }),

  // Defaults для uses
  uses: z
    .object({
      value: z.number().default(1),
      max: z.number().default(1),
      per: z.enum(['charges', 'uses', 'turns']).default('charges'),
    })
    .default({ value: 1, max: 1, per: 'charges' }),

  // Специфичные поля (опциональные)
  effects: z.array(z.unknown()).optional().default([]),
  damage: z.unknown().optional(),
  radius: z.number().optional(),
  save: z.unknown().optional(),
  spell: z.unknown().optional(),
  requirements: z.unknown().optional(),
  nutrition: z.unknown().optional(),
  application: z.enum(['contact', 'injury', 'ingested', 'inhaled']).optional(),
});

/**
 * Схема для Ability
 */
const AbilitySystemSchema = z.object({
  abilityType: z.enum(['active', 'passive']).default('active'),
  category: z.enum(['active', 'passive']).default('active'),
  kind: z.literal('ability').default('ability'),
  name: z.string().default(''),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common'),

  activeKind: z.enum(['attack', 'defense', 'utility', 'movement']).optional(),
  passiveKind: z.enum(['stat-bonus', 'aura', 'triggered']).optional(),

  cooldown: z.unknown().nullable().default(null),
  resourceCosts: z.array(z.unknown()).default([]),
  maxRank: z.number().default(1),
  currentRank: z.number().default(1),

  // Active specific
  actionType: z.enum(['action', 'bonus', 'reaction']).optional(),
  castTime: z.number().optional(),
  range: z.unknown().optional(),
  targeting: z.unknown().optional(),

  // Passive specific
  mode: z.enum(['always-on', 'toggle']).optional(),
  statBonuses: z.unknown().nullable().optional(),
  aura: z.unknown().nullable().optional(),
  triggers: z.array(z.unknown()).nullable().optional(),
});

/**
 * Схема для Spell
 */
const SpellSystemSchema = z.object({
  category: z.enum(['code', 'elemental', 'dark', 'holy', 'arcane']).default('arcane'),
  spellKind: z.enum(['attack', 'defense', 'utility', 'movement']).default('attack'),
  kind: z.literal('spell').default('spell'),
  name: z.string().default(''),
  description: z.string().default(''),
  weight: z.number().default(0),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common'),

  level: z.number().default(1),
  resourceCosts: z.array(z.unknown()).default([]),
  castTime: z.number().default(0),
  range: z.unknown().optional(),
  targeting: z.unknown().optional(),
  damage: z.unknown().optional(),
  effects: z.array(z.unknown()).default([]),
});

/**
 * Главная схема ItemCore с union по типу
 */
export const ItemCoreSchema = z.object({
  baseId: z.string().min(1, 'baseId обязателен'),
  type: z.enum(['consumable', 'ability', 'spell']),
  name: z.string().min(1, 'name обязателен'),
  img: foundryIconValidator.optional(),
  effects: z.array(z.unknown()).optional(),
  flags: z.record(z.string(), z.unknown()).optional(),
  pendingLinks: z.unknown().optional(),
  system: z.union([ConsumableSystemSchema, AbilitySystemSchema, SpellSystemSchema]),
});

export type ValidatedItemCore = z.infer<typeof ItemCoreSchema>;

/**
 * Схема для массива items
 */
export const ItemCoresArraySchema = z.array(ItemCoreSchema);
