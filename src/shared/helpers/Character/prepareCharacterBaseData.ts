import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import {
  ADDITIONAL_KEYS,
  HELPER_KEYS,
  STAT_KEYS,
  UTIL_KEYS,
} from '../../model/constants/actorKeys';
import { CHAR_DEFAULTS } from '../../model/constants/characterDefaults';

const createEmptyAttr = () => ({ value: 0, extra: 0, charBonus: 0, saveBonus: 0 });

export function prepareCharacterBaseData(sys: ShwActorSystem) {
  sys.health ??= {} as ShwActorSystem['health'];
  sys.health.max ??= 10;
  sys.health.value ??= 10;

  sys.attributes ??= {} as ShwActorSystem['attributes'];
  sys.utility ??= {} as ShwActorSystem['utility'];
  sys.additionalAttributes ??= {} as ShwActorSystem['additionalAttributes'];
  sys.helpers ??= {} as ShwActorSystem['helpers'];

  for (const k of STAT_KEYS) sys.attributes[k] ??= createEmptyAttr();
  for (const k of UTIL_KEYS) sys.utility[k] ??= CHAR_DEFAULTS.utility[k];
  for (const k of ADDITIONAL_KEYS)
    sys.additionalAttributes[k] ??= CHAR_DEFAULTS.additionalAttributes[k];
  for (const k of HELPER_KEYS) sys.helpers[k] ??= CHAR_DEFAULTS.helpers[k];
}
