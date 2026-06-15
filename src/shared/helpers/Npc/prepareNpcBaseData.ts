import type { ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { migrateLegacyStatKeys } from '../migrateLegacyStatKeys';

/** Runtime migration only — persisted init via TypeDataModel schema. */
export function prepareNpcBaseData(sys: ShwNpcSystem) {
  migrateLegacyStatKeys(sys);
}
