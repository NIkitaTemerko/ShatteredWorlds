import type { ShwItem } from '../../../documents/Item/ShwItem';
import { t } from '../../../shared/i18n';
import type { FlatItem } from '../../../shared/ui/tree';
import { SHOP_NODE_COLORS } from './constants';
import { loadShopDatabase } from './storage';
import type { ShopNode } from './types';

/**
 * Получает имя предмета по UUID синхронно
 */
function getItemName(itemUuid: string): string {
  try {
    // Парсим UUID чтобы получить Item
    // UUID формат: Item.{itemId} или Compendium.{pack}.{itemId}
    const item = fromUuidSync(itemUuid) as ShwItem | null;
    return item?.name || itemUuid.split('.').pop() || t('shop.merchantItem.unknownItem');
  } catch (error) {
    console.error('Failed to get item name:', error);
    return itemUuid.split('.').pop() || t('shop.merchantItem.unknownItem');
  }
}

/**
 * Получает иконку предмета по UUID синхронно
 */
function getItemIcon(itemUuid: string): string | undefined {
  try {
    const item = fromUuidSync(itemUuid) as ShwItem | null;
    return item?.img;
  } catch (error) {
    console.error('Failed to get item icon:', error);
    return undefined;
  }
}

/**
 * Создает карту путей к локациям для связывания категорийных узлов с ShopNode
 */
export function buildLocationPathMap(nodes: ShopNode[]): Map<string, ShopNode> {
  const map = new Map<string, ShopNode>();

  function buildPath(node: ShopNode): string {
    if (!node.parentId) {
      return node.name;
    }
    const parent = nodes.find((n) => n.id === node.parentId);
    if (!parent) {
      return node.name;
    }
    return `${buildPath(parent)}/${node.name}`;
  }

  for (const node of nodes) {
    if (node.type === 'location') {
      const path = buildPath(node);
      map.set(path, node);
    }
  }

  return map;
}

/**
 * Преобразует иерархическую структуру нод в плоский список для TreeWithSearch
 * Path structure: [ParentLocation?, NodeName]
 * Торговцы и пустые локации являются листьями, локации с детьми - промежуточными узлами
 */
export function mapShopNodesToFlatItems(nodes: ShopNode[]): FlatItem[] {
  const result: FlatItem[] = [];

  function buildPath(node: ShopNode): string[] {
    if (!node.parentId) {
      return [node.name];
    }
    const parent = nodes.find((n) => n.id === node.parentId);
    if (!parent) {
      return [node.name];
    }
    const ancestorPath = buildPath(parent);
    return [...ancestorPath, node.name];
  }

  // Находим локации, у которых есть дочерние элементы
  const locationsWithChildren = new Set<string>();
  for (const node of nodes) {
    if (node.parentId) {
      locationsWithChildren.add(node.parentId);
    }
  }

  // Добавляем торговцев и пустые локации как листья
  for (const node of nodes) {
    // Торговцы всегда являются листьями
    if (node.type === 'merchant') {
      const path = buildPath(node);
      const colors = SHOP_NODE_COLORS[node.type];

      // Строим массив иконок для пути (локации + торговец)
      const categoryIcons: string[] = [];
      let currentNode: ShopNode | undefined = node;
      while (currentNode) {
        if (currentNode.type === 'merchant') {
          categoryIcons.unshift('fas fa-user-tie');
        } else if (currentNode.type === 'location') {
          categoryIcons.unshift('fas fa-map-marker-alt');
        }
        currentNode = currentNode.parentId
          ? nodes.find((n) => n.id === currentNode!.parentId)
          : undefined;
      }

      // Если у торговца НЕТ предметов, добавляем его как лист
      if (node.inventory.length === 0) {
        result.push({
          id: node.id,
          label: node.name,
          path,
          color: colors.light,
          icon: 'fas fa-user-tie',
          categoryIcons,
          data: node,
        });
      }

      // Добавляем предметы торговца как дочерние листья
      for (const item of node.inventory) {
        const itemName = getItemName(item.itemId);
        const itemIcon = getItemIcon(item.itemId);
        const itemPath = [...path, itemName];
        result.push({
          id: `${node.id}-item-${item.itemId}`,
          label: `${itemName} (${item.quantity === -1 ? '∞' : item.quantity}x) - 🪙 ${item.price}`,
          path: itemPath,
          color: colors.light,
          icon: itemIcon,
          categoryIcons,
          data: { type: 'merchant-item', merchantId: node.id, item },
        });
      }
    }
    // Локации без детей тоже являются листьями
    else if (node.type === 'location' && !locationsWithChildren.has(node.id)) {
      const path = buildPath(node);
      const colors = SHOP_NODE_COLORS[node.type];

      // Строим массив иконок для пути локаций
      const categoryIcons: string[] = [];
      let currentNode: ShopNode | undefined = node;
      while (currentNode) {
        if (currentNode.type === 'location') {
          categoryIcons.unshift('fas fa-map-marker-alt');
        }
        currentNode = currentNode.parentId
          ? nodes.find((n) => n.id === currentNode!.parentId)
          : undefined;
      }

      result.push({
        id: node.id,
        label: node.name,
        path,
        color: colors.light,
        icon: 'fas fa-map-marker-alt',
        categoryIcons,
        data: node,
      });
    }
  }

  return result;
}

/**
 * Загружает все ноды из базы данных и преобразует в FlatItems
 */
export function loadShopTreeItems(): FlatItem[] {
  const db = loadShopDatabase();
  return mapShopNodesToFlatItems(db.nodes);
}
