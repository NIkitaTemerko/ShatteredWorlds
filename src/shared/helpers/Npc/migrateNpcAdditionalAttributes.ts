import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { ALL_ADDITIONAL_KEYS } from '../../model/constants/characterDefaults';
import { calculateAttributeProgressionBonuses } from '../Character/attributeProgression';
import {
  getNpcAdditionalStatBaseBonus,
  getNpcAdditionalStatGrowthBonus,
} from './npcAdditionalStatBonuses';

/** Конвертирует persisted absolute additional-статы NPC в ручной бонус «Доп». */
export function migrateNpcAdditionalAttributesToExtras(
  system: Record<string, unknown>,
): boolean {
  const additional = system.additionalAttributes as Record<string, unknown> | undefined;
  const attributes = system.attributes;
  if (!additional || !attributes) return false;

  const progression = calculateAttributeProgressionBonuses(
    attributes as ShwActorSystem['attributes'],
  );

  let changed = false;

  for (const key of ALL_ADDITIONAL_KEYS) {
    const stored = additional[key];
    if (typeof stored !== 'number') continue;

    const nextExtra =
      stored -
      getNpcAdditionalStatBaseBonus(key) -
      getNpcAdditionalStatGrowthBonus(key, progression);

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

  const progression = calculateAttributeProgressionBonuses(
    attributes as ShwActorSystem['attributes'],
  );

  for (const key of ALL_ADDITIONAL_KEYS) {
    const stored = additional[key];
    if (typeof stored !== 'number') continue;

    const nextExtra =
      stored -
      getNpcAdditionalStatBaseBonus(key) -
      getNpcAdditionalStatGrowthBonus(key, progression);

    if (nextExtra !== stored) return true;
  }

  return false;
}
