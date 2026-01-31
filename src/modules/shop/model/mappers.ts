import type { FlatItem } from '../../../shared/ui/tree';
import { SHOP_NODE_COLORS } from './constants';
import { loadShopDatabase } from './storage';
import type { ShopNode } from './types';

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

      result.push({
        id: node.id,
        label: node.name,
        path,
        color: colors.light,
        data: node,
      });
    }
    // Локации без детей тоже являются листьями
    else if (node.type === 'location' && !locationsWithChildren.has(node.id)) {
      const path = buildPath(node);
      const colors = SHOP_NODE_COLORS[node.type];

      result.push({
        id: node.id,
        label: node.name,
        path,
        color: colors.light,
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
