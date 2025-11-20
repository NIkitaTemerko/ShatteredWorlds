export interface FlatItem {
  id: string;
  label: string;
  path: string[]; // Hierarchical path like ["Consumables", "Bombs", "Item name"]
  color?: string; // Optional row color
  data?: unknown; // Original item data
}

export interface TreeNode {
  id: string;
  label: string;
  color?: string;
  children?: TreeNode[];
  data?: unknown; // Original item data
  isLeaf?: boolean; // True for actual items, false for category nodes
}

export interface TreeState {
  expandedIds: Set<string>;
  selectedId?: string;
  highlightedId?: string;
}
