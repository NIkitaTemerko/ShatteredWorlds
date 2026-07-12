import type { AdditionalAttributes, ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { ALL_ADDITIONAL_KEYS } from '../../model/constants/characterDefaults';
import { attributeCoefficientValue } from '../Character/coefficients';
import { calculateAttributeProgressionBonuses } from '../Character/attributeProgression';
import type { AttributeProgressionBonuses } from '../Character/attributeProgression';
import {
  getNpcAdditionalStatBaseBonus,
  getNpcAdditionalStatGrowthBonus,
} from './npcAdditionalStatBonuses';

/**
 * Старый NPC хранил итоговое значение в additionalAttributes.
 * 0 = дефолт без кастома → extra 0. Положительные значения → extra без ухода в минус.
 */
function convertLegacyNpcAbsoluteToExtra(
  stored: number,
  key: keyof AdditionalAttributes,
  progression: AttributeProgressionBonuses,
): number {
  if (stored === 0) return 0;

  return Math.max(
    0,
    stored -
      getNpcAdditionalStatBaseBonus(key) -
      getNpcAdditionalStatGrowthBonus(key, progression),
  );
}

/** Конвертирует persisted absolute additional-статы NPC в ручной бонус «Доп». */
export function migrateNpcAdditionalAttributesToExtras(
  system: Record<string, unknown>,
): boolean {
  const additional = system.additionalAttributes as Record<string, unknown> | undefined;
  const attributes = system.attributes;
  if (!additional || !attributes) return false;

  const attrs = attributes as ShwActorSystem['attributes'];
  const { fortune } = attrs;
  fortune.coefficient = attributeCoefficientValue(fortune.value + fortune.extra);
  const progression = calculateAttributeProgressionBonuses(attrs);

  let changed = false;

  for (const key of ALL_ADDITIONAL_KEYS) {
    const stored = additional[key];
    if (typeof stored !== 'number') continue;

    const nextExtra = convertLegacyNpcAbsoluteToExtra(stored, key, progression);

    if (nextExtra !== stored) {
      additional[key] = nextExtra;
      changed = true;
    }
  }

  return changed;
}

export function npcAdditionalAttributesNeedMigration(
  system: Record<string, unknown>,
): boolean {
  const additional = system.additionalAttributes as Record<string, unknown> | undefined;
  const attributes = system.attributes;
  if (!additional || !attributes) return false;

  const attrs = attributes as ShwActorSystem['attributes'];
  const { fortune } = attrs;
  fortune.coefficient = attributeCoefficientValue(fortune.value + fortune.extra);
  const progression = calculateAttributeProgressionBonuses(attrs);

  for (const key of ALL_ADDITIONAL_KEYS) {
    const stored = additional[key];
    if (typeof stored !== 'number') continue;

    if (convertLegacyNpcAbsoluteToExtra(stored, key, progression) !== stored) return true;
  }

  return false;
}

/** Исправляет отрицательные «Доп» после некорректной v3-миграции. */
export function fixNpcNegativeAdditionalExtras(system: Record<string, unknown>): boolean {
  const additional = system.additionalAttributes as Record<string, unknown> | undefined;
  if (!additional) return false;

  let changed = false;

  for (const key of ALL_ADDITIONAL_KEYS) {
    const stored = additional[key];
    if (typeof stored !== 'number' || stored >= 0) continue;

    additional[key] = 0;
    changed = true;
  }

  return changed;
}

export function npcNegativeAdditionalExtrasNeedFix(system: Record<string, unknown>): boolean {
  const additional = system.additionalAttributes as Record<string, unknown> | undefined;
  if (!additional) return false;

  for (const key of ALL_ADDITIONAL_KEYS) {
    const stored = additional[key];
    if (typeof stored === 'number' && stored < 0) return true;
  }

  return false;
}
