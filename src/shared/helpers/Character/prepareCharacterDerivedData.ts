import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import type { CharacterStatPath } from '../../model/characterStatPaths';
import { STAT_KEYS } from '../../model/constants/actorKeys';
import {
  ADDITIONAL_STAT_KEYS,
  type AdditionalStatBaseKey,
  additionalTotal,
} from '../../model/constants/characterDefaults';
import {
  applyComputedResourceFields,
  calculateAttributeProgressionBonuses,
} from './attributeProgression';
import {
  applyManualItemBonuses,
  calculateItemBonuses,
  getItemBonus,
  sumItemBonuses,
} from './calculateItemBonuses';

function ensureTotals(
  sys: ShwActorSystem,
): asserts sys is ShwActorSystem & { totals: ShwActorSystem['totals'] } {
  if (!sys.totals) {
    sys.totals = {} as ShwActorSystem['totals'];
  }
}

function progressionBonusFor(
  key: Exclude<AdditionalStatBaseKey, 'damageReduction'>,
  progression: ReturnType<typeof calculateAttributeProgressionBonuses>,
): number {
  if (key === 'actions') return 0;
  return progression[key];
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

function syncResourceTotals(
  sys: ShwActorSystem,
  progression: ReturnType<typeof calculateAttributeProgressionBonuses>,
  totalsDirectBonuses: Map<CharacterStatPath, number>,
): void {
  const add = sys.additionalAttributes;

  applyComputedResourceFields(sys, progression);

  sys.health.max += sumItemBonuses(totalsDirectBonuses, ['health.max', 'totals.health']);
  sys.utility.speed += sumItemBonuses(totalsDirectBonuses, ['utility.speed', 'totals.speed']);

  for (const key of ADDITIONAL_STAT_KEYS) {
    if (key === 'damageReduction') continue;
    const directBonus = getItemBonus(totalsDirectBonuses, `totals.${key}`);
    sys.totals[key] =
      additionalTotal(key, add[key], progressionBonusFor(key, progression)) + directBonus;
  }

  sys.totals.health = sys.health.max;
  sys.totals.speed = sys.utility.speed;
}

function syncWillDependentTotals(
  sys: ShwActorSystem,
  totalsDirectBonuses: Map<CharacterStatPath, number>,
): void {
  const willAbsorption = sys.utility.level >= 5 ? sys.totals.will : 0;
  const directBonus = getItemBonus(totalsDirectBonuses, 'totals.damageReduction');
  sys.totals.damageReduction =
    additionalTotal('damageReduction', sys.additionalAttributes.damageReduction, willAbsorption) +
    directBonus;
}

function updateAttributeBonuses(
  totals: ShwActorSystem['totals'],
  attributes: ShwActorSystem['attributes'],
  bonuses: Map<CharacterStatPath, number>,
): void {
  for (const k of STAT_KEYS) {
    const a = attributes[k];
    const fromTotal = Math.floor(totals[k] / 5);
    a.charBonus = fromTotal + getItemBonus(bonuses, `attributes.${k}.charBonus`);
    a.saveBonus = fromTotal + getItemBonus(bonuses, `attributes.${k}.saveBonus`);
  }
}

export function prepareCharacterDerivedData(sys: ShwActorSystem, actor: ShwActor<'character'>) {
  ensureTotals(sys);

  for (const k of STAT_KEYS) {
    sys.attributes[k].extra = 0;
  }

  const { bonuses } = calculateItemBonuses(actor);
  applyManualItemBonuses(sys, bonuses);

  const progression = calculateAttributeProgressionBonuses(sys.attributes);

  syncAttributeTotals(sys, bonuses);
  syncResourceTotals(sys, progression, bonuses);
  syncWillDependentTotals(sys, bonuses);
  updateAttributeBonuses(sys.totals, sys.attributes, bonuses);
}
