import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { migrateLegacyStatKeys } from '../migrateLegacyStatKeys';
import { ensureBarrierField } from './syncBarrierValue';

/** Runtime migration only — persisted init via TypeDataModel schema. */
export function prepareCharacterBaseData(sys: ShwActorSystem) {
  migrateLegacyStatKeys(sys);
  ensureBarrierField(sys);
}
