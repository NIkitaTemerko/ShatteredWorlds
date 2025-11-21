import type { FlatItem, TreeNode } from './types';

/**
 * Converts flat list with `path` into nested tree structure
 */
export function buildTreeFromFlatList(items: FlatItem[]): TreeNode[] {
  const root: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  for (const item of items) {
    let currentLevel = root;
    let currentPath = '';

    // Build category nodes from path
    for (let i = 0; i < item.path.length; i++) {
      const segment = item.path[i];
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;

      const isLastSegment = i === item.path.length - 1;

      if (isLastSegment) {
        // Leaf node (actual item)
        const leafNode: TreeNode = {
          id: item.id,
          label: segment,
          color: item.color,
          data: item.data,
          isLeaf: true,
        };
        currentLevel.push(leafNode);
        nodeMap.set(item.id, leafNode);
      } else {
        // Category node
        let categoryNode = nodeMap.get(currentPath);

        if (!categoryNode) {
          categoryNode = {
            id: currentPath,
            label: segment,
            children: [],
            isLeaf: false,
          };
          currentLevel.push(categoryNode);
          nodeMap.set(currentPath, categoryNode);
        }

        currentLevel = categoryNode.children!;
      }
    }
  }

  return root;
}

/**
 * Recursively filters tree, keeping only nodes matching query or having matching descendants
 */
export function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return nodes;

  const lowerQuery = query.toLowerCase();
  const filtered: TreeNode[] = [];

  for (const node of nodes) {
    const labelMatches = node.label.toLowerCase().includes(lowerQuery);

    if (node.children && node.children.length > 0) {
      // Category node: recurse into children
      const filteredChildren = filterTree(node.children, query);

      if (filteredChildren.length > 0) {
        // Keep category if it has matching children
        filtered.push({
          ...node,
          children: filteredChildren,
        });
      } else if (labelMatches) {
        // Keep category if its own label matches (even without children)
        filtered.push({ ...node, children: [] });
      }
    } else if (labelMatches) {
      // Leaf node matches
      filtered.push(node);
    }
  }

  return filtered;
}

/**
 * Finds path of parent IDs from root to target node
 */
export function findNodePath(nodes: TreeNode[], targetId: string): string[] {
  for (const node of nodes) {
    if (node.id === targetId) {
      return [node.id];
    }

    if (node.children) {
      const childPath = findNodePath(node.children, targetId);
      if (childPath.length > 0) {
        return [node.id, ...childPath];
      }
    }
  }

  return [];
}

/**
 * Collects all leaf nodes (actual items) for autocomplete
 */
export function collectLeafNodes(nodes: TreeNode[]): TreeNode[] {
  const leaves: TreeNode[] = [];

  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.isLeaf) {
        leaves.push(node);
      } else if (node.children) {
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return leaves;
}
