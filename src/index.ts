import { ShwActor } from './documents/Actor/ShwActor';
import { ShwItem } from './documents/Item/ShwItem';
import { ShwTokenDocument } from './documents/ShwTokenDocument.js';
import { initSettingsHooks, registerSettings, ShwSettingsApp } from './modules/settings';
import { ShopManagerApp } from './modules/shop';
import { ensureFolderStructure, getTargetFolderId, handleAddItem } from './shared/helpers/Item';
import { AbilityItemApp } from './view/AbilityItem/ItemApp';
import { CharacterApp } from './view/BaseCharacter/CharacterApp.js';
import { ConsumableItemApp } from './view/ConsumableItem/ItemApp';
import { EquipmentItemApp } from './view/EquipmentItem/ItemApp';
import { NpcApp } from './view/NpcCharacter/NpcApp';
import { ResourceItemApp } from './view/ResourceItem/ItemApp';
import { SpellItemApp } from './view/SpellItem/ItemApp';
import './main.css';

type GlobalLimits = {
  MIN_WINDOW_HEIGHT: number;
  MIN_WINDOW_WIDTH: number;
};

const globalWithLimits = globalThis as typeof globalThis & Partial<GlobalLimits>;
globalWithLimits.MIN_WINDOW_HEIGHT = 200;
globalWithLimits.MIN_WINDOW_WIDTH = 200;

Hooks.once('init', () => {
  CONFIG.Actor.documentClass = ShwActor;
  CONFIG.Item.documentClass = ShwItem;
  CONFIG.Token.documentClass = ShwTokenDocument;
  CONFIG.Combat.initiative = {
    formula: '1d20 + @initiative',
    decimals: 0,
  };

  registerSettings(ShwSettingsApp);
  initSettingsHooks();

  // Создаём структуру папок при старте мира
  Hooks.once('ready', async () => {
    await ensureFolderStructure();
  });

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
      importButton.addEventListener('click', async () => {
        const { ImportItemsApp } = await import('./modules/itemImport');
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
  foundry.documents.collections.Items.registerSheet('shw', EquipmentItemApp, {
    types: ['equipment'],
    makeDefault: true,
  });
  foundry.documents.collections.Items.registerSheet('shw', ResourceItemApp, {
    types: ['resource'],
    makeDefault: true,
  });
});

/**
 * Автолинк токенов для персонажей.
 * @see https://foundryvtt.com/api/v12/classes/client.TokenDocument.html#updateSource
 */
Hooks.on('preCreateToken', (tokenDocument: any, tokenData: any) => {
  const actor = tokenData.actorId
    ? (game.actors?.get(tokenData.actorId) as ShwActor | undefined)
    : undefined;

  if (actor?.type === 'character') {
    tokenDocument.updateSource({ actorLink: true });
  }
});

/**
 * Хук для создания предметов: миграция данных и стекирование.
 * @see https://foundryvtt.com/api/v12/classes/client.Item.html#_preCreate
 */
Hooks.on('preCreateItem', (item: any, data: any, options: any) => {
  const createdItem = item as ShwItem;

  // Автоназначение папки для глобальных предметов (не owned)
  if (!createdItem.parent) {
    const folderId = getTargetFolderId(createdItem.type, createdItem.system as any);
    if (folderId && !data.folder) {
      createdItem.updateSource({ folder: folderId });
    }
  }

  // Управление стеком предметов при добавлении к актеру (skipStack обходит стекирование при дублировании)
  if (createdItem.parent && createdItem.parent instanceof ShwActor && !options?.skipStack) {
    const result = handleAddItem(createdItem.parent, {
      type: createdItem.type,
      name: createdItem.name,
      system: createdItem.system as any,
    });

    if (result === 'stacked' || result === 'blocked') {
      return false;
    }
  }
});
