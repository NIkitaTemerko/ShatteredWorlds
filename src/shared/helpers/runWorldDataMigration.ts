import type { ShwActor } from '../../documents/Actor/ShwActor';
import type { ShwItem } from '../../documents/Item/ShwItem';
import { localize, t } from '../i18n';
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

const LIST_PREVIEW_LIMIT = 8;

interface MigrationEntity {
  id: string;
  name: string;
}

interface EmbeddedMigrationEntity extends MigrationEntity {
  actorName: string;
}

export interface MigrationPlan {
  actors: MigrationEntity[];
  embeddedItems: EmbeddedMigrationEntity[];
  worldItems: MigrationEntity[];
}

interface MigrationPayload {
  actorUpdates: { _id: string; system: Record<string, unknown> }[];
  embeddedUpdates: { actorId: string; items: { _id: string; system: Record<string, unknown> }[] }[];
  worldItemUpdates: { _id: string; system: Record<string, unknown> }[];
}

function getStoredSystem(document: { _source?: { system?: unknown } }): Record<string, unknown> {
  const system = document._source?.system;
  return foundry.utils.deepClone((system ?? {}) as Record<string, unknown>);
}

function collectMigrationPlan(): { plan: MigrationPlan; payload: MigrationPayload } {
  const plan: MigrationPlan = {
    actors: [],
    embeddedItems: [],
    worldItems: [],
  };
  const payload: MigrationPayload = {
    actorUpdates: [],
    embeddedUpdates: [],
    worldItemUpdates: [],
  };

  for (const actor of (game.actors?.contents ?? []) as ShwActor[]) {
    if (!actor.id) continue;

    const actorSystem = getStoredSystem(actor);
    if (actorSystemNeedsMigration(actorSystem)) {
      migrateActorSystem(actorSystem);
      plan.actors.push({ id: actor.id, name: actor.name });
      payload.actorUpdates.push({ _id: actor.id, system: actorSystem });
    }

    const itemUpdates: { _id: string; system: Record<string, unknown> }[] = [];

    for (const item of actor.items) {
      if (!item.id) continue;

      const itemSystem = getStoredSystem(item);
      if (!itemSystemNeedsMigration(itemSystem)) continue;

      migrateItemSystem(itemSystem);
      plan.embeddedItems.push({
        id: item.id,
        name: item.name,
        actorName: actor.name,
      });
      itemUpdates.push({ _id: item.id, system: itemSystem });
    }

    if (itemUpdates.length > 0) {
      payload.embeddedUpdates.push({ actorId: actor.id, items: itemUpdates });
    }
  }

  for (const item of (game.items?.contents ?? []) as ShwItem[]) {
    if (!item.id) continue;

    const itemSystem = getStoredSystem(item);
    if (!itemSystemNeedsMigration(itemSystem)) continue;

    migrateItemSystem(itemSystem);
    plan.worldItems.push({ id: item.id, name: item.name });
    payload.worldItemUpdates.push({ _id: item.id, system: itemSystem });
  }

  return { plan, payload };
}

function hasMigrationTargets(plan: MigrationPlan): boolean {
  return plan.actors.length > 0 || plan.embeddedItems.length > 0 || plan.worldItems.length > 0;
}

function renderEntityList(items: MigrationEntity[]): string {
  if (items.length === 0) return '';

  const preview = items.slice(0, LIST_PREVIEW_LIMIT);
  const lines = preview.map(
    (item) => `<li>${foundry.utils.escapeHTML(item.name)}</li>`,
  );

  if (items.length > LIST_PREVIEW_LIMIT) {
    lines.push(
      `<li><em>${localize('migration.data.andMore', {
        count: String(items.length - LIST_PREVIEW_LIMIT),
      })}</em></li>`,
    );
  }

  return `<ul>${lines.join('')}</ul>`;
}

function renderEmbeddedItemList(items: EmbeddedMigrationEntity[]): string {
  if (items.length === 0) return '';

  const preview = items.slice(0, LIST_PREVIEW_LIMIT);
  const lines = preview.map(
    (item) =>
      `<li>${foundry.utils.escapeHTML(item.name)} <span class="hint">(${foundry.utils.escapeHTML(item.actorName)})</span></li>`,
  );

  if (items.length > LIST_PREVIEW_LIMIT) {
    lines.push(
      `<li><em>${localize('migration.data.andMore', {
        count: String(items.length - LIST_PREVIEW_LIMIT),
      })}</em></li>`,
    );
  }

  return `<ul>${lines.join('')}</ul>`;
}

function buildMigrationDialogContent(plan: MigrationPlan): string {
  const sections: string[] = [`<p>${t('migration.data.intro')}</p>`];

  if (plan.actors.length > 0) {
    sections.push(
      `<p><strong>${localize('migration.data.actors', {
        count: String(plan.actors.length),
      })}</strong></p>`,
      renderEntityList(plan.actors),
    );
  }

  if (plan.embeddedItems.length > 0) {
    sections.push(
      `<p><strong>${localize('migration.data.embeddedItems', {
        count: String(plan.embeddedItems.length),
      })}</strong></p>`,
      renderEmbeddedItemList(plan.embeddedItems),
    );
  }

  if (plan.worldItems.length > 0) {
    sections.push(
      `<p><strong>${localize('migration.data.worldItems', {
        count: String(plan.worldItems.length),
      })}</strong></p>`,
      renderEntityList(plan.worldItems),
    );
  }

  return sections.join('');
}

async function confirmMigration(plan: MigrationPlan): Promise<boolean> {
  const confirmed = await Dialog.confirm({
    title: t('migration.data.title'),
    content: buildMigrationDialogContent(plan),
    defaultYes: true,
  });

  return confirmed === true;
}

async function applyMigration(payload: MigrationPayload): Promise<void> {
  if (payload.actorUpdates.length > 0) {
    await Actor.updateDocuments(payload.actorUpdates);
  }

  for (const { actorId, items } of payload.embeddedUpdates) {
    const actor = game.actors?.get(actorId) as ShwActor | undefined;
    if (!actor) continue;
    await actor.updateEmbeddedDocuments('Item', items);
  }

  if (payload.worldItemUpdates.length > 0) {
    await Item.updateDocuments(payload.worldItemUpdates);
  }
}

/** Мигрирует сохранённые данные мира со старых ключей статов. Вызывается один раз при ready. */
export async function runWorldDataMigration(): Promise<void> {
  if (!game.user?.isGM) return;

  const appliedVersion = game.settings?.get(SETTINGS_NAMESPACE, SETTING_DATA_MIGRATION_VERSION) ?? 0;
  if (appliedVersion >= CURRENT_DATA_MIGRATION_VERSION) return;

  const { plan, payload } = collectMigrationPlan();

  if (hasMigrationTargets(plan)) {
    const confirmed = await confirmMigration(plan);
    if (!confirmed) return;

    await applyMigration(payload);

    await game.settings?.set(
      SETTINGS_NAMESPACE,
      SETTING_DATA_MIGRATION_VERSION,
      CURRENT_DATA_MIGRATION_VERSION,
    );

    ui.notifications?.info(t('migration.data.success'));

    console.log(
      `Shattered Worlds: migrated legacy stat keys in ${plan.actors.length} actor(s), ${plan.embeddedItems.length} embedded item(s), ${plan.worldItems.length} world item(s).`,
    );
    return;
  }

  await game.settings?.set(
    SETTINGS_NAMESPACE,
    SETTING_DATA_MIGRATION_VERSION,
    CURRENT_DATA_MIGRATION_VERSION,
  );
}
