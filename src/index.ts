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

// Хук для создания предметов: миграция данных
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Hooks.on('preCreateItem', (item: any, data: any, options: any) => {
  // Миграция устаревших данных consumable
  if (needsMigration(data)) {
    const migrated = migrateConsumableData(data);
    item.updateSource({ system: migrated.system });
  }

  // Управление стеком предметов при добавлении к актеру (skipStack обходит стекирование при дублировании)
  if (item.parent && item.parent instanceof ShwActor && !options?.skipStack) {
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
