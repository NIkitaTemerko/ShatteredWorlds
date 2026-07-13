import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type {
  AdditionalAttributes,
  HealthStatSources,
  ShwActorSystem,
  StatSourceValues,
} from '../../../documents/Actor/types/ShwActorSystem';
import type { CharacterStatPath } from '../../model/characterStatPaths';
import { STAT_KEYS } from '../../model/constants/actorKeys';
import {
  ADDITIONAL_STAT_BASE,
  ALL_ADDITIONAL_KEYS,
  HEALTH_BASE,
  type AdditionalStatBaseKey,
} from '../../model/constants/characterDefaults';
import {
  applyComputedResourceFields,
  calculateAttributeProgressionBonuses,
  type AttributeProgressionBonuses,
} from './attributeProgression';
import {
  applyManualItemBonuses,
  calculateItemBonuses,
  getItemBonus,
  sumItemBonuses,
} from './calculateItemBonuses';
import {
  collectStatBonusesBySource,
  sumBonusForAdditionalStat,
  sumBonusForAttributeField,
  sumAttributeExtraSources,
  sumBonusForHealth,
  sumHealthStatSources,
  sumStatSources,
} from './collectStatBonusesBySource';
import {
  attributeCoefficientValue,
  healthCoefficientValue,
} from './coefficients';
import { clampMassCategoryTotal, syncBarrierValue } from './syncBarrierValue';

function ensureTotals(
  sys: ShwActorSystem,
): asserts sys is ShwActorSystem & { totals: ShwActorSystem['totals'] } {
  if (!sys.totals) {
    sys.totals = {} as ShwActorSystem['totals'];
  }
}

function ensureAdditionalStatSources(
  sys: ShwActorSystem,
): asserts sys is ShwActorSystem & { additionalStatSources: ShwActorSystem['additionalStatSources'] } {
  if (!sys.additionalStatSources) {
    sys.additionalStatSources = {} as ShwActorSystem['additionalStatSources'];
  }
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
    case 'massCategory':
      return progression.massCategory;
    default:
      return 0;
  }
}

function getBaseBonus(key: keyof AdditionalAttributes): number {
  if (key in ADDITIONAL_STAT_BASE) {
    return ADDITIONAL_STAT_BASE[key as AdditionalStatBaseKey];
  }
  return 0;
}

function attributeItemBonus(bonuses: Map<CharacterStatPath, number>, key: string): number {
  return sumItemBonuses(bonuses, [`attributes.${key}.value`, `totals.${key}`]);
}

function syncAttributeTotals(
  sys: ShwActorSystem,
  attributeValueBonuses: Map<CharacterStatPath, number>,
): void {
  for (const k of STAT_KEYS) {
    sys.totals[k] = sys.attributes[k].value + attributeItemBonus(attributeValueBonuses, k);
  }
}

function ensureHealthStatSources(
  sys: ShwActorSystem,
): asserts sys is ShwActorSystem & { healthStatSources: ShwActorSystem['healthStatSources'] } {
  if (!sys.healthStatSources) {
    sys.healthStatSources = {} as ShwActorSystem['healthStatSources'];
  }
}

function syncHealthStatSources(
  sys: ShwActorSystem,
  itemBonuses: ReturnType<typeof collectStatBonusesBySource>,
): void {
  ensureHealthStatSources(sys);

  const sources: HealthStatSources = {
    base: HEALTH_BASE,
    equipment: sumBonusForHealth(itemBonuses.equipment),
    abilities: sumBonusForHealth(itemBonuses.abilities),
    extra: sys.health.extra,
  };

  sys.healthStatSources = sources;
  sys.totals.health = sumHealthStatSources(sources);
}

function syncAdditionalStatSources(
  sys: ShwActorSystem,
  progression: AttributeProgressionBonuses,
  itemBonuses: ReturnType<typeof collectStatBonusesBySource>,
): void {
  ensureAdditionalStatSources(sys);

  for (const key of ALL_ADDITIONAL_KEYS) {
    const sources: StatSourceValues = {
      base: getBaseBonus(key),
      growth: getGrowthBonus(key, progression),
      equipment: sumBonusForAdditionalStat(itemBonuses.equipment, key),
      abilities: sumBonusForAdditionalStat(itemBonuses.abilities, key),
      extra: sys.additionalAttributes[key],
    };

    sys.additionalStatSources[key] = sources;
    sys.totals[key] = sumStatSources(sources);
    if (key === 'massCategory') {
      sys.totals.massCategory = Math.max(1, sys.totals.massCategory);
    }
  }
}

function syncResourceTotals(
  sys: ShwActorSystem,
  progression: AttributeProgressionBonuses,
  totalsDirectBonuses: Map<CharacterStatPath, number>,
  itemBonuses: ReturnType<typeof collectStatBonusesBySource>,
): void {
  applyComputedResourceFields(sys, progression);

  sys.utility.speed += sumItemBonuses(totalsDirectBonuses, ['utility.speed', 'totals.speed']);

  syncAdditionalStatSources(sys, progression, itemBonuses);
  syncHealthStatSources(sys, itemBonuses);

  sys.totals.speed = sys.utility.speed;
  sys.totals.healthCoefficient =
    healthCoefficientValue(sys.totals.health) +
    getItemBonus(totalsDirectBonuses, 'totals.healthCoefficient');
}

function updateAttributeBonuses(
  totals: ShwActorSystem['totals'],
  attributes: ShwActorSystem['attributes'],
  bonuses: Map<CharacterStatPath, number>,
): void {
  for (const k of STAT_KEYS) {
    const a = attributes[k];
    const fromTotal = Math.floor(totals[k] / 5);
    a.charBonus =
      fromTotal + (a.charBonusBase ?? 0) + getItemBonus(bonuses, `attributes.${k}.charBonus`);
    a.saveBonus =
      fromTotal + (a.saveBonusBase ?? 0) + getItemBonus(bonuses, `attributes.${k}.saveBonus`);
  }
}

function syncAttributeCoefficients(
  sys: ShwActorSystem,
  bonuses: Map<CharacterStatPath, number>,
): void {
  for (const k of STAT_KEYS) {
    const sources = sys.attributeStatSources?.[k];
    const extraTotal = sources ? sumAttributeExtraSources(sources.extra) : sys.attributes[k].extra;
    sys.attributes[k].coefficient =
      attributeCoefficientValue(extraTotal) +
      getItemBonus(bonuses, `attributes.${k}.coefficient`);
  }
}

function ensureAttributeStatSources(
  sys: ShwActorSystem,
): asserts sys is ShwActorSystem & { attributeStatSources: ShwActorSystem['attributeStatSources'] } {
  if (!sys.attributeStatSources) {
    sys.attributeStatSources = {} as ShwActorSystem['attributeStatSources'];
  }
}

function syncAttributeStatSources(
  sys: ShwActorSystem,
  itemBonuses: ReturnType<typeof collectStatBonusesBySource>,
): void {
  ensureAttributeStatSources(sys);

  for (const k of STAT_KEYS) {
    const attr = sys.attributes[k];
    const rollBase = Math.floor(sys.totals[k] / 5);

    sys.attributeStatSources[k] = {
      value: {
        base: attr.value,
        equipment: sumBonusForAttributeField(itemBonuses.equipment, k, 'value'),
        abilities: sumBonusForAttributeField(itemBonuses.abilities, k, 'value'),
      },
      extra: {
        equipment: sumBonusForAttributeField(itemBonuses.equipment, k, 'extra'),
        abilities: sumBonusForAttributeField(itemBonuses.abilities, k, 'extra'),
        extra: attr.extra,
      },
      charBonus: {
        base: rollBase,
        equipment: sumBonusForAttributeField(itemBonuses.equipment, k, 'charBonus'),
        abilities: sumBonusForAttributeField(itemBonuses.abilities, k, 'charBonus'),
        extra: attr.charBonusBase ?? 0,
      },
      saveBonus: {
        base: rollBase,
        equipment: sumBonusForAttributeField(itemBonuses.equipment, k, 'saveBonus'),
        abilities: sumBonusForAttributeField(itemBonuses.abilities, k, 'saveBonus'),
        extra: attr.saveBonusBase ?? 0,
      },
    };
  }
}

export function prepareCharacterDerivedData(sys: ShwActorSystem, actor: ShwActor<'character'>) {
  ensureTotals(sys);

  const itemBonusesBySource = collectStatBonusesBySource(actor);
  const { bonuses } = calculateItemBonuses(actor);
  applyManualItemBonuses(sys, bonuses);

  syncAttributeTotals(sys, bonuses);
  syncAttributeStatSources(sys, itemBonusesBySource);
  updateAttributeBonuses(sys.totals, sys.attributes, bonuses);
  syncAttributeCoefficients(sys, bonuses);

  const fortuneExtra = sys.attributeStatSources?.fortune
    ? sumAttributeExtraSources(sys.attributeStatSources.fortune.extra)
    : sys.attributes.fortune.extra;

  const progression = calculateAttributeProgressionBonuses(sys.attributes, sys.totals, fortuneExtra);
  syncResourceTotals(sys, progression, bonuses, itemBonusesBySource);
  syncBarrierValue(sys);
}
