import type { ShwItem } from '../../../documents/Item/ShwItem';

/**
 * Типы нод в дереве магазина
 */
export type ShopNodeType = 'location' | 'merchant';

/**
 * Базовая нода в дереве магазина
 */
export interface BaseShopNode {
  id: string;
  name: string;
  type: ShopNodeType;
  parentId?: string; // undefined для корневых нод
}

/**
 * Нода локации (может содержать торговцев и другие локации)
 */
export interface LocationNode extends BaseShopNode {
  type: 'location';
  description?: string;
}

/**
 * Предмет в инвентаре торговца
 */
export interface MerchantInventoryItem {
  /** ID предмета из game.items (baseId) или уникальный ID */
  itemId: string;
  /** Ссылка на ShwItem (не сериализуется) */
  itemRef?: ShwItem;
  /** Количество (-1 для неограниченного) */
  quantity: number;
  /** Цена покупки у торговца */
  price: number;
}

/**
 * Нода торговца (содержит инвентарь)
 */
export interface MerchantNode extends BaseShopNode {
  type: 'merchant';
  description?: string;
  /** Инвентарь торговца */
  inventory: MerchantInventoryItem[];
}

/**
 * Объединенный тип нод
 */
export type ShopNode = LocationNode | MerchantNode;

/**
 * Корневая структура данных магазина
 */
export interface ShopDatabase {
  /** Версия структуры данных (для миграций) */
  version: number;
  /** Все ноды магазина (плоский список) */
  nodes: ShopNode[];
}

/**
 * Состояние дерева магазина для UI
 */
export interface ShopTreeState {
  searchQuery: string;
  expandedIds: Set<string>;
  selectedId?: string;
}
