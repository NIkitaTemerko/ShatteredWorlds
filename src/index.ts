import { CharacterDataModel, NpcDataModel } from './documents/Actor/data';
import { ShwActor } from './documents/Actor/ShwActor';
import { ItemFactory, isResourceDefaultImage } from './documents/Item/ItemFactory';
import { ShwItem } from './documents/Item/ShwItem';
import { ShwTokenDocument } from './documents/ShwTokenDocument.js';
import { getCategoryColor, getTypeIcon } from './entities/resource';
import { initSettingsHooks, registerSettings, ShwSettingsApp } from './modules/settings';
import { ShopManagerApp } from './modules/shop';
import { registerShopSettings } from './modules/shop/model/registerShopSettings';
import { ensureFolderStructure, getTargetFolderId, handleAddItem } from './shared/helpers/Item';
import { runWorldDataMigration } from './shared/helpers/runWorldDataMigration';
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
  CONFIG.Actor.dataModels = {
    character: CharacterDataModel,
    npc: NpcDataModel,
  };
  CONFIG.Item.documentClass = ShwItem;
  CONFIG.Token.documentClass = ShwTokenDocument;
  CONFIG.Combat.initiative = {
    formula: '1d20 + @initiative',
    decimals: 0,
  };

  registerSettings(ShwSettingsApp);
  registerShopSettings();
  initSettingsHooks();

  // Создаём структуру папок и мигрируем данные при старте мира
  Hooks.once('ready', async () => {
    await runWorldDataMigration();
    await ensureFolderStructure();
  });

  // Заменяем дефолтные img ресурсов на FA-иконки в сайдбаре предметов
  // biome-ignore lint/suspicious/noExplicitAny: Foundry hook API не типизирован
  Hooks.on('renderItemDirectory', (_app: any, element: HTMLElement) => {
    // biome-ignore lint/suspicious/noExplicitAny: Foundry game.items не типизирован
    const allItems = (game as any).items as Collection<ShwItem> | undefined;
    if (!allItems) return;

    for (const li of element.querySelectorAll<HTMLElement>('[data-entry-id]')) {
      const item = allItems.get(li.dataset.entryId ?? '');
      if (!item?.isResource() || !isResourceDefaultImage(item.img)) continue;

      const imgEl = li.querySelector('img');
      if (!imgEl) continue;

      const { light, dark } = getCategoryColor(item.system.category);
      // getBoundingClientRect даёт CSS-размеры до загрузки img; offsetHeight возвращает 0 для незагруженных
      const size = imgEl.getBoundingClientRect().height || imgEl.offsetHeight || 36;

      const wrapper = document.createElement('span');
      wrapper.style.cssText = `display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;flex-grow:0;min-width:${size}px;width:${size}px;height:${size}px;box-sizing:border-box;overflow:hidden;background:${light};border:2px solid ${dark};border-radius:4px;color:${dark};font-size:${Math.round(size * 0.45)}px`;
      wrapper.appendChild(
        Object.assign(document.createElement('i'), {
          className: getTypeIcon(item.system.resourceType),
        }),
      );
      imgEl.replaceWith(wrapper);
    }
  });

  // При обновлении ресурса перерисовываем сайдбар, чтобы иконка обновилась сразу
  Hooks.on('updateItem', (item: ShwItem) => {
    if (!item.isResource() || !isResourceDefaultImage(item.img)) return;
    // biome-ignore lint/suspicious/noExplicitAny: Foundry ui.items не типизирован
    (ui as any).items?.render();
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

  if (createdItem.type === 'resource' && !createdItem._source?.system?.kind) {
    createdItem.updateSource({
      system: ItemFactory.createResource('raw', 'ore', { name: createdItem.name }),
    });
  }

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
