import type { ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { ADDITIONAL_KEYS, STAT_KEYS, UTIL_KEYS } from '../../model/constants/actorKeys';
import { NPC_DEFAULTS, NPC_HELPER_KEYS } from '../../model/constants/npcDefaults';

/** Фабрика для создания пустого NPC-атрибута (каждый вызов — новый объект) */
const createEmptyNpcAttr = () => ({
  value: 0,
  extra: 0,
  charBonus: 0,
  saveBonus: 0,
  charBonusBase: 0,
  saveBonusBase: 0,
});

export function prepareNpcBaseData(sys: ShwNpcSystem) {
  sys.health ??= {} as ShwNpcSystem['health'];
  sys.health.max ??= 10;
  sys.health.value ??= 10;

  sys.attributes ??= {} as ShwNpcSystem['attributes'];
  sys.utility ??= {} as ShwNpcSystem['utility'];
  sys.additionalAttributes ??= {} as ShwNpcSystem['additionalAttributes'];
  sys.helpers ??= {} as ShwNpcSystem['helpers'];

  for (const k of STAT_KEYS) sys.attributes[k] ??= createEmptyNpcAttr();
  for (const k of UTIL_KEYS) sys.utility[k] ??= NPC_DEFAULTS.utility[k];
  for (const k of ADDITIONAL_KEYS)
    sys.additionalAttributes[k] ??= NPC_DEFAULTS.additionalAttributes[k];
  for (const k of NPC_HELPER_KEYS) {
    (sys.helpers as unknown as Record<string, number>)[k] ??= NPC_DEFAULTS.helpers[k];
  }
}
