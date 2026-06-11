import type { ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { STAT_KEYS } from '../../model/constants/actorKeys';

export function prepareNpcDerivedData(sys: ShwNpcSystem) {
  const attrs = sys.attributes;
  const add = sys.additionalAttributes;

  sys.helpers.totalImpulse += add.impulse;
  sys.helpers.totalHealth += sys.health.max;
  sys.helpers.totalSpeed += sys.utility.speed;
  sys.helpers.totalDamageReduction += add.damageReduction;
  sys.helpers.totalArmorClass += add.armorClass;
  sys.helpers.totalRange += add.range;

  for (const k of STAT_KEYS) {
    const a = attrs[k];
    a.charBonus = (a.charBonusBase ?? 0) + Math.floor(a.value / 5);
    a.saveBonus = (a.saveBonusBase ?? 0) + Math.floor(a.value / 5);
  }
}
