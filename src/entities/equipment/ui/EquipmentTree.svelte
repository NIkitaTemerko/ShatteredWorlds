<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { t } from "../../../shared/i18n";
  import type { TreeNode, ContextMenuArgs } from "../../../shared/ui/tree";
  import { TreeWithSearch } from "../../../shared/ui/tree";
  import type { PopupMenuItem } from "../../inventory/ui/PopupMenu";
  import { PopupMenuDropdown } from "../../inventory/ui/PopupMenu";
  import { mapEquipmentToFlatItems } from "../model/mappers";
  import { getEquipmentTreeState, updateEquipmentTreeState } from "../model/equipmentTreeState";

  interface Props {
    actorId: string;
    items: ShwItem[];
    itemCount: number;
    onSelectItem?: (item: ShwItem) => void;
    onUnequipItem?: (item: ShwItem) => void;
  }

  let { actorId, items, itemCount, onSelectItem, onUnequipItem }: Props = $props();

  const treeState = $derived(getEquipmentTreeState(actorId));
  const flatItems = $derived(mapEquipmentToFlatItems(items));

  function handleStateChange(state: { searchQuery: string; expandedIds: Set<string>; selectedId?: string }) {
    updateEquipmentTreeState(actorId, state);
  }

  function getPluralForm(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return t("characterEquipment.itemPlurals.many");
    }
    if (lastDigit === 1) {
      return t("characterEquipment.itemPlurals.one");
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return t("characterEquipment.itemPlurals.few");
    }
    return t("characterEquipment.itemPlurals.many");
  }

  function handleEdit(node: TreeNode, e: Event) {
    e.stopPropagation();
    if (node.isLeaf && node.data) {
      onSelectItem?.(node.data as ShwItem);
    }
  }

  function handleDelete(node: TreeNode, e: Event) {
    e.stopPropagation();
    if (node.isLeaf && node.data) {
      onUnequipItem?.(node.data as ShwItem);
    }
  }

  function getMenuItems(node: TreeNode): PopupMenuItem[] {
    if (!node.isLeaf || !node.data) return [];

    const item = node.data as ShwItem;
    const menuItems: PopupMenuItem[] = [];

    if (onSelectItem) {
      menuItems.push({
        type: "action",
        label: t("inventory.menu.edit"),
        icon: "fas fa-edit",
        onClick: (e: Event) => {
          e.stopPropagation();
          onSelectItem(item);
        },
      });
    }

    if (onUnequipItem) {
      menuItems.push({
        type: "action",
        label: t("characterEquipment.menu.unequip"),
        icon: "fas fa-box-open",
        onClick: (e: Event) => {
          e.stopPropagation();
          onUnequipItem(item);
        },
      });
    }

    return menuItems;
  }
</script>

{#snippet equipmentContextMenu({ node }: ContextMenuArgs)}
  <PopupMenuDropdown items={getMenuItems(node)} />
{/snippet}

<div class="equipment-tree">
  <div class="search-wrapper">
    <TreeWithSearch
      items={flatItems}
      initialSearchQuery={treeState.searchQuery}
      initialExpandedIds={treeState.expandedIds}
      initialSelectedId={treeState.selectedId}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onStateChange={handleStateChange}
      contextMenu={onUnequipItem ? equipmentContextMenu : undefined}
    />
    <div class="item-count-bar">
      <span class="item-count">{itemCount} {getPluralForm(itemCount)}</span>
    </div>
  </div>
</div>

<style>
  .equipment-tree {
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
    background: rgba(139, 92, 246, 0.15);
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .item-count {
    font-size: 13px;
    color: #1a1a1a;
    font-weight: 600;
  }
</style>
