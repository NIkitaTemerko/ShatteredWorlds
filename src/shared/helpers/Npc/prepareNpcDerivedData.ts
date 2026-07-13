import type {
  ShwActorSystem,
  ShwNpcSystem,
  StatSourceValues,
} from '../../../documents/Actor/types/ShwActorSystem';
import { STAT_KEYS } from '../../model/constants/actorKeys';
import { ALL_ADDITIONAL_KEYS } from '../../model/constants/characterDefaults';
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
import { syncBarrierValue } from '../Character/syncBarrierValue';
import {
  getNpcAdditionalStatBaseBonus,
  getNpcAdditionalStatGrowthBonus,
} from './npcAdditionalStatBonuses';

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

function syncAdditionalStatSources(
  sys: ShwNpcSystem,
  progression: AttributeProgressionBonuses,
): void {
  ensureAdditionalStatSources(sys);

  for (const key of ALL_ADDITIONAL_KEYS) {
    const sources: StatSourceValues = {
      base: getNpcAdditionalStatBaseBonus(key),
      growth: getNpcAdditionalStatGrowthBonus(key, progression),
      equipment: 0,
      abilities: 0,
      extra: sys.additionalAttributes[key],
    };

    sys.additionalStatSources[key] = sources;
    sys.totals[key] = sumStatSources(sources);
    if (key === 'massCategory') {
      sys.totals.massCategory = Math.max(1, sys.totals.massCategory);
    }
  }
}

function ensureAttributeStatSources(
  sys: ShwNpcSystem,
): asserts sys is ShwNpcSystem & { attributeStatSources: ShwNpcSystem['attributeStatSources'] } {
  if (!sys.attributeStatSources) {
    sys.attributeStatSources = {} as ShwNpcSystem['attributeStatSources'];
  }
}

function syncAttributeStatSources(sys: ShwNpcSystem): void {
  ensureAttributeStatSources(sys);

  for (const k of STAT_KEYS) {
    const attr = sys.attributes[k];
    const rollBase = Math.floor(attr.value / 5);

    sys.attributeStatSources[k] = {
      value: {
        base: attr.value,
        equipment: 0,
        abilities: 0,
      },
      extra: {
        equipment: 0,
        abilities: 0,
        extra: attr.extra,
      },
      charBonus: {
        base: rollBase,
        equipment: 0,
        abilities: 0,
        extra: attr.charBonusBase ?? 0,
      },
      saveBonus: {
        base: rollBase,
        equipment: 0,
        abilities: 0,
        extra: attr.saveBonusBase ?? 0,
      },
    };
  }
}

function ensureSpeedStatSources(
  sys: ShwNpcSystem,
): asserts sys is ShwNpcSystem & { speedStatSources: ShwNpcSystem['speedStatSources'] } {
  if (!sys.speedStatSources) {
    sys.speedStatSources = {} as ShwNpcSystem['speedStatSources'];
  }
}

function syncSpeedStatSources(
  sys: ShwNpcSystem,
  progression: AttributeProgressionBonuses,
): void {
  ensureSpeedStatSources(sys);

  const base = NPC_DEFAULTS.utility.speed;
  const growth = progression.speedBonus;
  const sources: StatSourceValues = {
    base,
    growth,
    equipment: 0,
    abilities: 0,
    extra: sys.utility.speed - base - growth,
  };

  sys.utility.speedExtra = sources.extra;
  sys.speedStatSources = sources;
  sys.totals.speed = sumStatSources(sources);
}

export function prepareNpcDerivedData(sys: ShwNpcSystem) {
  ensureTotals(sys);

  const attrs = sys.attributes;

  sys.totals.health = sys.health.max;
  sys.totals.healthCoefficient = healthCoefficientValue(sys.health.max);

  for (const k of STAT_KEYS) {
    sys.totals[k] = attrs[k].value;
  }

  for (const k of STAT_KEYS) {
    const a = attrs[k];
    a.charBonus = (a.charBonusBase ?? 0) + Math.floor(a.value / 5);
    a.saveBonus = (a.saveBonusBase ?? 0) + Math.floor(a.value / 5);
    a.coefficient = attributeCoefficientValue(a.extra);
  }

  const progression = calculateAttributeProgressionBonuses(
    attrs as ShwActorSystem['attributes'],
    sys.totals,
    attrs.fortune.extra,
  );
  syncAdditionalStatSources(sys, progression);
  syncSpeedStatSources(sys, progression);
  syncAttributeStatSources(sys);
  syncBarrierValue(sys);
}
