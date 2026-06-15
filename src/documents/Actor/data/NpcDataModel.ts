import { migrateLegacyStatKeys } from '../../../shared/helpers/migrateLegacyStatKeys';
import { prepareNpcBaseData } from '../../../shared/helpers/Npc/prepareNpcBaseData';
import { prepareNpcDerivedData } from '../../../shared/helpers/Npc/prepareNpcDerivedData';
import type { ShwActor } from '../ShwActor';
import type { ShwNpcSystem } from '../types/ShwActorSystem';
import {
  additionalAttributesSchema,
  healthSchema,
  npcAttributesSchema,
  npcUtilitySchema,
} from './actorSchema';

/** Persisted NPC data; totals — runtime-only (prepareDerivedData). */
export class NpcDataModel extends foundry.abstract.TypeDataModel<any, ShwActor<'npc'>> {
  static defineSchema() {
    return {
      health: healthSchema(),
      attributes: npcAttributesSchema(),
      additionalAttributes: additionalAttributesSchema(),
      utility: npcUtilitySchema(),
    };
  }

  static override migrateData(source: Record<string, unknown>) {
    migrateLegacyStatKeys(source);
    return super.migrateData(source);
  }

  override prepareBaseData() {
    prepareNpcBaseData(this as unknown as ShwNpcSystem);
  }

  override prepareDerivedData() {
    prepareNpcDerivedData(this as unknown as ShwNpcSystem);
  }
}
