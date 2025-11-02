import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';
import { ADDITIONAL_KEYS, ATTR_RIM, STAT_KEYS } from '../constants';

function calculateAdditionalAttributes(
  attrs: ShwActorSystem['attributes'],
  isLevelAboveFive: boolean,
): Pick<
  ShwActorSystem['additionalAttributes'],
  | 'damageReduction'
  | 'additionalRangeDamage'
  | 'armorClass'
  | 'additionalCloseCombatDamage'
  | 'impulse'
> {
  return {
    damageReduction: isLevelAboveFive ? attrs.psyDefence.value : 0,
    additionalRangeDamage: isLevelAboveFive ? attrs.perception.value : 0,
    armorClass: isLevelAboveFive ? attrs.diplomacy.value : 0,
    additionalCloseCombatDamage: isLevelAboveFive ? attrs.force.value : 0,
    impulse: attrs?.force.value >= ATTR_RIM ? 1 : 0,
  };
}

function updateAttributeBonuses(attrs: ShwActorSystem['attributes']): void {
  for (const k of STAT_KEYS) {
    const a = attrs[k];
    a.charBonus = Math.floor(a.value / 5);
    a.saveBonus = Math.floor(a.value / 5);
  }
}

function updateHelpers(
  sys: ShwActorSystem,
  addAttrMap: ReturnType<typeof calculateAdditionalAttributes>,
): void {
  sys.helpers.totalImpulse += addAttrMap.impulse += sys.additionalAttributes.impulse;
  sys.helpers.totalHealth += sys.health.max;
  sys.helpers.totalSpeed += sys.utility.speed;
}

export function prepareCharacterDerivedData(sys: ShwActorSystem) {
  const attrs = sys.attributes;
  const isLevelAboveFive = sys.utility.level >= 5;

  const addAttrMap = calculateAdditionalAttributes(attrs, isLevelAboveFive);

  updateHelpers(sys, addAttrMap);

  for (const k of ADDITIONAL_KEYS) {
    if (k in addAttrMap && k in sys.additionalAttributes) {
      sys.additionalAttributes[k] += (addAttrMap as any)[k];
    }
  }

  updateAttributeBonuses(attrs);
}
