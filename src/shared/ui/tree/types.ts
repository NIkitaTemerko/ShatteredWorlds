export interface TreeBadge {
  color: string;
  label: string;
}

export interface FlatItem {
  id: string;
  label: string;
  path: string[]; // Hierarchical path like ["Consumables", "Bombs", "Item name"]
  color?: string; // Optional row color
  icon?: string; // Optional icon path or class
  categoryIcons?: string[]; // Icons for each level of the path (for categories)
  badge?: TreeBadge; // Optional badge indicator (e.g. rarity)
  data?: unknown; // Original item data
}

export interface TreeNode {
  id: string;
  label: string;
  color?: string;
  icon?: string; // Optional icon path or class
  badge?: TreeBadge; // Optional badge indicator
  children?: TreeNode[];
  data?: unknown; // Original item data
  isLeaf?: boolean; // True for actual items, false for category nodes
}

export interface TreeState {
  expandedIds: Set<string>;
  selectedId?: string;
  highlightedId?: string;
}
