import type { ShwActor } from '../../documents/Actor/ShwActor';
import type { ShwItem } from '../../documents/Item/ShwItem';
import {
  CURRENT_DATA_MIGRATION_VERSION,
  SETTING_DATA_MIGRATION_VERSION,
  SETTINGS_NAMESPACE,
} from '../../modules/settings/model/constants';
import {
  actorSystemNeedsMigration,
  itemSystemNeedsMigration,
  migrateActorSystem,
  migrateItemSystem,
} from './migrateLegacyStatKeys';

function getStoredSystem(document: { _source?: { system?: unknown } }): Record<string, unknown> {
  const system = document._source?.system;
  return foundry.utils.deepClone((system ?? {}) as Record<string, unknown>);
}

async function migrateActors(): Promise<number> {
  const actors = (game.actors?.contents ?? []) as ShwActor[];
  const updates: { _id: string; system: Record<string, unknown> }[] = [];

  for (const actor of actors) {
    if (!actor.id) continue;

    const system = getStoredSystem(actor);
    if (!actorSystemNeedsMigration(system)) continue;

    migrateActorSystem(system);
    updates.push({ _id: actor.id, system });
  }

  if (updates.length === 0) return 0;

  await Actor.updateDocuments(updates);
  return updates.length;
}

async function migrateEmbeddedItems(): Promise<number> {
  const actors = (game.actors?.contents ?? []) as ShwActor[];
  let migratedCount = 0;

  for (const actor of actors) {
    const itemUpdates: { _id: string; system: Record<string, unknown> }[] = [];

    for (const item of actor.items) {
      if (!item.id) continue;

      const system = getStoredSystem(item);
      if (!itemSystemNeedsMigration(system)) continue;

      migrateItemSystem(system);
      itemUpdates.push({ _id: item.id, system });
    }

    if (itemUpdates.length === 0) continue;

    await actor.updateEmbeddedDocuments('Item', itemUpdates);
    migratedCount += itemUpdates.length;
  }

  return migratedCount;
}

async function migrateWorldItems(): Promise<number> {
  const items = (game.items?.contents ?? []) as ShwItem[];
  const updates: { _id: string; system: Record<string, unknown> }[] = [];

  for (const item of items) {
    if (!item.id) continue;

    const system = getStoredSystem(item);
    if (!itemSystemNeedsMigration(system)) continue;

    migrateItemSystem(system);
    updates.push({ _id: item.id, system });
  }

  if (updates.length === 0) return 0;

  await Item.updateDocuments(updates);
  return updates.length;
}

/** Мигрирует сохранённые данные мира со старых ключей статов. Вызывается один раз при ready. */
export async function runWorldDataMigration(): Promise<void> {
  if (!game.user?.isGM) return;

  const appliedVersion = game.settings?.get(SETTINGS_NAMESPACE, SETTING_DATA_MIGRATION_VERSION) ?? 0;

  if (appliedVersion >= CURRENT_DATA_MIGRATION_VERSION) return;

  const migratedActors = await migrateActors();
  const migratedEmbeddedItems = await migrateEmbeddedItems();
  const migratedWorldItems = await migrateWorldItems();
  const migratedTotal = migratedActors + migratedEmbeddedItems + migratedWorldItems;

  await game.settings?.set(
    SETTINGS_NAMESPACE,
    SETTING_DATA_MIGRATION_VERSION,
    CURRENT_DATA_MIGRATION_VERSION,
  );

  if (migratedTotal > 0) {
    console.log(
      `Shattered Worlds: migrated legacy stat keys in ${migratedActors} actor(s), ${migratedEmbeddedItems} embedded item(s), ${migratedWorldItems} world item(s).`,
    );
  }
}
