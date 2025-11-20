<script lang="ts">
  import type { FlatItem, TreeNode } from "./types";
  import { buildTreeFromFlatList, filterTree, findNodePath, collectLeafNodes } from "./treeUtils";
  import Tree from "./Tree.svelte";
  import { t } from "../../../shared/i18n";
  import { Input } from "../Input";

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
    onSelect?: (node: TreeNode) => void;
    onDelete?: (node: TreeNode, e: Event) => void;
    onStateChange?: (state: TreeStateUpdate) => void;
  }

  let {
    items,
    initialSearchQuery = "",
    initialExpandedIds,
    initialSelectedId,
    onSelect,
    onDelete,
    onStateChange,
  }: Props = $props();

  let searchQuery = $state(initialSearchQuery);
  let selectedId = $state<string | undefined>(initialSelectedId);
  let highlightedId = $state<string | undefined>(undefined);
  let showAutocomplete = $state(false);
  let treeRef: Tree | undefined = $state();
  let highlightTimeoutId: ReturnType<typeof setTimeout> | undefined;

  // Notify parent of state changes
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
  const allLeaves = $derived(collectLeafNodes(fullTree));

  const autocompleteMatches = $derived.by(() => {
    if (!searchQuery.trim()) return allLeaves ?? [];
    const lower = searchQuery.toLowerCase();
    return allLeaves.filter((leaf: TreeNode) => leaf.label.toLowerCase().includes(lower)).slice(0, 10);
  });

  function handleSearchInput(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    searchQuery = input.value;
    showAutocomplete = !!searchQuery.trim();
  }

  function handleAutocompleteSelect(leaf: TreeNode) {
    searchQuery = "";
    showAutocomplete = false;

    // Find path to this node and expand all parents
    const path = findNodePath(fullTree, leaf.id);
    const parentIds = path.slice(0, -1); // All except the leaf itself

    treeRef?.expandNodes(parentIds);

    // Highlight the item
    selectedId = leaf.id;
    highlightedId = leaf.id;

    // Scroll to item (with slight delay for expansion animation)
    setTimeout(() => {
      const element = document.getElementById(`tree-node-${leaf.id}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    // Clear highlight after 2 seconds
    if (highlightTimeoutId) clearTimeout(highlightTimeoutId);
    highlightTimeoutId = setTimeout(() => {
      highlightedId = undefined;
    }, 2000);
  }

  function handleSelect(node: TreeNode) {
    selectedId = node.id;
    onSelect?.(node);
  }

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest(".tree-search-container")) {
      showAutocomplete = false;
    }
  }
</script>

<svelte:document onclick={handleClickOutside} />

<div class="tree-with-search">
  <div class="tree-search-container">
    <div class="search-input-wrapper">
      <i class="fas fa-search search-icon"></i>
      <Input
        textAlign="left"
        type="text"
        variant="underline"
        class="search-input"
        placeholder={t("inventory.searchPlaceholder")}
        value={searchQuery}
        oninput={handleSearchInput}
        onfocus={() => {
          showAutocomplete = true;
        }}
      />
      {#if searchQuery}
        <button
          class="clear-button"
          aria-label={t("inventory.clearSearch")}
          onclick={() => {
            searchQuery = "";
            showAutocomplete = false;
          }}
        >
          <i class="fas fa-times"></i>
        </button>
      {/if}
    </div>

    {#if showAutocomplete && autocompleteMatches.length > 0}
      <div class="autocomplete-dropdown">
        {#each autocompleteMatches as match (match.id)}
          <div
            class="autocomplete-item"
            onclick={() => handleAutocompleteSelect(match)}
            onkeydown={(e) => e.key === "Enter" && handleAutocompleteSelect(match)}
            role="button"
            tabindex="0"
          >
            <span>{match.label}</span>
          </div>
        {/each}
      </div>
    {/if}
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
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
  }

  .tree-with-search :global(.search-input) {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 2.25rem;
    background: rgba(222, 184, 135, 0.25);
    color: #1a1a1a;
    font-size: 14px;
    outline: none;
    transition: background-color 0.15s;
    height: 42px;
  }

  .tree-with-search :global(.search-input:focus) {
    border-color: rgba(222, 184, 135, 0.25);
    background: rgba(222, 184, 135, 0.35);
  }

  .tree-with-search :global(.search-input::placeholder) {
    color: rgba(26, 26, 26, 0.5);
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    color: rgba(100, 100, 100, 0.6);
    pointer-events: none;
  }

  .clear-button {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: rgba(100, 100, 100, 0.6);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s;
    width: auto;
  }

  .clear-button:hover {
    color: rgba(26, 26, 26, 0.8);
  }

  .autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    background: rgba(222, 184, 135, 0.25);
    border: none;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
  }

  .autocomplete-item {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s;
    color: #1a1a1a;
  }

  .autocomplete-item:hover {
    background-color: rgba(222, 184, 135, 0.5);
  }

  .tree-container {
    flex: 1;
    overflow-y: auto;
    background: rgba(222, 184, 135, 0.12);
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
  }
</style>
