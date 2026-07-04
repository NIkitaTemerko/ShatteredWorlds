interface EquipmentTreeState {
  searchQuery: string;
  expandedIds: Set<string>;
  selectedId?: string;
}

const defaultState: EquipmentTreeState = {
  searchQuery: '',
  expandedIds: new Set(),
  selectedId: undefined,
};

const treeStates = new Map<string, EquipmentTreeState>();

export function getEquipmentTreeState(actorId: string): EquipmentTreeState {
  if (!treeStates.has(actorId)) {
    treeStates.set(actorId, { ...defaultState, expandedIds: new Set() });
  }
  return treeStates.get(actorId) ?? { ...defaultState, expandedIds: new Set() };
}

export function updateEquipmentTreeState(actorId: string, updates: Partial<EquipmentTreeState>) {
  const current = getEquipmentTreeState(actorId);
  treeStates.set(actorId, { ...current, ...updates });
}

export function clearEquipmentTreeState(actorId: string) {
  treeStates.delete(actorId);
}
