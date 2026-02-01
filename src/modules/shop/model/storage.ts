import { localize, t } from '../../../shared/i18n';
import { SHOP_DATABASE_VERSION, SHOP_STORAGE_KEY } from './constants';
import type { ShopDatabase, ShopNode } from './types';

/**
 * Создает пустую базу данных магазина
 */
function createEmptyDatabase(): ShopDatabase {
  return {
    version: SHOP_DATABASE_VERSION,
    nodes: [],
  };
}

/**
 * Загружает базу данных магазина из LocalStorage
 */
export function loadShopDatabase(): ShopDatabase {
  try {
    const stored = localStorage.getItem(SHOP_STORAGE_KEY);
    if (!stored) {
      return createEmptyDatabase();
    }

    const parsed = JSON.parse(stored) as ShopDatabase;

    // Валидация версии
    if (parsed.version !== SHOP_DATABASE_VERSION) {
      console.warn(
        `Shop database version mismatch: ${parsed.version} vs ${SHOP_DATABASE_VERSION}. Creating new database.`,
      );
      return createEmptyDatabase();
    }

    // Восстанавливаем Set из массива если нужно
    return parsed;
  } catch (error) {
    console.error('Failed to load shop database:', error);
    return createEmptyDatabase();
  }
}

/**
 * Сохраняет базу данных магазина в LocalStorage
 */
export function saveShopDatabase(database: ShopDatabase): void {
  try {
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(database));
  } catch (error) {
    console.error('Failed to save shop database:', error);
    ui.notifications?.error(t('shop.notifications.saveError'));
  }
}

/**
 * Добавляет ноду в базу данных
 */
export function addNode(node: ShopNode): void {
  const db = loadShopDatabase();
  db.nodes.push(node);
  saveShopDatabase(db);
}

/**
 * Обновляет ноду в базе данных
 */
export function updateNode(nodeId: string, updates: Partial<ShopNode>): void {
  const db = loadShopDatabase();
  const index = db.nodes.findIndex((n) => n.id === nodeId);

  if (index === -1) {
    console.warn(`Node with id ${nodeId} not found`);
    return;
  }

  db.nodes[index] = { ...db.nodes[index], ...updates } as ShopNode;
  saveShopDatabase(db);
}

/**
 * Удаляет ноду и всех её потомков
 */
export function deleteNode(nodeId: string): void {
  const db = loadShopDatabase();

  // Рекурсивно собираем ID всех потомков
  const idsToDelete = new Set<string>([nodeId]);

  function collectDescendants(parentId: string) {
    db.nodes.forEach((node) => {
      if (node.parentId === parentId) {
        idsToDelete.add(node.id);
        collectDescendants(node.id);
      }
    });
  }

  collectDescendants(nodeId);

  // Удаляем все собранные ноды
  db.nodes = db.nodes.filter((node) => !idsToDelete.has(node.id));
  saveShopDatabase(db);
}

/**
 * Получает ноду по ID
 */
export function getNode(nodeId: string): ShopNode | undefined {
  const db = loadShopDatabase();
  return db.nodes.find((n) => n.id === nodeId);
}

/**
 * Получает детей конкретной ноды
 */
export function getChildNodes(parentId: string | undefined): ShopNode[] {
  const db = loadShopDatabase();
  return db.nodes.filter((n) => n.parentId === parentId);
}

/**
 * Экспортирует базу данных в JSON строку
 */
export function exportDatabase(): string {
  const db = loadShopDatabase();
  return JSON.stringify(db, null, 2);
}

/**
 * Импортирует базу данных из JSON строки
 */
export function importDatabase(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as ShopDatabase;

    // Базовая валидация
    if (!parsed.version || !Array.isArray(parsed.nodes)) {
      throw new Error('Invalid database format');
    }

    saveShopDatabase(parsed);
    return true;
  } catch (error) {
    console.error('Failed to import database:', error);
    ui.notifications?.error(t('shop.notifications.importError'));
    return false;
  }
}

/**
 * Очищает всю базу данных
 */
export function clearDatabase(): void {
  saveShopDatabase(createEmptyDatabase());
}

/**
 * Добавляет предмет в инвентарь торговца
 */
export function addMerchantItem(
  merchantId: string,
  itemId: string,
  price: number,
  quantity: number,
): boolean {
  const db = loadShopDatabase();
  const merchant = db.nodes.find((n) => n.id === merchantId && n.type === 'merchant');

  if (!merchant || merchant.type !== 'merchant') {
    console.warn(`Merchant with id ${merchantId} not found`);
    return false;
  }

  // Проверяем дубликат
  if (merchant.inventory.some((item) => item.itemId === itemId)) {
    ui.notifications?.warn(t('shop.notifications.itemAlreadyExists'));
    return false;
  }

  merchant.inventory.push({ itemId, price, quantity });
  saveShopDatabase(db);
  return true;
}

/**
 * Обновляет предмет в инвентаре торговца
 */
export function updateMerchantItem(
  merchantId: string,
  itemId: string,
  updates: { price?: number; quantity?: number },
): boolean {
  const db = loadShopDatabase();
  const merchant = db.nodes.find((n) => n.id === merchantId && n.type === 'merchant');

  if (!merchant || merchant.type !== 'merchant') {
    console.warn(`Merchant with id ${merchantId} not found`);
    return false;
  }

  const itemIndex = merchant.inventory.findIndex((item) => item.itemId === itemId);
  if (itemIndex === -1) {
    console.warn(`Item ${itemId} not found in merchant ${merchantId} inventory`);
    return false;
  }

  merchant.inventory[itemIndex] = { ...merchant.inventory[itemIndex], ...updates };
  saveShopDatabase(db);
  return true;
}

/**
 * Удаляет предмет из инвентаря торговца
 */
export function deleteMerchantItem(merchantId: string, itemId: string): boolean {
  const db = loadShopDatabase();
  const merchant = db.nodes.find((n) => n.id === merchantId && n.type === 'merchant');

  if (!merchant || merchant.type !== 'merchant') {
    console.warn(`Merchant with id ${merchantId} not found`);
    return false;
  }

  const initialLength = merchant.inventory.length;
  merchant.inventory = merchant.inventory.filter((item) => item.itemId !== itemId);

  if (merchant.inventory.length === initialLength) {
    console.warn(`Item ${itemId} not found in merchant ${merchantId} inventory`);
    return false;
  }

  saveShopDatabase(db);
  return true;
}

/**
 * Добавляет предмет всем торговцам в локации и её подлокациях
 */
export function addItemToLocation(
  locationId: string,
  itemId: string,
  price: number,
  quantity: number,
): number {
  const db = loadShopDatabase();
  let addedCount = 0;

  // Рекурсивно собираем всех торговцев в этой локации и подлокациях
  function collectMerchants(parentId: string): string[] {
    const merchants: string[] = [];

    db.nodes.forEach((node) => {
      if (node.parentId === parentId) {
        if (node.type === 'merchant') {
          merchants.push(node.id);
        } else if (node.type === 'location') {
          merchants.push(...collectMerchants(node.id));
        }
      }
    });

    return merchants;
  }

  const merchantIds = collectMerchants(locationId);

  // Добавляем предмет всем торговцам в одной транзакции
  merchantIds.forEach((merchantId) => {
    const merchant = db.nodes.find((n) => n.id === merchantId && n.type === 'merchant');

    if (!merchant || merchant.type !== 'merchant') {
      console.warn(`Merchant with id ${merchantId} not found`);
      return;
    }

    // Проверяем дубликат
    if (merchant.inventory.some((item) => item.itemId === itemId)) {
      console.log(`Item ${itemId} already exists in merchant ${merchantId}, skipping`);
      return;
    }

    merchant.inventory.push({ itemId, price, quantity });
    addedCount++;
  });

  // Сохраняем базу один раз после всех изменений
  if (addedCount > 0) {
    saveShopDatabase(db);
    ui.notifications?.info(
      localize('shop.notifications.itemAddedToMerchants', { count: String(addedCount) }),
    );
  }

  return addedCount;
}
