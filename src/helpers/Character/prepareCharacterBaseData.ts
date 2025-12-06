import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';
import { ADDITIONAL_KEYS, HELPER_KEYS, STAT_KEYS, UTIL_KEYS } from '../constants';

const emptyAttr = () => ({ value: 0, extra: 0, charBonus: 0, saveBonus: 0 });
const emptyUtilMap = {
  actions: 2,
  reactions: 0,
  bonusActions: 1,
  impulses: 0,
  speed: 20,
  level: 1,
  initiative: 0,
};
const emptyAdditionalMap: ShwActorSystem['additionalAttributes'] = {
  actions: 2,
  bonusActions: 1,
  reactions: 0,
  impulse: 0,
  initiative: 0,
  range: 0,
  damageReduction: 0,
  armorClass: 0,
  additionalCloseCombatDamage: 0,
  additionalRangeDamage: 0,
};
const emptyHelperMap = {
  totalHealth: 0,
  totalImpulse: 0,
  totalSpeed: 0,
  totalFortune: 0,
  totalForce: 0,
  totalPerception: 0,
  totalPsyDefence: 0,
  totalDiplomacy: 0,
  totalActions: 0,
  totalBonusActions: 0,
  totalReactions: 0,
  totalInitiative: 0,
};

export function prepareCharacterBaseData(sys: ShwActorSystem) {
  sys.health ??= {} as ShwActorSystem['health'];
  sys.health.max ??= 10;
  sys.health.value ??= 10;

  sys.attributes ??= {} as ShwActorSystem['attributes'];
  sys.utility ??= {} as ShwActorSystem['utility'];
  sys.additionalAttributes ??= {} as ShwActorSystem['additionalAttributes'];
  sys.helpers ??= {} as ShwActorSystem['helpers'];

  for (const k of STAT_KEYS) sys.attributes[k] ??= emptyAttr();
  for (const k of UTIL_KEYS) sys.utility[k] ??= emptyUtilMap[k];
  for (const k of ADDITIONAL_KEYS) sys.additionalAttributes[k] ??= emptyAdditionalMap[k];
  for (const k of HELPER_KEYS) sys.helpers[k] ??= emptyHelperMap[k];
}
