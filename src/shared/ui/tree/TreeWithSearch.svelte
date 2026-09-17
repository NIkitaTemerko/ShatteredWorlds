<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import { t } from '../../../shared/i18n';
  import { AutocompleteInput } from '../AutocompleteInput';
  import Tree from './Tree.svelte';
  import { buildTreeFromFlatList, collectAllNodes, filterTree, findNodePath } from './treeUtils';
  import type { ContextMenuArgs, FlatItem, TreeNode } from './types';

  interface TreeStateUpdate {
    searchQuery: string;
    expandedIds: Set<string>;
    selectedId?: string;
  }

  interface Props {
    items: FlatItem[];
    initialSearchQuery?: string;
    initialExpandedIds?: Set<string>;
    initialSelectedId?: string;
    searchPlaceholder?: string;
    onSelect?: (node: TreeNode) => void;
    onDelete?: (node: TreeNode, e: Event) => void;
    onEdit?: (node: TreeNode, e: Event) => void;
    onDrop?: (node: TreeNode, itemData: any) => void;
    contextMenu?: Snippet<[ContextMenuArgs]>;
    isDynamicTree?: boolean;
    onStateChange?: (state: TreeStateUpdate) => void;
  }

  let {
    items,
    initialSearchQuery = '',
    initialExpandedIds,
    initialSelectedId,
    searchPlaceholder,
    onSelect,
    onDelete,
    onEdit,
    onDrop,
    contextMenu,
    isDynamicTree = false,
    onStateChange,
  }: Props = $props();

  const placeholder = $derived(searchPlaceholder ?? t('inventory.searchPlaceholder'));

  let searchQuery = $state(untrack(() => initialSearchQuery));
  let jumpValue = $state('');
  let selectedId = $state<string | undefined>(untrack(() => initialSelectedId));
  let highlightedId = $state<string | undefined>(undefined);
  let treeRef: Tree | undefined = $state();
  let highlightTimeoutId: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    if (onStateChange) {
      const expandedIds = treeRef?.getExpandedIds() ?? new Set();
      onStateChange({
        searchQuery,
        expandedIds,
        selectedId,
      });
    }
  });

  const fullTree = $derived(buildTreeFromFlatList(items));
  const filteredTree = $derived(filterTree(fullTree, searchQuery));
  const allNodes = $derived(collectAllNodes(fullTree));

  const searchOptions = $derived(
    allNodes.map((node) => ({
      value: node.id,
      label: node.label,
    })),
  );

  function handleAutocompleteSelect(node: TreeNode) {
    searchQuery = '';
    jumpValue = '';

    const path = findNodePath(fullTree, node.id);
    const parentIds = path.slice(0, -1);

    if (!node.isLeaf) {
      parentIds.push(node.id);
    }

    treeRef?.expandNodes(parentIds);

    selectedId = node.id;
    highlightedId = node.id;

    setTimeout(() => {
      document.getElementById(`tree-node-${node.id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);

    if (highlightTimeoutId) clearTimeout(highlightTimeoutId);
    highlightTimeoutId = setTimeout(() => {
      highlightedId = undefined;
    }, 2000);
  }

  function handleJump(value: string) {
    const node = allNodes.find((item) => item.id === value);
    if (node) {
      handleAutocompleteSelect(node);
      return;
    }
    searchQuery = value;
  }

  function handleSelect(node: TreeNode) {
    selectedId = node.id;
    onSelect?.(node);
  }
</script>

<div class="tree-with-search">
  <div class="tree-search-container">
    <div class="search-input-wrapper">
      <i class="fas fa-search search-icon"></i>
      <AutocompleteInput
        bind:value={jumpValue}
        options={searchOptions}
        variant="ghost"
        fullWidth
        class="search-input"
        placeholder={placeholder}
        onInput={(query) => {
          searchQuery = query;
        }}
        onchange={handleJump}
      />
      {#if searchQuery}
        <button
          type="button"
          class="clear-button"
          aria-label={t('inventory.clearSearch')}
          onclick={() => {
            searchQuery = '';
            jumpValue = '';
          }}
        >
          <i class="fas fa-times"></i>
        </button>
      {/if}
    </div>
  </div>

  <div class="tree-container">
    <Tree
      bind:this={treeRef}
      nodes={filteredTree}
      {initialExpandedIds}
      {selectedId}
      {highlightedId}
      onSelect={handleSelect}
      {onDelete}
      {onEdit}
      {onDrop}
      {contextMenu}
      {isDynamicTree}
    />
  </div>
</div>

<style>
  .tree-with-search {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.75rem;
  }

  .tree-search-container {
    position: relative;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .search-input-wrapper :global(.shw-autocomplete-root) {
    width: 100%;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    z-index: 1;
    color: var(--shw-color-text-muted, #9a93ad);
    pointer-events: none;
  }

  .tree-with-search :global(.search-input .shw-autocomplete-input),
  .tree-with-search :global(.shw-autocomplete-input.search-input) {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 2.25rem;
    font-size: 14px;
  }

  .clear-button {
    position: absolute;
    right: 0.5rem;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    padding: 0.25rem 0.5rem;
    border: none;
    background: none;
    color: var(--shw-color-text-muted, #9a93ad);
    cursor: pointer;
  }

  .clear-button:hover {
    color: var(--shw-color-text, #e8e4f0);
  }

  .tree-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
</style>
