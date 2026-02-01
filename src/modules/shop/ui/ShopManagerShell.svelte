<script lang="ts">
  import { mount } from "svelte";
  import { t, localize } from "../../../shared/i18n";
  import ShopTree from "./ShopTree.svelte";
  import NodeEditorDialog from "./NodeEditorDialog.svelte";
  import MerchantItemEditorDialog from "./MerchantItemEditorDialog.svelte";
  import {
    deleteNode,
    addNode,
    updateNode,
    loadShopDatabase,
    updateMerchantItem,
    deleteMerchantItem,
    type ShopNode,
    type LocationNode,
    type MerchantNode,
    type MerchantInventoryItem,
  } from "../model";

  let shopTreeRef: ShopTree | undefined = $state();

  function handleEditNode(node: ShopNode) {
    openNodeEditor(node);
  }

  function handleEditMerchantItem(merchantId: string, item: MerchantInventoryItem) {
    openMerchantItemEditor(merchantId, item);
  }

  function openMerchantItemEditor(merchantId: string, item: MerchantInventoryItem) {
    const db = loadShopDatabase();
    const merchant = db.nodes.find((n) => n.id === merchantId);

    if (!merchant || merchant.type !== "merchant") {
      ui.notifications?.error(t("shop.notifications.merchantNotFound"));
      return;
    }

    const dialog = new Dialog(
      {
        title: " ",
        content: '<div id="merchant-item-editor-mount"></div>',
        buttons: {},
        render: (html) => {
          const container = html.find("#merchant-item-editor-mount")[0];
          if (container) {
            mount(MerchantItemEditorDialog, {
              target: container,
              props: {
                merchantId,
                merchantName: merchant.name,
                item,
                onSave: (updates: { price?: number; quantity?: number }) => {
                  updateMerchantItem(merchantId, item.itemId, updates);
                  shopTreeRef?.refreshTree();
                  dialog.close();
                  ui.notifications?.info(t("shop.notifications.itemUpdated"));
                },
                onCancel: () => {
                  dialog.close();
                },
              },
            });
          }
        },
        close: () => {},
      },
      {
        width: 500,
        height: "auto",
      },
    );
    dialog.render(true);
  }

  function openNodeEditor(node: ShopNode) {
    const dialog = new Dialog(
      {
        title: " ",
        content: '<div id="node-editor-mount"></div>',
        buttons: {},
        render: (html) => {
          const container = html.find("#node-editor-mount")[0];
          if (container) {
            mount(NodeEditorDialog, {
              target: container,
              props: {
                node,
                onSave: (updates: Partial<ShopNode>) => {
                  updateNode(node.id, updates);
                  shopTreeRef?.refreshTree();
                  dialog.close();
                  ui.notifications?.info(
                    localize("shop.notifications.nodeUpdated", { name: updates.name || node.name }),
                  );
                },
                onCancel: () => {
                  dialog.close();
                },
              },
            });
          }
        },
        close: () => {},
      },
      {
        width: 500,
        height: "auto",
      },
    );
    dialog.render(true);
  }

  async function handleDeleteNode(node: ShopNode) {
    const confirmed = await Dialog.confirm({
      title: t("shop.dialogs.deleteNodeTitle"),
      content: `<p>${localize("shop.dialogs.deleteNodeContent", { name: node.name })}</p>`,
    });

    if (confirmed) {
      deleteNode(node.id);
      shopTreeRef?.refreshTree();
      ui.notifications?.info(localize("shop.notifications.nodeDeleted", { name: node.name }));
    }
  }

  async function handleAddLocation() {
    const db = loadShopDatabase();
    const locations = db.nodes.filter((n) => n.type === "location");

    console.log("handleAddLocation called, locations count:", locations.length);

    let parentId: string | undefined = undefined;

    // Если есть локации, предлагаем выбрать родителя
    if (locations.length > 0) {
      const choices = {
        "": t("shop.dialogs.rootLocation"),
        ...Object.fromEntries(locations.map((loc) => [loc.id, loc.name])),
      };

      const dialog2 = new Dialog({
        title: t("shop.dialogs.addLocationTitle"),
        content: `
          <form>
            <div class="form-group">
              <label>${t("shop.dialogs.parentLocation")}</label>
              <select id="parent-select" style="width: 100%; padding: 0.375rem 0.5rem; margin-top: 0.5rem; border: 1px solid #ccc; border-radius: 4px; background: white; font-size: 14px; color: #1a1820; line-height: 1.5; height: auto;">
                ${Object.entries(choices)
                  .map(([value, label]) => `<option value="${value}">${label}</option>`)
                  .join("")}
              </select>
            </div>
          </form>
        `,
        buttons: {
          ok: {
            label: t("shop.dialogs.create"),
            callback: (html) => {
              const select = html.find("#parent-select")[0] as HTMLSelectElement;
              parentId = select.value || undefined;

              console.log("Creating location with parentId:", parentId);

              const newLocation: LocationNode = {
                id: foundry.utils.randomID(),
                name: t("shop.dialogs.newLocation"),
                type: "location",
                description: "",
                parentId,
              };
              addNode(newLocation);
              console.log("Location added, refreshing tree");
              shopTreeRef?.refreshTree();
              ui.notifications?.info(t("shop.notifications.locationAdded"));
            },
          },
          cancel: {
            label: t("shop.dialogs.cancel"),
          },
        },
        default: "ok",
      });
      dialog2.render(true);
    } else {
      // Если локаций нет, создаем корневую
      console.log("Creating root location");
      const newLocation: LocationNode = {
        id: foundry.utils.randomID(),
        name: t("shop.dialogs.newLocation"),
        type: "location",
        description: "",
      };
      addNode(newLocation);
      console.log("Root location added, refreshing tree");
      shopTreeRef?.refreshTree();
      ui.notifications?.info(t("shop.notifications.locationAdded"));
    }
  }

  async function handleAddMerchant() {
    const db = loadShopDatabase();
    const locations = db.nodes.filter((n) => n.type === "location");

    if (locations.length === 0) {
      ui.notifications?.warn(t("shop.notifications.createLocationFirst"));
      return;
    }

    const choices = Object.fromEntries(locations.map((loc) => [loc.id, loc.name]));

    const dialog3 = new Dialog({
      title: t("shop.dialogs.addMerchantTitle"),
      content: `
        <form>
          <div class="form-group">
            <label>${t("shop.dialogs.merchantLocation")}</label>
            <select id="parent-select" style="width: 100%; padding: 0.375rem 0.5rem; margin-top: 0.5rem; border: 1px solid #ccc; border-radius: 4px; background: white; font-size: 14px; color: #1a1820; line-height: 1.5; height: auto;">
              ${Object.entries(choices)
                .map(([value, label]) => `<option value="${value}">${label}</option>`)
                .join("")}
            </select>
          </div>
        </form>
      `,
      buttons: {
        ok: {
          label: t("shop.dialogs.create"),
          callback: (html) => {
            const select = html.find("#parent-select")[0] as HTMLSelectElement;
            const parentId = select.value;

            if (!parentId) {
              ui.notifications?.warn(t("shop.notifications.selectLocation"));
              return;
            }

            const newMerchant: MerchantNode = {
              id: foundry.utils.randomID(),
              name: t("shop.dialogs.newMerchant"),
              type: "merchant",
              description: "",
              inventory: [],
              parentId,
            };
            addNode(newMerchant);
            shopTreeRef?.refreshTree();
            ui.notifications?.info(t("shop.notifications.merchantAdded"));
          },
        },
        cancel: {
          label: t("shop.dialogs.cancel"),
        },
      },
      default: "ok",
    });
    dialog3.render(true);
  }
</script>

<div class="shop-manager-shell">
  <div class="header">
    <h2>Магазины</h2>
    <div class="header-buttons">
      <button type="button" class="add-button location" onclick={handleAddLocation} title="Добавить локацию">
        <i class="fas fa-map-marker-alt"></i>
        Локация
      </button>
      <button type="button" class="add-button merchant" onclick={handleAddMerchant} title="Добавить торговца">
        <i class="fas fa-user-tie"></i>
        Торговец
      </button>
    </div>
  </div>

  <div class="content">
    <ShopTree
      bind:this={shopTreeRef}
      onEditNode={handleEditNode}
      onDeleteNode={handleDeleteNode}
      onEditMerchantItem={handleEditMerchantItem}
    />
  </div>
</div>

<style>
  .shop-manager-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
    background: #b4b3ba;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .header h2 {
    margin: 0;
    padding-bottom: 0.25rem;
    color: #1a1820;
    font-size: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  .header-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .add-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-button.location {
    background: rgba(139, 92, 246, 0.25);
    color: #5b21b6;
  }

  .add-button.location:hover {
    background: rgba(139, 92, 246, 0.35);
  }

  .add-button.merchant {
    background: rgba(245, 158, 11, 0.25);
    color: #92400e;
  }

  .add-button.merchant:hover {
    background: rgba(245, 158, 11, 0.35);
  }

  .content {
    flex: 1;
    color: #1a1820;
    min-height: 0;
  }
</style>
