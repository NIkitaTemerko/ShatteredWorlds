<script lang="ts">
  import TreeNodeView from "./TreeNodeView.svelte";
  import type { TreeNode, TreeState } from "./types";

  interface Props {
    nodes: TreeNode[];
    initialExpandedIds?: Set<string>;
    selectedId?: string;
    highlightedId?: string;
    onSelect?: (node: TreeNode) => void;
    onDelete?: (node: TreeNode, e: Event) => void;
    onEdit?: (node: TreeNode, e: Event) => void;
    isDynamicTree?: boolean;
  }

  let {
    nodes,
    initialExpandedIds,
    selectedId,
    highlightedId,
    onSelect,
    onDelete,
    onEdit,
    isDynamicTree = false,
  }: Props = $props();

  let expandedIds = $state(initialExpandedIds ? new Set(initialExpandedIds) : new Set<string>());

  function handleToggle(nodeId: string) {
    if (expandedIds.has(nodeId)) {
      expandedIds.delete(nodeId);
    } else {
      expandedIds.add(nodeId);
    }
    expandedIds = new Set(expandedIds); // Trigger reactivity
  }

  function handleSelect(node: TreeNode) {
    onSelect?.(node);
  }

  // Expose method to expand specific nodes (for search jump-to)
  export function expandNodes(nodeIds: string[]) {
    for (const id of nodeIds) {
      expandedIds.add(id);
    }
    expandedIds = new Set(expandedIds);
  }

  // Expose method to get current expanded IDs
  export function getExpandedIds(): Set<string> {
    return new Set(expandedIds);
  }
</script>

<div class="tree">
  {#each nodes as node (node.id)}
    <TreeNodeView
      {node}
      isExpanded={expandedIds.has(node.id)}
      isSelected={selectedId === node.id}
      isHighlighted={highlightedId === node.id}
      onToggle={handleToggle}
      onSelect={handleSelect}
      {onDelete}
      {onEdit}
      {isDynamicTree}
      {expandedIds}
      {selectedId}
      {highlightedId}
    />
  {/each}
</div>

<style>
  .tree {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
  }
</style>
