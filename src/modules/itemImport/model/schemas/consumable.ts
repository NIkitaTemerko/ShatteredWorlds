import { z } from 'zod';
import { migrateLegacyAbilityKey } from '../../../../shared/helpers/migrateLegacyStatKeys';
import { rarity } from './common';

const abilityTypeSchema = z.preprocess(
  (value) => (typeof value === 'string' ? migrateLegacyAbilityKey(value) : value),
  z.enum(['fortune', 'force', 'finesse', 'will', 'presence']),
);

// Базовые поля для всех консьюмаблов
const BaseConsumableFields = {
  name: z.string().default(''),
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

export const PotionSystemSchema = z.object({
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

export const BombSystemSchema = z.object({
  ...BaseConsumableFields,
  consumableType: z.literal('bomb'),
  damage: z.object({
    amount: z.number(),
    type: z.enum(['fire', 'acid', 'cold', 'lightning', 'poison', 'physical', 'force']),
  }),
  radius: z.number().min(1, 'Радиус бомбы должен быть >= 1'),
  save: z.object({
    type: abilityTypeSchema,
    dc: z.number(),
  }),
});

export const ScrollSystemSchema = z.object({
  ...BaseConsumableFields,
  consumableType: z.literal('scroll'),
  spell: z.object({
    name: z.string().min(1),
    level: z.number(),
    school: z.string(),
  }),
  requirements: z.object({
    ability: abilityTypeSchema,
    dc: z.number(),
  }),
});

export const FoodSystemSchema = z.object({
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

export const PoisonSystemSchema = z.object({
  ...BaseConsumableFields,
  consumableType: z.literal('poison'),
  damage: z.object({
    initial: z.union([z.string(), z.number()]),
    recurring: z.union([z.string(), z.number()]),
    duration: z.number(),
  }),
  save: z.object({
    type: abilityTypeSchema,
    dc: z.number(),
  }),
  application: z.enum(['contact', 'injury', 'ingested', 'inhaled']),
});

export const ConsumableSystemSchema = z.discriminatedUnion('consumableType', [
  PotionSystemSchema,
  BombSystemSchema,
  ScrollSystemSchema,
  FoodSystemSchema,
  PoisonSystemSchema,
]);
