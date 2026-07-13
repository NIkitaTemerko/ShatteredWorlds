import type { ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { migrateLegacyStatKeys } from '../migrateLegacyStatKeys';
import { ensureBarrierField } from '../Character/syncBarrierValue';

/** Runtime migration only — persisted init via TypeDataModel schema. */
export function prepareNpcBaseData(sys: ShwNpcSystem) {
  migrateLegacyStatKeys(sys);
  ensureBarrierField(sys);
}
