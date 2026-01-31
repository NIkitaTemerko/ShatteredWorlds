<script lang="ts">
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

  function handleDrop(node: TreeNode, itemData: any) {
    console.log("handleDrop called with:", { node, itemData });

    // Проверяем что это Foundry Item
    if (!itemData || itemData.type !== "Item") {
      ui.notifications?.warn("Можно добавлять только предметы");
      return;
    }

    if (!itemData.uuid) {
      ui.notifications?.warn("Неверные данные предмета");
      return;
    }

    // Получаем ShopNode используя общую функцию
    const shopNode = findShopNode(node);

    if (!shopNode) {
      console.error("Could not find shop node for:", node);
      ui.notifications?.warn("Неверная нода магазина");
      return;
    }

    // Диалог для ввода цены и количества
    new Dialog({
      title: "Добавить предмет",
      content: `
        <form>
          <div class="form-group">
            <label>Цена:</label>
            <input type="number" name="price" value="10" min="0" step="1" />
          </div>
          <div class="form-group">
            <label>Количество (-1 для неограниченного):</label>
            <input type="number" name="quantity" value="-1" step="1" />
          </div>
        </form>
      `,
      buttons: {
        add: {
          label: "Добавить",
          callback: (html: JQuery) => {
            // html это jQuery объект, используем jQuery методы
            const priceInput = html.find('[name="price"]')[0] as HTMLInputElement;
            const quantityInput = html.find('[name="quantity"]')[0] as HTMLInputElement;

            const price = Number.parseInt(priceInput?.value || "10");
            const quantity = Number.parseInt(quantityInput?.value || "-1");

            if (shopNode.type === "merchant") {
              addMerchantItem(shopNode.id, itemData.uuid, price, quantity);
            } else if (shopNode.type === "location") {
              addItemToLocation(shopNode.id, itemData.uuid, price, quantity);
            }

            refreshTree();
          },
        },
        cancel: {
          label: "Отмена",
        },
      },
      default: "add",
    }).render(true);
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
