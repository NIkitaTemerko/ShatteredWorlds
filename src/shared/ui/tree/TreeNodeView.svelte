<script lang="ts">
  import type { TreeNode } from "./types";
  import TreeNodeViewSelf from "./TreeNodeView.svelte";
  import { t } from "../../../shared/i18n";
  import ActionIcon from "../ActionIcon/ui.svelte";

  interface Props {
    node: TreeNode;
    level?: number;
    isExpanded: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    onToggle: (nodeId: string) => void;
    onSelect: (node: TreeNode) => void;
    onDelete?: (node: TreeNode, e: Event) => void;
    expandedIds: Set<string>;
    selectedId?: string;
    highlightedId?: string;
  }

  let {
    node,
    level = 0,
    isExpanded,
    isSelected,
    isHighlighted,
    onToggle,
    onSelect,
    onDelete,
    expandedIds,
    selectedId,
    highlightedId,
  }: Props = $props();

  const hasChildren = node.children && node.children.length > 0;
  const indent = level * 16;
  const isLeaf = !hasChildren;

  // Extract item data for leaves
  const itemData = $derived(isLeaf && node.data ? node.data : null);

  const rarity = $derived.by(() => {
    if (!itemData || typeof itemData !== "object") return null;
    const item = itemData as any;
    return item.type === "consumable" ? item.system?.consumable?.rarity : null;
  });

  const quantity = $derived.by(() => {
    if (!itemData || typeof itemData !== "object") return null;
    const item = itemData as any;
    return item.type === "consumable" ? item.system?.consumable?.quantity : null;
  });

  const rarityColors: Record<string, string> = {
    common: "#9CA3AF",
    uncommon: "#10B981",
    rare: "#3B82F6",
    legendary: "#F97316",
  };

  function handleClick() {
    if (hasChildren) {
      onToggle(node.id);
    }
    onSelect(node);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  function handleDeleteClick(e: Event) {
    e.stopPropagation();
    onDelete?.(node, e);
  }
</script>

<div class="tree-node" class:highlighted={isHighlighted}>
  <div
    class="tree-node-content"
    class:selected={isSelected}
    class:is-leaf={isLeaf}
    style="padding-left: {indent}px"
    onclick={handleClick}
    onkeydown={handleKeyDown}
    role="button"
    tabindex="0"
  >
    {#if hasChildren}
      <span class="tree-chevron" class:expanded={isExpanded}>
        <i class="fas fa-chevron-right"></i>
      </span>
    {:else}
      <span class="tree-spacer"></span>
    {/if}

    <span class="tree-label">
      {node.label}
    </span>

    {#if isLeaf && rarity}
      <span class="rarity-indicator" style:background-color={rarityColors[rarity]} title={rarity}></span>
    {/if}

    {#if isLeaf && quantity !== null && quantity !== undefined}
      <span class="item-quantity">x{quantity}</span>
    {/if}

    {#if isLeaf && onDelete}
      <ActionIcon
        onclick={handleDeleteClick}
        aria-label={t("inventory.deleteItem")}
        title={t("inventory.deleteItem")}
        variant="ghost"
        size="sm"
        class="delete-action tw:ml-auto"
      >
        {#snippet icon()}
          <i class="fas fa-trash"></i>
        {/snippet}
      </ActionIcon>
    {/if}
  </div>

  {#if hasChildren && isExpanded}
    <div class="tree-children">
      {#each node.children as child (child.id)}
        <TreeNodeViewSelf
          node={child}
          level={level + 1}
          isExpanded={expandedIds.has(child.id)}
          isSelected={selectedId === child.id}
          isHighlighted={highlightedId === child.id}
          {onToggle}
          {onSelect}
          {onDelete}
          {expandedIds}
          {selectedId}
          {highlightedId}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .tree-node {
    user-select: none;
  }

  .tree-node-content {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.15s;
    min-height: 36px;
  }

  .tree-node-content:hover {
    background-color: rgba(222, 184, 135, 0.25);
  }

  .tree-node-content.selected {
    background-color: rgba(222, 184, 135, 0.35);
  }

  .tree-node.highlighted .tree-node-content {
    background-color: rgba(222, 184, 135, 0.5);
    animation: pulse 1s ease-in-out;
  }

  @keyframes pulse {
    0%,
    100% {
      background-color: rgba(222, 184, 135, 0.5);
    }
    50% {
      background-color: rgba(210, 180, 140, 0.7);
    }
  }

  .tree-chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-right: 0.25rem;
    transition: transform 0.15s;
  }

  .tree-chevron.expanded {
    transform: rotate(90deg);
  }

  .tree-spacer {
    display: inline-block;
    width: 16px;
    margin-right: 0.25rem;
  }

  .tree-label {
    font-size: 14px;
    color: #1a1a1a;
    font-weight: 500;
  }

  .rarity-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  .tree-node-content :global(.delete-action) {
    transition: opacity 0.15s;
    color: gray;
    margin-left: auto;
  }

  .tree-node-content:hover :global(.delete-action) {
    opacity: 1;
    color: rgba(160, 82, 45, 0.9);
  }

  .tree-node-content :global(.delete-action:hover) {
    color: crimson;
  }

  .tree-children {
    display: flex;
    flex-direction: column;
  }
</style>
