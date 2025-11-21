interface AbilityTreeState {
  searchQuery: string;
  expandedIds: Set<string>;
  selectedId?: string;
}

const defaultState: AbilityTreeState = {
  searchQuery: '',
  expandedIds: new Set(),
  selectedId: undefined,
};

// Store tree state per actor ID
const treeStates = new Map<string, AbilityTreeState>();

export function getAbilityTreeState(actorId: string): AbilityTreeState {
  if (!treeStates.has(actorId)) {
    treeStates.set(actorId, { ...defaultState, expandedIds: new Set() });
  }
  return treeStates.get(actorId) ?? { ...defaultState, expandedIds: new Set() };
}

export function updateAbilityTreeState(actorId: string, updates: Partial<AbilityTreeState>) {
  const current = getAbilityTreeState(actorId);
  treeStates.set(actorId, { ...current, ...updates });
}

export function clearAbilityTreeState(actorId: string) {
  treeStates.delete(actorId);
}
