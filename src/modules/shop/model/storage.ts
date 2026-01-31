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
    ui.notifications?.error('Не удалось сохранить данные магазина');
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
    ui.notifications?.error('Не удалось импортировать базу данных');
    return false;
  }
}

/**
 * Очищает всю базу данных
 */
export function clearDatabase(): void {
  saveShopDatabase(createEmptyDatabase());
}
