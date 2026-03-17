import type { SpellCategory } from '../../../documents/Item/types/SpellDataTypes';

/** Состояние дерева заклинаний для конкретного актора */
export interface SpellTreeState {
  /** Поисковый запрос */
  searchQuery: string;
  /** Раскрытые узлы дерева (ID категорий) */
  expandedIds: Set<string>;
  /** Выбранное заклинание (ID) */
  selectedId: string | null;
}

/** Хранилище состояний деревьев заклинаний для разных акторов */
const treeStates = new Map<string, SpellTreeState>();

/** Получить состояние дерева заклинаний для актора */
export function getSpellTreeState(actorId: string): SpellTreeState {
  const existing = treeStates.get(actorId);
  if (existing) return existing;

  const created: SpellTreeState = {
    searchQuery: '',
    expandedIds: new Set<string>(),
    selectedId: null,
  };

  treeStates.set(actorId, created);
  return created;
}

/** Обновить состояние дерева заклинаний */
export function updateSpellTreeState(actorId: string, updates: Partial<SpellTreeState>): void {
  const current = getSpellTreeState(actorId);
  treeStates.set(actorId, { ...current, ...updates });
}

/** Очистить состояние дерева заклинаний */
export function clearSpellTreeState(actorId: string): void {
  treeStates.delete(actorId);
}
