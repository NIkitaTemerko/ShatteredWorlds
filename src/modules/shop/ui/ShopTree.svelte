<script lang="ts">
  import { t, localize } from "../../../shared/i18n";
  import type { TreeNode } from "../../../shared/ui/tree";
  import { TreeWithSearch } from "../../../shared/ui/tree";
  import {
    getShopTreeState,
    updateShopTreeState,
    loadShopTreeItems,
    buildLocationPathMap,
    loadShopDatabase,
    addMerchantItem,
    addItemToLocation,
    deleteMerchantItem,
  } from "../model";
  import type { ShopNode, MerchantInventoryItem } from "../model/types";

  interface Props {
    onSelectNode?: (node: ShopNode) => void;
    onDeleteNode?: (node: ShopNode) => void;
    onEditNode?: (node: ShopNode) => void;
    onEditMerchantItem?: (merchantId: string, item: MerchantInventoryItem) => void;
  }

  let { onSelectNode, onDeleteNode, onEditNode, onEditMerchantItem }: Props = $props();

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

  /**
   * Находит ShopNode по TreeNode (работает для листьев, категорий, предметов торговцев)
   */
  function findShopNode(node: TreeNode): ShopNode | undefined {
    if (node.data) {
      const data = node.data as any;

      // Если это предмет торговца, возвращаем его торговца
      if (data.type === "merchant-item") {
        const db = loadShopDatabase();
        return db.nodes.find((n) => n.id === data.merchantId) as ShopNode;
      }

      // Обычная нода (торговец без предметов или пустая локация)
      return data as ShopNode;
    }

    if (!node.isLeaf) {
      // Категория (торговец с предметами или локация с детьми)
      // Сначала пробуем найти локацию
      let shopNode = locationMap.get(node.id);

      // Если не нашли, это торговец с предметами - ищем по пути
      if (!shopNode) {
        const db = loadShopDatabase();
        const nodeName = node.id.split("/").pop();

        shopNode = db.nodes.find((n) => {
          if (n.name !== nodeName) return false;

          // Строим путь для ноды и сравниваем с node.id
          const buildPath = (shopNode: ShopNode): string => {
            if (!shopNode.parentId) return shopNode.name;
            const parent = db.nodes.find((p) => p.id === shopNode.parentId);
            if (!parent) return shopNode.name;
            return `${buildPath(parent)}/${shopNode.name}`;
          };

          return buildPath(n) === node.id;
        });
      }

      return shopNode;
    }

    return undefined;
  }

  function handleSelect(node: TreeNode) {
    const shopNode = findShopNode(node);
    if (shopNode) {
      onSelectNode?.(shopNode);
    }
  }

  function handleDelete(node: TreeNode, e: Event) {
    e.stopPropagation();

    // Проверяем, это предмет торговца или нода магазина
    if (node.data) {
      const data = node.data as any;

      // Если это предмет торговца, удаляем его
      if (data.type === "merchant-item") {
        deleteMerchantItem(data.merchantId, data.item.itemId);
        refreshTree();
        return;
      }
    }

    // Для всех остальных случаев - удаляем саму ноду
    const shopNode = findShopNode(node);
    if (shopNode) {
      onDeleteNode?.(shopNode);
    }
  }

  function handleEdit(node: TreeNode, e: Event) {
    e.stopPropagation();

    // Проверяем, это предмет торговца или нода магазина
    if (node.data) {
      const data = node.data as any;

      // Если это предмет торговца, вызываем специальный колбэк
      if (data.type === "merchant-item") {
        onEditMerchantItem?.(data.merchantId, data.item);
        return;
      }
    }

    // Для всех остальных случаев - редактируем саму ноду
    const shopNode = findShopNode(node);
    if (shopNode) {
      onEditNode?.(shopNode);
    }
  }

  const pluralRules = new Intl.PluralRules("ru");

  async function handleDrop(node: TreeNode, itemData: any) {
    console.log("handleDrop called with:", { node, itemData });

    // Проверяем что это Foundry Item
    if (!itemData || itemData.type !== "Item") {
      ui.notifications?.warn(t("shop.notifications.onlyItemsAllowed"));
      return;
    }

    if (!itemData.uuid) {
      ui.notifications?.warn(t("shop.notifications.invalidItemData"));
      return;
    }

    // Получаем ShopNode используя общую функцию
    const shopNode = findShopNode(node);

    if (!shopNode) {
      console.error("Could not find shop node for:", node);
      ui.notifications?.warn(t("shop.notifications.invalidShopNode"));
      return;
    }

    // Диалог для ввода цены и количества
    const result = (await foundry.appv1.api.Dialog.wait({
      title: t("shop.dialogs.addItemTitle"),
      content: `
        <form>
          <div class="form-group">
            <label>${t("shop.dialogs.priceLabel")}</label>
            <input type="number" name="price" value="10" min="0" step="1" />
          </div>
          <div class="form-group">
            <label>${t("shop.dialogs.quantityLabel")}</label>
            <input type="number" name="quantity" value="-1" step="1" />
          </div>
        </form>
      `,
      buttons: {
        add: {
          label: t("shop.dialogs.add"),
          callback: (html: JQuery<HTMLElement>) => {
            const form = html[0].querySelector("form") as HTMLFormElement;
            const formData = new FormData(form);
            return {
              price: Number.parseInt(formData.get("price") as string) || 10,
              quantity: Number.parseInt(formData.get("quantity") as string) || -1,
            };
          },
        },
        cancel: {
          label: t("shop.dialogs.cancel"),
        },
      },
      default: "add",
    })) as { price: number; quantity: number } | null;

    if (result) {
      if (shopNode.type === "merchant") {
        addMerchantItem(shopNode.id, itemData.uuid, result.price, result.quantity);
      } else if (shopNode.type === "location") {
        addItemToLocation(shopNode.id, itemData.uuid, result.price, result.quantity);
      }
      refreshTree();
    }
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
      onDrop={handleDrop}
      isDynamicTree={true}
      onStateChange={handleStateChange}
    />
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
</style>
