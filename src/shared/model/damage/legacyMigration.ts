import { COMBAT_DAMAGE_TYPE_IDS } from './damageTypeConfig';
import type { CombatDamageType } from './types';

const VALID_DAMAGE_TYPES = new Set<string>(COMBAT_DAMAGE_TYPE_IDS);

export const LEGACY_MVP_DAMAGE_TYPE_MAP = {
  fire: 'elemental',
  cold: 'elemental',
  lightning: 'elemental',
  acid: 'elemental',
  poison: 'necrotic',
  physical: 'physical',
  force: 'force',
} as const satisfies Record<string, CombatDamageType>;

export function migrateLegacyDamageType(value: string): CombatDamageType {
  const mapped =
    LEGACY_MVP_DAMAGE_TYPE_MAP[value as keyof typeof LEGACY_MVP_DAMAGE_TYPE_MAP];
  if (mapped) return mapped;
  if (VALID_DAMAGE_TYPES.has(value)) return value as CombatDamageType;
  console.warn(`Unknown damage type "${value}", falling back to physical`);
  return 'physical';
}

/** Миграция damage.type в данных предмета (бомба и т.д.). */
export function migrateItemDamageType(source: Record<string, unknown>): void {
  const system = source.system;
  if (!system || typeof system !== 'object') return;

  const sys = system as Record<string, unknown>;
  const damage = sys.damage;
  if (!damage || typeof damage !== 'object') return;

  const dmg = damage as Record<string, unknown>;
  if (typeof dmg.type === 'string') {
    dmg.type = migrateLegacyDamageType(dmg.type);
  }
}

/** Миграция damageType в эффектах способностей/заклинаний. */
export function migrateAbilityEffectDamageTypes(source: Record<string, unknown>): void {
  const system = source.system;
  if (!system || typeof system !== 'object') return;

  const sys = system as Record<string, unknown>;
  const effects = sys.effects;
  if (!Array.isArray(effects)) return;

  for (const effect of effects) {
    if (!effect || typeof effect !== 'object') continue;
    const eff = effect as Record<string, unknown>;
    const damage = eff.damage;
    if (!damage || typeof damage !== 'object') continue;
    const dmg = damage as Record<string, unknown>;
    if (typeof dmg.damageType === 'string') {
      dmg.damageType = migrateLegacyDamageType(dmg.damageType);
    }
  }
}
