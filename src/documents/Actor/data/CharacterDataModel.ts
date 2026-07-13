import { prepareCharacterBaseData } from '../../../shared/helpers/Character/prepareCharacterBaseData';
import { prepareCharacterDerivedData } from '../../../shared/helpers/Character/prepareCharacterDerivedData';
import { migrateLegacyStatKeys } from '../../../shared/helpers/migrateLegacyStatKeys';
import type { ShwActor } from '../ShwActor';
import type { ShwActorSystem } from '../types/ShwActorSystem';
import {
  additionalAttributesSchema,
  barrierSchema,
  characterAttributesSchema,
  healthSchema,
  utilitySchema,
} from './actorSchema';

/** Persisted actor data; totals — runtime-only (prepareDerivedData). */
export class CharacterDataModel extends foundry.abstract.TypeDataModel<any, ShwActor<'character'>> {
  static defineSchema() {
    return {
      health: healthSchema(),
      barrier: barrierSchema(),
      attributes: characterAttributesSchema(),
      additionalAttributes: additionalAttributesSchema(),
      utility: utilitySchema(),
    };
  }

  static override migrateData(source: Record<string, unknown>) {
    migrateLegacyStatKeys(source);
    return super.migrateData(source);
  }

  override prepareBaseData() {
    prepareCharacterBaseData(this as unknown as ShwActorSystem);
  }

  override prepareDerivedData() {
    prepareCharacterDerivedData(this as unknown as ShwActorSystem, this.parent);
  }
}
