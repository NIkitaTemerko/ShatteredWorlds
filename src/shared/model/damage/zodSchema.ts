import { z } from 'zod';
import { COMBAT_DAMAGE_TYPE_IDS } from './damageTypeConfig';
import { migrateLegacyDamageType } from './legacyMigration';
import type { CombatDamageType } from './types';

export const combatDamageTypeSchema = z.preprocess(
  (value) => (typeof value === 'string' ? migrateLegacyDamageType(value) : value),
  z.enum(COMBAT_DAMAGE_TYPE_IDS),
) as z.ZodType<CombatDamageType>;

export const itemDamageTypeSchema = z.preprocess(
  (value) => (typeof value === 'string' ? migrateLegacyDamageType(value) : value),
  z.enum(
    COMBAT_DAMAGE_TYPE_IDS.filter(
      (id) => id !== 'fall' && id !== 'soul',
    ) as [CombatDamageType, ...CombatDamageType[]],
  ),
) as z.ZodType<Exclude<CombatDamageType, 'fall' | 'soul'>>;
