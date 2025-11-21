interface InventoryTreeState {
  searchQuery: string;
  expandedIds: Set<string>;
  selectedId?: string;
}

const defaultState: InventoryTreeState = {
  searchQuery: '',
  expandedIds: new Set(),
  selectedId: undefined,
};

// Store tree state per actor ID
const treeStates = new Map<string, InventoryTreeState>();

export function getInventoryTreeState(actorId: string): InventoryTreeState {
  if (!treeStates.has(actorId)) {
    treeStates.set(actorId, { ...defaultState, expandedIds: new Set() });
  }
  return treeStates.get(actorId) ?? { ...defaultState, expandedIds: new Set() };
}

export function updateInventoryTreeState(actorId: string, updates: Partial<InventoryTreeState>) {
  const current = getInventoryTreeState(actorId);
  treeStates.set(actorId, { ...current, ...updates });
}

export function clearInventoryTreeState(actorId: string) {
  treeStates.delete(actorId);
}
