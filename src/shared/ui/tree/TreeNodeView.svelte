<script lang="ts">
  import type { Snippet } from 'svelte';
  import { DropdownMenu } from 'bits-ui';
  import { t } from '../../../shared/i18n';
  import ActionIcon from '../ActionIcon/ui.svelte';
  import { HoverTooltip } from '../HoverTooltip';
  import TreeNodeViewSelf from './TreeNodeView.svelte';
  import type { ContextMenuArgs, TreeNode } from './types';

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
    contextMenu?: Snippet<[ContextMenuArgs]>;
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
    contextMenu,
    isDynamicTree = false,
    expandedIds,
    selectedId,
    highlightedId,
  }: Props = $props();

  let isDragOver = $state(false);
  let menuOpen = $state(false);

  const hasChildren = $derived(Boolean(node.children?.length));
  /** Шаг = ширина колонки шеврона + gap — дочерние лейблы под родителями ровно. */
  const indent = $derived(level * 16);
  const isLeaf = $derived(!hasChildren);
  const hasIcon = $derived(Boolean(node.icon));

  const showBurgerMenu = $derived(!!contextMenu);

  function handleClick() {
    if (hasChildren) {
      onToggle(node.id);
    }
    onSelect(node);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  function handleDeleteClick(e: Event) {
    e.stopPropagation();
    if (node.deleteDisabled) return;
    onDelete?.(node, e);
  }

  function handleEditClick(e: Event) {
    e.stopPropagation();
    onEdit?.(node, e);
  }

  function closeMenu() {
    menuOpen = false;
  }

  function handleDragOver(e: DragEvent) {
    if (!onDrop) return;
    e.preventDefault();
    e.stopPropagation();
    isDragOver = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return;
    }

    isDragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = false;

    if (!onDrop) return;

    try {
      let itemData;

      const jsonData = e.dataTransfer?.getData('application/json');
      if (jsonData) {
        itemData = JSON.parse(jsonData);
      } else {
        const textData = e.dataTransfer?.getData('text/plain');
        if (textData) {
          itemData = JSON.parse(textData);
        }
      }

      if (!itemData) {
        ui.notifications?.warn(t('tree.readItemDataError'));
        return;
      }

      onDrop(node, itemData);
    } catch (error) {
      console.error('Failed to handle drop:', error);
      ui.notifications?.error(t('tree.dropError'));
    }
  }
</script>

<div
  role="region"
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
    style="--tree-indent: {indent}px"
    onclick={handleClick}
    onkeydown={handleKeyDown}
    role="button"
    tabindex="0"
  >
    <span class="tree-chevron-col" aria-hidden="true">
      {#if hasChildren}
        <span class="tree-chevron" class:expanded={isExpanded}></span>
      {/if}
    </span>

    {#if hasIcon}
      <span class="tree-icon-slot">
        {#if node.icon!.startsWith('fas ') || node.icon!.startsWith('far ') || node.icon!.startsWith('fab ')}
          <i class="{node.icon} tree-icon-font"></i>
        {:else}
          <img src={node.icon} alt="" class="tree-icon-img" />
        {/if}
      </span>
    {/if}

    <span class="tree-label">{node.label}</span>

    {#if isDragOver}
      <span class="drag-indicator">
        <i class="fas fa-plus-circle"></i>
      </span>
    {/if}

    {#if isLeaf && node.badge}
      <span class="badge-indicator" style:background-color={node.badge.color} title={node.badge.label}></span>
    {/if}

    <div class="tree-actions">
      {#if showBurgerMenu && isLeaf && contextMenu}
        <DropdownMenu.Root bind:open={menuOpen}>
          <DropdownMenu.Trigger
            class="shw-action-icon variant-ghost size-sm menu-action"
            aria-label="Menu"
            title="Menu"
            onclick={(e) => e.stopPropagation()}
          >
            <span class="shw-action-icon__glyph" aria-hidden="true">
              <i class="fas fa-bars"></i>
            </span>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content class="shw-dropdown-content" sideOffset={4} align="end">
              {@render contextMenu({ node, close: closeMenu })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      {:else if onEdit && (isDynamicTree || isLeaf)}
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
        {@const deleteDisabled = node.deleteDisabled === true}
        {@const deleteTitle = deleteDisabled
          ? (node.deleteDisabledTitle ?? t('inventory.deleteItem'))
          : t('inventory.deleteItem')}
        {#if deleteDisabled}
          <HoverTooltip label={deleteTitle} popupId="delete-tooltip-{node.id}">
            {#snippet children()}
              <span class="delete-action-wrapper delete-action-wrapper--disabled">
                <ActionIcon
                  onclick={handleDeleteClick}
                  aria-label={deleteTitle}
                  disabled={true}
                  variant="ghost"
                  size="sm"
                  class="delete-action"
                >
                  {#snippet icon()}
                    <i class="fas fa-trash"></i>
                  {/snippet}
                </ActionIcon>
              </span>
            {/snippet}
          </HoverTooltip>
        {:else}
          <ActionIcon
            onclick={handleDeleteClick}
            aria-label={deleteTitle}
            title={deleteTitle}
            variant="ghost"
            size="sm"
            class="delete-action"
          >
            {#snippet icon()}
              <i class="fas fa-trash"></i>
            {/snippet}
          </ActionIcon>
        {/if}
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
          {contextMenu}
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
    gap: 0.35rem;
    min-height: 1.75rem;
    padding: 0.15rem 0.35rem 0.15rem calc(0.35rem + var(--tree-indent, 0px));
    border: 1px solid transparent;
    border-radius: 0;
    color: var(--shw-color-text, #e8e4f0);
    cursor: pointer;
    transition:
      background-color 0.15s,
      border-color 0.15s,
      box-shadow 0.15s;
  }

  .tree-node-content:focus-visible {
    outline: none;
    box-shadow: var(--shw-focus-ring);
  }

  .tree-node-content.drag-over {
    border-color: var(--shw-color-tertiary-bright, #4ec4b6);
    background: color-mix(in srgb, var(--shw-color-tertiary) 28%, transparent);
    box-shadow: var(--shw-inner-glow);
  }

  .tree-actions {
    margin-left: auto;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tree-node-content:hover .tree-actions,
  .tree-node-content:focus-within .tree-actions {
    opacity: 1;
  }

  .tree-node-content:hover {
    background: var(--shw-glass-fill);
  }

  .tree-node-content.selected {
    border-color: color-mix(in srgb, var(--shw-color-primary-bright) 45%, transparent);
    background: var(--shw-glass-fill-tint);
    box-shadow: var(--shw-inner-glow);
  }

  .tree-node.highlighted .tree-node-content {
    border-color: var(--shw-color-primary-bright);
    background: var(--shw-glass-fill-strong);
    animation: pulse 1s ease-in-out;
  }

  @keyframes pulse {
    0%,
    100% {
      background: var(--shw-glass-fill-strong);
    }
    50% {
      background: color-mix(in srgb, var(--shw-color-primary) 40%, transparent);
    }
  }

  /* Фиксированная колонка: шеврон или пусто — лейблы одного уровня по первой букве */
  .tree-chevron-col {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 0.75rem;
    height: 0.75rem;
  }

  .tree-chevron {
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 3.5px 0 3.5px 5px;
    border-color: transparent transparent transparent var(--shw-color-text-muted, #9a93ad);
    transition: transform 0.15s;
  }

  .tree-chevron.expanded {
    transform: rotate(90deg);
  }

  .tree-icon-slot {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
  }

  .tree-icon-img {
    display: block;
    width: 1rem;
    height: 1rem;
    object-fit: cover;
    border-radius: 1px;
    border: 1px solid var(--shw-color-border, #4a425c);
  }

  .tree-icon-font {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    color: var(--shw-color-primary-bright, #b57aef);
    font-size: 12px;
    text-align: center;
  }

  .tree-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    font-family: var(--shw-font, inherit);
    font-size: 14px;
    font-weight: 600;
    color: var(--shw-color-text, #e8e4f0);
  }

  .tree-node-content:not(.is-leaf) .tree-label {
    color: var(--shw-color-text-muted, #9a93ad);
  }

  .drag-indicator {
    margin-left: 0.5rem;
    color: var(--shw-color-tertiary-bright, #4ec4b6);
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

  .badge-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 0.45rem;
    flex-shrink: 0;
    box-shadow: 0 0 8px currentColor;
  }

  .tree-node-content :global(.edit-action),
  .tree-node-content :global(.delete-action),
  .tree-node-content :global(.menu-action) {
    transition:
      opacity 0.15s,
      color 0.15s;
    color: var(--shw-color-text-muted, #9a93ad);
  }

  .tree-node-content :global(.menu-action:hover) {
    color: var(--shw-color-text, #e8e4f0);
  }

  .tree-node-content :global(.edit-action:hover) {
    color: var(--shw-color-primary-bright, #b57aef);
  }

  .tree-node-content :global(.delete-action:hover) {
    color: #f07178;
  }

  .delete-action-wrapper {
    display: inline-flex;
  }

  .delete-action-wrapper--disabled {
    cursor: not-allowed;
  }

  .delete-action-wrapper--disabled :global(.delete-action:hover) {
    color: var(--shw-color-text-muted, #9a93ad);
  }

  .burger-menu-container {
    position: relative;
  }

  .tree-children {
    display: flex;
    flex-direction: column;
  }

  :global(.shw-dropdown-content) {
    z-index: var(--shw-z-popover, 100000);
    min-width: 11rem;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    border-radius: 0;
    background: rgb(28 24 40 / 96%);
    color: var(--shw-color-text, #e8e4f0);
    box-shadow: var(--shw-shadow-panel, 0 10px 28px rgb(0 0 0 / 40%));
    outline: none;
    padding: 0.25rem;
  }
</style>
