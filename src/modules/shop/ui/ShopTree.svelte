<script lang="ts">
  import type { TreeNode } from "../../../shared/ui/tree";
  import { TreeWithSearch } from "../../../shared/ui/tree";
  import {
    getShopTreeState,
    updateShopTreeState,
    loadShopTreeItems,
    buildLocationPathMap,
    loadShopDatabase,
  } from "../model";
  import type { ShopNode } from "../model/types";

  interface Props {
    onSelectNode?: (node: ShopNode) => void;
    onDeleteNode?: (node: ShopNode) => void;
    onEditNode?: (node: ShopNode) => void;
  }

  let { onSelectNode, onDeleteNode, onEditNode }: Props = $props();

  const treeState = $derived(getShopTreeState());

  // Загружаем элементы из LocalStorage
  let flatItems = $state(loadShopTreeItems());
  let locationMap = $state(buildLocationPathMap(loadShopDatabase().nodes));

  // Функция для перезагрузки данных (вызывается после изменений)
  export function refreshTree() {
    flatItems = loadShopTreeItems();
    locationMap = buildLocationPathMap(loadShopDatabase().nodes);
  }

  function handleStateChange(state: { searchQuery: string; expandedIds: Set<string>; selectedId?: string }) {
    updateShopTreeState(state);
  }

  function handleSelect(node: TreeNode) {
    // Листья (торговцы) имеют data
    if (node.data) {
      const shopNode = node.data as ShopNode;
      onSelectNode?.(shopNode);
    }
    // Категории (локации) ищем в карте по id (который равен path)
    else if (!node.isLeaf) {
      const location = locationMap.get(node.id);
      if (location) {
        onSelectNode?.(location);
      }
    }
  }

  function handleDelete(node: TreeNode, e: Event) {
    e.stopPropagation();
    // Листья (торговцы) имеют data
    if (node.data) {
      const shopNode = node.data as ShopNode;
      onDeleteNode?.(shopNode);
    }
    // Категории (локации) ищем в карте по id (который равен path)
    else if (!node.isLeaf) {
      const location = locationMap.get(node.id);
      if (location) {
        onDeleteNode?.(location);
      }
    }
  }

  function handleEdit(node: TreeNode, e: Event) {
    e.stopPropagation();
    // Листья (торговцы) имеют data
    if (node.data) {
      const shopNode = node.data as ShopNode;
      onEditNode?.(shopNode);
    }
    // Категории (локации) ищем в карте по id (который равен path)
    else if (!node.isLeaf) {
      const location = locationMap.get(node.id);
      if (location) {
        onEditNode?.(location);
      }
    }
  }

  function getNodeCount(): number {
    return flatItems.length;
  }

  function getPluralForm(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "нод";
    }
    if (lastDigit === 1) {
      return "нода";
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return "ноды";
    }
    return "нод";
  }
</script>

<div class="shop-tree">
  <div class="search-wrapper">
    <TreeWithSearch
      items={flatItems}
      initialSearchQuery={treeState.searchQuery}
      initialExpandedIds={treeState.expandedIds}
      initialSelectedId={treeState.selectedId}
      onSelect={handleSelect}
      onDelete={handleDelete}
      onEdit={handleEdit}
      isDynamicTree={true}
      onStateChange={handleStateChange}
    />
    <div class="node-count-bar">
      <span class="node-count">{getNodeCount()} {getPluralForm(getNodeCount())}</span>
    </div>
  </div>
</div>

<style>
  .shop-tree {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .search-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .node-count-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    background: rgba(139, 92, 246, 0.15);
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .node-count {
    font-size: 13px;
    color: #1a1a1a;
    font-weight: 600;
  }
</style>
