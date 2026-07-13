import type {
  AdditionalAttributes,
  ShwActorSystem,
} from '../../../documents/Actor/types/ShwActorSystem';
import {
  ADDITIONAL_STAT_BASE,
  type AdditionalStatBaseKey,
} from '../../model/constants/characterDefaults';
import type { AttributeProgressionBonuses } from '../Character/attributeProgression';

export function getNpcAdditionalStatBaseBonus(key: keyof AdditionalAttributes): number {
  if (key in ADDITIONAL_STAT_BASE) {
    return ADDITIONAL_STAT_BASE[key as AdditionalStatBaseKey];
  }
  return 0;
}

export function getNpcAdditionalStatGrowthBonus(
  key: keyof AdditionalAttributes,
  progression: AttributeProgressionBonuses,
): number {
  switch (key) {
    case 'impulse':
      return progression.impulse;
    case 'reactions':
      return progression.reactions;
    case 'bonusActions':
      return progression.bonusActions;
    case 'initiative':
      return progression.initiative;
    case 'barrier':
      return progression.barrier;
    case 'psiDefense':
      return progression.psiDefense;
    case 'damageReduction':
      return progression.absorption;
    case 'massCategory':
      return progression.massCategory;
    default:
      return 0;
  }
}

export type NpcAttributeValues = ShwActorSystem['attributes'];
