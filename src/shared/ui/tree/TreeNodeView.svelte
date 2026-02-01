<script lang="ts">
  import { t } from "../../../shared/i18n";
  import ActionIcon from "../ActionIcon/ui.svelte";
  import TreeNodeViewSelf from "./TreeNodeView.svelte";
  import type { TreeNode } from "./types";

  interface Props {
    node: TreeNode;
    level?: number;
    isExpanded: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    onToggle: (nodeId: string) => void;
    onSelect: (node: TreeNode) => void;
    onDelete?: (node: TreeNode, e: Event) => void;
    onEdit?: (node: TreeNode, e: Event) => void;
    onDrop?: (node: TreeNode, itemData: any) => void;
    isDynamicTree?: boolean;
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
    onEdit,
    onDrop,
    isDynamicTree = false,
    expandedIds,
    selectedId,
    highlightedId,
  }: Props = $props();

  let isDragOver = $state(false);

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

  function handleEditClick(e: Event) {
    e.stopPropagation();
    onEdit?.(node, e);
  }

  function handleDragOver(e: DragEvent) {
    if (!onDrop) return;
    e.preventDefault();
    e.stopPropagation();
    console.log("dragover event", e.dataTransfer?.types);
    isDragOver = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.stopPropagation();
    // Проверяем что курсор действительно покинул элемент, а не переместился на дочерний
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // Если курсор все еще внутри границ элемента, игнорируем
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return;
    }

    console.log("dragleave event - cursor left bounds");
    isDragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = false;

    console.log("drop event fired!");
    console.log("dataTransfer types:", e.dataTransfer?.types);
    console.log("dataTransfer effectAllowed:", e.dataTransfer?.effectAllowed);
    console.log("dataTransfer dropEffect:", e.dataTransfer?.dropEffect);

    if (!onDrop) {
      console.log("onDrop handler is not defined");
      return;
    }

    try {
      // Логируем все доступные типы данных
      if (e.dataTransfer?.types) {
        console.log("Iterating through types...");
        for (const type of e.dataTransfer.types) {
          const data = e.dataTransfer.getData(type);
          console.log(`Data type '${type}': length=${data?.length}, value:`, data);
        }
      }

      // Foundry использует несколько форматов данных
      let itemData;

      // Пробуем application/json (новый формат Foundry)
      const jsonData = e.dataTransfer?.getData("application/json");
      console.log("application/json result:", jsonData);
      if (jsonData) {
        console.log("Found application/json data");
        itemData = JSON.parse(jsonData);
      } else {
        // Пробуем text/plain (старый формат)
        const textData = e.dataTransfer?.getData("text/plain");
        console.log("text/plain result:", textData, "length:", textData?.length);
        if (textData) {
          console.log("Attempting to parse text/plain...");
          itemData = JSON.parse(textData);
        }
      }

      if (!itemData) {
        console.warn("No drag data found");
        ui.notifications?.warn(t("tree.readItemDataError"));
        return;
      }

      console.log("Parsed item data:", itemData);
      onDrop(node, itemData);
    } catch (error) {
      console.error("Failed to handle drop:", error);
      ui.notifications?.error(t("tree.dropError"));
    }
  }
</script>

<div
  class="tree-node"
  class:highlighted={isHighlighted}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <div
    class="tree-node-content"
    class:selected={isSelected}
    class:is-leaf={isLeaf}
    class:drag-over={isDragOver}
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

    {#if node.icon}
      {#if node.icon.startsWith("fas ") || node.icon.startsWith("far ") || node.icon.startsWith("fab ")}
        <i class="{node.icon} tree-icon-font"></i>
      {:else}
        <img src={node.icon} alt="" class="tree-icon-img" />
      {/if}
    {/if}

    <span class="tree-label">
      {node.label}
    </span>

    {#if isDragOver}
      <span class="drag-indicator">
        <i class="fas fa-plus-circle"></i>
      </span>
    {/if}

    {#if isLeaf && rarity}
      <span class="rarity-indicator" style:background-color={rarityColors[rarity]} title={rarity}></span>
    {/if}

    <div class="tree-actions">
      {#if onEdit && (isDynamicTree || isLeaf)}
        <ActionIcon
          onclick={handleEditClick}
          aria-label="Edit"
          title="Edit"
          variant="ghost"
          size="sm"
          class="edit-action"
        >
          {#snippet icon()}
            <i class="fas fa-edit"></i>
          {/snippet}
        </ActionIcon>
      {/if}

      {#if onDelete && (isDynamicTree || isLeaf)}
        <ActionIcon
          onclick={handleDeleteClick}
          aria-label={t("inventory.deleteItem")}
          title={t("inventory.deleteItem")}
          variant="ghost"
          size="sm"
          class="delete-action"
        >
          {#snippet icon()}
            <i class="fas fa-trash"></i>
          {/snippet}
        </ActionIcon>
      {/if}
    </div>
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
          {onEdit}
          {onDrop}
          {isDynamicTree}
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
    transition:
      background-color 0.15s,
      box-shadow 0.15s;
    min-height: 36px;
  }

  .tree-node-content.drag-over {
    background-color: rgba(222, 184, 135, 0.4);
    box-shadow:
      0 0 0 2px rgba(222, 184, 135, 0.6),
      0 4px 12px rgba(222, 184, 135, 0.4);
  }

  .tree-actions {
    margin-left: auto;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tree-node-content:hover .tree-actions {
    opacity: 1;
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

  .tree-icon-img {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 3px;
    margin-right: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .tree-icon-font {
    width: 20px;
    text-align: center;
    margin-right: 0.5rem;
    color: #666;
    font-size: 16px;
  }

  .tree-label {
    font-size: 14px;
    color: #1a1a1a;
    font-weight: 500;
  }

  .drag-indicator {
    margin-left: 0.5rem;
    color: #10b981;
    font-size: 16px;
    animation: pulse-icon 0.6s ease-in-out infinite;
  }

  @keyframes pulse-icon {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  .rarity-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  .tree-node-content :global(.edit-action),
  .tree-node-content :global(.delete-action) {
    transition:
      opacity 0.15s,
      color 0.15s;
    color: #64748b;
  }

  .tree-node-content :global(.edit-action:hover) {
    color: #2563eb;
  }

  .tree-node-content :global(.delete-action:hover) {
    color: #dc2626;
  }

  .tree-children {
    display: flex;
    flex-direction: column;
  }
</style>
