<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { t } from "../../../shared/i18n";
  import type { PopupMenuItem } from "../../../shared/ui/PopupMenu";
  import type { TreeNode } from "../../../shared/ui/tree";
  import { TreeWithSearch } from "../../../shared/ui/tree";
  import { getInventoryTreeState, updateInventoryTreeState } from "../model/inventoryTreeState";
  import { mapInventoryToFlatItems } from "../lib/mappers";

  interface Props {
    actorId: string;
    items: ShwItem[];
    itemCount: number;
    onSelectItem?: (item: ShwItem) => void;
    onDeleteItem?: (item: ShwItem) => void;
    onDuplicateItem?: (item: ShwItem) => void;
    onQuantityChange?: (item: ShwItem, newQuantity: number) => void;
  }

  let { actorId, items, itemCount, onSelectItem, onDeleteItem, onDuplicateItem, onQuantityChange }: Props = $props();

  const treeState = $derived(getInventoryTreeState(actorId));

  const flatItems = $derived(mapInventoryToFlatItems(items));

  // Версия данных — инкрементируется при обновлении предмета через Foundry hook
  let dataVersion = $state(0);

  // Получаем живой инстанс предмета из Foundry
  function getFoundryItem(item: ShwItem): any | null {
    if (!item?.id) return null;
    // Owned item (на акторе)
    if ((item as any).parent?.items) {
      return (item as any).parent.items.get(item.id) ?? null;
    }
    // Global item
    return (game as any).items?.get(item.id) ?? null;
  }

  // Подписка на Foundry updateItem hook — инвалидируем данные
  function onItemUpdate() {
    dataVersion++;
  }

  onMount(() => {
    Hooks.on("updateItem", onItemUpdate);
  });

  onDestroy(() => {
    Hooks.off("updateItem", onItemUpdate);
  });

  // Формирование пунктов меню для ноды — использует живые данные Foundry
  function getMenuItems(node: TreeNode): PopupMenuItem[] {
    // Обращаемся к dataVersion чтобы Svelte пересчитал $derived при его изменении
    void dataVersion;

    if (!node.isLeaf || !node.data) return [];

    const item = node.data as ShwItem;
    const liveItem = getFoundryItem(item);
    const menuItems: PopupMenuItem[] = [];

    // Количество — только для consumable
    if (onQuantityChange) {
      const sourceItem = liveItem ?? item;
      if ((sourceItem as any).type === "consumable") {
        const qty = (sourceItem as any).system?.quantity ?? 1;
        const limit = (sourceItem as any).system?.stackLimit ?? null;
        menuItems.push({
          type: "quantity",
          label: t("inventory.menu.quantity"),
          value: qty,
          min: 1,
          max: limit,
          onChange: (newQuantity: number) => {
            onQuantityChange!(item, newQuantity);
          },
        });
      }
    }

    if (onSelectItem) {
      menuItems.push({
        type: "action",
        label: t("inventory.menu.edit"),
        icon: "fas fa-edit",
        onClick: (e: Event) => {
          e.stopPropagation();
          onSelectItem!(item);
        },
      });
    }

    if (onDuplicateItem) {
      menuItems.push({
        type: "action",
        label: t("inventory.menu.duplicate"),
        icon: "fas fa-copy",
        onClick: (e: Event) => {
          e.stopPropagation();
          onDuplicateItem!(item);
        },
      });
    }

    if (onDeleteItem) {
      menuItems.push({
        type: "action",
        label: t("inventory.menu.delete"),
        icon: "fas fa-trash",
        danger: true,
        onClick: (e: Event) => {
          e.stopPropagation();
          onDeleteItem!(item);
        },
      });
    }

    return menuItems;
  }

  function handleStateChange(state: { searchQuery: string; expandedIds: Set<string>; selectedId?: string }) {
    updateInventoryTreeState(actorId, state);
  }

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
    // Обработка клика на ноду (разворачивание/сворачивание категорий)
  }

  function handleEdit(node: TreeNode, e: Event) {
    e.stopPropagation();
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
    <TreeWithSearch
      items={flatItems}
      initialSearchQuery={treeState.searchQuery}
      initialExpandedIds={treeState.expandedIds}
      initialSelectedId={treeState.selectedId}
      onSelect={handleSelect}
      onEdit={handleEdit}
      onDelete={handleDelete}
      getMenuItems={onDuplicateItem || onQuantityChange ? getMenuItems : undefined}
      onStateChange={handleStateChange}
    />
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
