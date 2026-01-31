import type { ShopTreeState } from './types';

const defaultState: ShopTreeState = {
  searchQuery: '',
  expandedIds: new Set(),
  selectedId: undefined,
};

// Singleton state для дерева магазина (не привязано к конкретному актору)
let currentState: ShopTreeState = { ...defaultState, expandedIds: new Set() };

/**
 * Получить текущее состояние дерева магазина
 */
export function getShopTreeState(): ShopTreeState {
  return currentState;
}

/**
 * Обновить состояние дерева магазина
 */
export function updateShopTreeState(updates: Partial<ShopTreeState>): void {
  currentState = { ...currentState, ...updates };
}

/**
 * Очистить состояние дерева магазина
 */
export function clearShopTreeState(): void {
  currentState = { ...defaultState, expandedIds: new Set() };
}
