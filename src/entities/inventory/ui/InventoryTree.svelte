<script lang="ts">
  import type { TreeNode } from "../../../shared/ui/tree";
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { TreeWithSearch } from "../../../shared/ui/tree";
  import { mapInventoryToFlatItems } from "../model/mappers";
  import { localize, t } from "../../../shared/i18n";

  interface Props {
    items: ShwItem[];
    itemCount: number;
    onSelectItem?: (item: ShwItem) => void;
    onDeleteItem?: (item: ShwItem) => void;
  }

  let { items, itemCount, onSelectItem, onDeleteItem }: Props = $props();

  const flatItems = $derived(mapInventoryToFlatItems(items));

  function getPluralForm(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return t("inventory.itemPlurals.many");
    }
    if (lastDigit === 1) {
      return t("inventory.itemPlurals.one");
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return t("inventory.itemPlurals.few");
    }
    return t("inventory.itemPlurals.many");
  }

  function handleSelect(node: TreeNode) {
    if (node.isLeaf && node.data) {
      const item = node.data as ShwItem;
      onSelectItem?.(item);
    }
  }

  function handleDelete(node: TreeNode, e: Event) {
    e.stopPropagation();
    if (node.isLeaf && node.data) {
      const item = node.data as ShwItem;
      onDeleteItem?.(item);
    }
  }
</script>

<div class="inventory-tree">
  <div class="search-wrapper">
    <TreeWithSearch items={flatItems} onSelect={handleSelect} onDelete={handleDelete} />
    <div class="item-count-bar">
      <span class="item-count">{itemCount} {getPluralForm(itemCount)}</span>
    </div>
  </div>
</div>

<style>
  .inventory-tree {
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

  .item-count-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    background: rgba(222, 184, 135, 0.15);
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .item-count {
    font-size: 13px;
    color: #1a1a1a;
    font-weight: 600;
  }
</style>
