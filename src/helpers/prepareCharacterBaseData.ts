import type { ShwActorSystem } from '../documents/ShwActor';

const STAT_KEYS = ['fortune', 'force', 'perception', 'psyDefence', 'diplomacy'] as const;
const UTIL_KEYS = [
   'actions',
   'reactions',
   'bonusActions',
   'impulses',
   'speed',
   'initiative',
] as const;

const emptyAttr = () => ({ value: 0, extra: 0, charBonus: 0, saveBonus: 0 });
const emptyUtilMap = {
   actions: 2,
   reactions: 0,
   bonusActions: 1,
   impulses: 0,
   speed: 20,
   initiative: 0,
};

export function prepareCharacterBaseData(sys: ShwActorSystem) {
   sys.health ??= {} as ShwActorSystem['health'];
   sys.health.max ??= 10;
   sys.health.value ??= 10;

   sys.speed ??= 20;
   sys.attributes ??= {} as ShwActorSystem['attributes'];
   sys.utility ??= {} as ShwActorSystem['utility'];

   for (const k of STAT_KEYS) sys.attributes[k] ??= emptyAttr();
   for (const k of UTIL_KEYS) sys.utility[k] ??= emptyUtilMap[k];
}
