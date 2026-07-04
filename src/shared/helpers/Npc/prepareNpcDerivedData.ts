import type {
  AdditionalAttributes,
  ShwActorSystem,
  ShwNpcSystem,
  StatSourceValues,
} from '../../../documents/Actor/types/ShwActorSystem';
import { STAT_KEYS } from '../../model/constants/actorKeys';
import {
  ADDITIONAL_STAT_BASE,
  ALL_ADDITIONAL_KEYS,
  type AdditionalStatBaseKey,
} from '../../model/constants/characterDefaults';
import { NPC_DEFAULTS } from '../../model/constants/npcDefaults';
import {
  attributeCoefficientValue,
  healthCoefficientValue,
} from '../Character/coefficients';
import {
  calculateAttributeProgressionBonuses,
  type AttributeProgressionBonuses,
} from '../Character/attributeProgression';
import { sumStatSources } from '../Character/collectStatBonusesBySource';

function ensureTotals(
  sys: ShwNpcSystem,
): asserts sys is ShwNpcSystem & { totals: ShwNpcSystem['totals'] } {
  if (!sys.totals) {
    sys.totals = {
      ...NPC_DEFAULTS.totals,
      fortune: 0,
      force: 0,
      finesse: 0,
      will: 0,
      presence: 0,
      actions: 0,
      bonusActions: 0,
      reactions: 0,
      initiative: 0,
      impulse: 0,
      barrier: 0,
      psiDefense: 0,
    } as ShwNpcSystem['totals'];
  }
}

function ensureAdditionalStatSources(
  sys: ShwNpcSystem,
): asserts sys is ShwNpcSystem & { additionalStatSources: ShwNpcSystem['additionalStatSources'] } {
  if (!sys.additionalStatSources) {
    sys.additionalStatSources = {} as ShwNpcSystem['additionalStatSources'];
  }
}

function getBaseBonus(key: keyof AdditionalAttributes): number {
  if (key in ADDITIONAL_STAT_BASE) {
    return ADDITIONAL_STAT_BASE[key as AdditionalStatBaseKey];
  }
  return 0;
}

function getGrowthBonus(
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
    default:
      return 0;
  }
}

function syncAdditionalStatSources(
  sys: ShwNpcSystem,
  progression: AttributeProgressionBonuses,
): void {
  ensureAdditionalStatSources(sys);

  for (const key of ALL_ADDITIONAL_KEYS) {
    const sources: StatSourceValues = {
      base: getBaseBonus(key),
      growth: getGrowthBonus(key, progression),
      equipment: 0,
      abilities: 0,
      extra: sys.additionalAttributes[key],
    };

    sys.additionalStatSources[key] = sources;
    sys.totals[key] = sumStatSources(sources);
  }
}

export function prepareNpcDerivedData(sys: ShwNpcSystem) {
  ensureTotals(sys);

  const attrs = sys.attributes;
  const progression = calculateAttributeProgressionBonuses(
    attrs as ShwActorSystem['attributes'],
  );

  sys.totals.health = sys.health.max;
  sys.totals.healthCoefficient = healthCoefficientValue(sys.health.max);
  sys.totals.speed = sys.utility.speed;

  for (const k of STAT_KEYS) {
    sys.totals[k] = attrs[k].value;
  }

  syncAdditionalStatSources(sys, progression);

  for (const k of STAT_KEYS) {
    const a = attrs[k];
    a.charBonus = (a.charBonusBase ?? 0) + Math.floor(a.value / 5);
    a.saveBonus = (a.saveBonusBase ?? 0) + Math.floor(a.value / 5);
    a.coefficient = attributeCoefficientValue(a.value + a.extra);
  }
}
