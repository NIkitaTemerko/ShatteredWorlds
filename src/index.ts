import { ShwActor } from './documents/Actor/ShwActor';
import { ShwItem } from './documents/Item/ShwItem';
import { ShwTokenDocument } from './documents/ShwTokenDocument.js';
import { ImportItemsApp } from './features/itemImport';
import { migrateConsumableData, needsMigration } from './helpers/Item/migrateConsumableData';
import { handleAddItem } from './helpers/Item/StackManager';
import { ShopManagerApp } from './modules/shop';
import { AbilityItemApp } from './view/AbilityItem/ItemApp';
import { CharacterApp } from './view/BaseCharacter/CharacterApp.js';
import { ConsumableItemApp } from './view/ConsumableItem/ItemApp';
import { NpcApp } from './view/NpcCharacter/NpcApp';
import { SpellItemApp } from './view/SpellItem/ItemApp';
import './main.css';

(globalThis as any).MIN_WINDOW_HEIGHT = 200;
(globalThis as any).MIN_WINDOW_WIDTH = 200;

Hooks.once('init', () => {
  //@ts-expect-error
  CONFIG.Actor.documentClass = ShwActor;
  //@ts-expect-error
  CONFIG.Item.documentClass = ShwItem;
  CONFIG.Token.documentClass = ShwTokenDocument;
  CONFIG.Combat.initiative = {
    formula: '1d20 + @initiative',
    decimals: 0,
  };

  // Добавляем кнопки магазина и импорта в навигацию
  Hooks.once('ready', () => {
    const menu = document.querySelector('nav.tabs.faded-ui menu');
    if (menu) {
      // Кнопка магазина
      const shopLi = document.createElement('li');
      const shopButton = document.createElement('button');
      shopButton.type = 'button';
      shopButton.className = 'ui-control plain icon fa-solid fa-store';
      shopButton.addEventListener('click', () => {
        new ShopManagerApp().render(true);
      });
      shopLi.appendChild(shopButton);

      // Кнопка импорта
      const importLi = document.createElement('li');
      const importButton = document.createElement('button');
      importButton.type = 'button';
      importButton.className = 'ui-control plain icon fa-solid fa-file-import';
      importButton.addEventListener('click', () => {
        new ImportItemsApp().render(true);
      });
      importLi.appendChild(importButton);

      const lastItem = menu.lastElementChild;
      if (lastItem) {
        menu.insertBefore(importLi, lastItem);
        menu.insertBefore(shopLi, importLi);
      } else {
        menu.appendChild(shopLi);
        menu.appendChild(importLi);
      }
    }
  });
});

Hooks.once('setup', () => {
  foundry.documents.collections.Actors.registerSheet('shw', CharacterApp, {
    types: ['character'],
    makeDefault: true,
  });
  foundry.documents.collections.Actors.registerSheet('shw', NpcApp, {
    types: ['npc'],
    makeDefault: true,
  });
  foundry.documents.collections.Items.registerSheet('shw', ConsumableItemApp, {
    types: ['consumable'],
    makeDefault: true,
  });
  foundry.documents.collections.Items.registerSheet('shw', AbilityItemApp, {
    types: ['ability'],
    makeDefault: true,
  });
  foundry.documents.collections.Items.registerSheet('shw', SpellItemApp, {
    types: ['spell'],
    makeDefault: true,
  });
});

Hooks.on('preCreateToken', (tokenDocument: any, tokenData: any) => {
  const actor = (game as any).actors.get(tokenData.actorId);
  if (actor?.type === 'character') {
    tokenDocument.updateSource({ actorLink: true });
  }
});

// Хук для создания предметов: миграция данных и отслеживание связи с глобальным предметом
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Hooks.on('preCreateItem', (item: any, data: any, options: any) => {
  // Миграция устаревших данных consumable
  if (needsMigration(data)) {
    const migrated = migrateConsumableData(data);
    item.updateSource({ system: migrated.system });
  }

  // Отслеживание связи с глобальным предметом при добавлении к актеру
  if (item.parent && item.parent instanceof ShwActor) {
    const originItemId = findOriginItem(item, options);

    if (originItemId) {
      item.updateSource({ 'flags.shw.originItemId': originItemId });
    }

    // Управление стеком предметов
    const result = handleAddItem(item.parent, {
      type: item.type,
      name: item.name,
      system: item.system,
    });

    if (result === 'stacked' || result === 'blocked') {
      return false;
    }
  }
});

/**
 * Найти ID глобального предмета-источника для синхронизации
 * Стратегии поиска:
 * 1. Явный originItemId в options
 * 2. Поиск по baseId
 * 3. Поиск по имени + типу (для drag-drop)
 */
function findOriginItem(item: any, options: any): string | undefined {
  // Явно указанный ID
  if (options?.originItemId) {
    return options.originItemId;
  }

  const globalItems = (game as any).items;
  if (!globalItems) return undefined;

  // Поиск по baseId
  if (item.system?.baseId) {
    const byBaseId = globalItems.find(
      (gi: any) => gi.system?.baseId === item.system.baseId && gi.type === item.type,
    );
    if (byBaseId) return byBaseId.id;
  }

  // Поиск по имени + типу (для drag-drop из директории Items)
  const byName = globalItems.find((gi: any) => gi.name === item.name && gi.type === item.type);

  return byName?.id;
}

// Двунаправленная синхронизация предметов: owned ↔ global
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Hooks.on('updateItem', async (item: any, changes: any, options: any) => {
  if (options?.skipSync) return;

  // Случай 1: Обновление owned предмета → синхронизация в глобальный
  if (item.parent && item.parent instanceof ShwActor) {
    await syncOwnedToGlobal(item, changes);
    return;
  }

  // Случай 2: Обновление глобального предмета → синхронизация во все owned копии
  if (!item.parent) {
    await syncGlobalToOwned(item, changes);
  }
});

/**
 * Синхронизация изменений от owned предмета к глобальному источнику
 */
async function syncOwnedToGlobal(item: any, changes: any): Promise<void> {
  const originItemId = item.flags?.shw?.originItemId;
  if (!originItemId) return;

  const globalItem = (game as any).items?.get(originItemId);
  if (globalItem) {
    await globalItem.update(changes, { fromOwnedSync: true });
  }
}

/**
 * Синхронизация изменений от глобального предмета ко всем owned копиям
 */
async function syncGlobalToOwned(item: any, changes: any): Promise<void> {
  const actors = (game as any).actors;
  if (!actors) return;

  const ownedCopies = findOwnedCopies(actors, item.id);

  if (ownedCopies.length === 0) return;

  // Обновление всех owned копий
  for (const { actor, itemId } of ownedCopies) {
    // Убираем _id из changes, чтобы не перезаписать ID owned предмета
    const { _id, ...changesWithoutId } = changes;

    await actor.updateEmbeddedDocuments('Item', [{ _id: itemId, ...changesWithoutId }], {
      skipSync: true, // Предотвращаем бесконечную рекурсию
    });
  }
}

/**
 * Найти все owned копии глобального предмета
 */
function findOwnedCopies(actors: any, globalItemId: string): Array<{ actor: any; itemId: string }> {
  const copies: Array<{ actor: any; itemId: string }> = [];

  for (const actor of actors) {
    for (const ownedItem of actor.items) {
      if (ownedItem.flags?.shw?.originItemId === globalItemId) {
        copies.push({ actor, itemId: ownedItem.id });
      }
    }
  }

  return copies;
}

// Batch migrate existing items on world initialization (one-time on world load)
Hooks.once('setup', async () => {
  const items = (game as any).items;
  if (!items || items.size === 0) return;

  let migratedCount = 0;
  const itemsToMigrate: any[] = [];

  // Collect items that need migration
  for (const item of items) {
    if (needsMigration(item)) {
      itemsToMigrate.push(item);
      migratedCount++;
    }
  }

  // Batch update all at once
  if (migratedCount > 0) {
    const updates = itemsToMigrate.map((item) => {
      const migrated = migrateConsumableData(item);
      return {
        _id: item.id,
        system: migrated.system,
      };
    });

    await Item.updateDocuments(updates);
    console.log(`[SHW Migration] Migrated ${migratedCount} consumable items to flat structure`);
  }
});
