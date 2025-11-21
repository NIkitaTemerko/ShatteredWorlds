import type { ShwNpcSystem } from '../../documents/Actor/types/ShwActorSystem';
import { ADDITIONAL_KEYS, ATTR_RIM, STAT_KEYS } from '../constants';

export function prepareNpcDerivedData(sys: ShwNpcSystem) {
  const attrs = sys.attributes;
  const add = sys.additionalAttributes;
  const isLevelAboveFive = sys.utility.level >= 5;

  const addAttrMap = {
    damageReduction: isLevelAboveFive ? attrs.psyDefence.value : 0,
    additionalRangeDamage: isLevelAboveFive ? attrs.perception.value : 0,
    armorClass: isLevelAboveFive ? attrs.diplomacy.value : 0,
    additionalCloseCombatDamage: isLevelAboveFive ? attrs.force.value : 0,
    impulse: attrs?.force.value >= ATTR_RIM ? 1 : 0,
  };

  sys.helpers.totalImpulse += addAttrMap.impulse + add.impulse;
  sys.helpers.totalHealth += sys.health.max;
  sys.helpers.totalSpeed += sys.utility.speed;
  sys.helpers.totalDamageReduction +=
    addAttrMap.damageReduction +
    add.damageReduction +
    Math.floor((sys.attributes?.psyDefence?.extra ?? 0) / 4);
  sys.helpers.totalArmorClass += addAttrMap.armorClass + add.armorClass;
  sys.helpers.totalRange += add.range;

  for (const k of ADDITIONAL_KEYS) {
    if (k === 'damageReduction' || k === 'impulse' || k === 'armorClass') {
      continue;
    }
    if (k in addAttrMap && k in sys.additionalAttributes) {
      sys.additionalAttributes[k] += (addAttrMap as ShwNpcSystem['additionalAttributes'])[k];
    }
  }

  for (const k of STAT_KEYS) {
    const a = attrs[k];
    a.charBonus = (a.charBonusBase ?? 0) + Math.floor(a.value / 5);
    a.saveBonus = (a.saveBonusBase ?? 0) + Math.floor(a.value / 5);
  }
}
