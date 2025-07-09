import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';

const STAT_KEYS = ['fortune', 'force', 'perception', 'psyDefence', 'diplomacy'] as const;
const UTIL_KEYS = ['speed', 'level'] as const;
const ADDITIONAL_KEYS = [
   'actions',
   'bonusActions',
   'reactions',
   'impulse',
   'damage',
   'range',
   'discount',
   'initiative',
   'damageReduction',
   'armorClass',
   'aoeResist',
] as const;
const HELPER_KEYS = ['totalHealth', 'totalImpulse', 'totalSpeed'] as const;

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
const emptyAdditionalMap = {
   actions: 2,
   bonusActions: 1,
   reactions: 0,
   impulse: 0,
   initiative: 0,
   damage: 0,
   range: 0,
   discount: 0,
   damageReduction: 0,
   armorClass: 0,
   aoeResist: 0,
};
const emptyHelperMap = {
   totalHealth: 0,
   totalImpulse: 0,
   totalSpeed: 0,
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
