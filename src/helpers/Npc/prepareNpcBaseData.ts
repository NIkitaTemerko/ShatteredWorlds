import type { ShwActorSystem, ShwNpcSystem } from '../../documents/Actor/types/ShwActorSystem';
import { ADDITIONAL_KEYS, STAT_KEYS, UTIL_KEYS } from '../constants';

const NPC_HELPER_KEYS: (keyof ShwNpcSystem['helpers'])[] = [
  'totalImpulse',
  'totalHealth',
  'totalSpeed',
  'totalDamageReduction',
  'totalArmorClass',
  'totalRange',
];

const emptyAttr = () => ({
  value: 0,
  extra: 0,
  charBonus: 0,
  saveBonus: 0,
  charBonusBase: 0,
  saveBonusBase: 0,
});
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
  totalImpulse: 0,
  totalHealth: 0,
  totalSpeed: 0,
  totalDamageReduction: 0,
  totalArmorClass: 0,
  totalRange: 0,
};

export function prepareNpcBaseData(sys: ShwNpcSystem) {
  sys.health ??= {} as ShwNpcSystem['health'];
  sys.health.max ??= 10;
  sys.health.value ??= 10;

  sys.attributes ??= {} as ShwNpcSystem['attributes'];
  sys.utility ??= {} as ShwNpcSystem['utility'];
  sys.additionalAttributes ??= {} as ShwNpcSystem['additionalAttributes'];
  sys.helpers ??= {} as ShwNpcSystem['helpers'];

  for (const k of STAT_KEYS) sys.attributes[k] ??= emptyAttr();
  for (const k of UTIL_KEYS) sys.utility[k] ??= emptyUtilMap[k];
  for (const k of ADDITIONAL_KEYS) sys.additionalAttributes[k] ??= emptyAdditionalMap[k];
  for (const k of NPC_HELPER_KEYS) sys.helpers[k] ??= emptyHelperMap[k];
}
