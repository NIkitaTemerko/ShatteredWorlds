<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { t } from "../../../shared/i18n";
  import { Input } from "../../../shared/ui";
  import type { MerchantInventoryItem } from "../model/types";
  import { SHOP_NODE_COLORS } from "../model/constants";

  interface Props {
    merchantId: string;
    merchantName: string;
    item: MerchantInventoryItem;
    onSave: (updates: { price?: number; quantity?: number }) => void;
    onCancel: () => void;
  }

  let { merchantId, merchantName, item, onSave, onCancel }: Props = $props();

  let price = $state(item.price);
  let quantity = $state(item.quantity);

  const colors = SHOP_NODE_COLORS.merchant;

  // Получаем имя предмета
  const itemName = $derived.by(() => {
    try {
      const foundryItem = fromUuidSync(item.itemId) as ShwItem | null;
      return foundryItem?.name || item.itemId.split(".").pop() || t("shop.merchantItem.unknownItem");
    } catch (error) {
      console.error("Failed to get item name:", error);
      return item.itemId.split(".").pop() || t("shop.merchantItem.unknownItem");
    }
  });

  function handleSave() {
    onSave({ price, quantity });
  }

  function handleCancel() {
    onCancel();
  }

  function handleOpenItem() {
    try {
      const foundryItem = fromUuidSync(item.itemId) as ShwItem | null;
      if (foundryItem?.sheet) {
        foundryItem.sheet.render(true);
      }
    } catch (error) {
      console.error("Failed to open item sheet:", error);
      ui.notifications?.error(t("shop.merchantItem.errorOpenItem"));
    }
  }
</script>

<div class="merchant-item-editor" style="--dark:{colors.dark}; --light:{colors.light}">
  <div class="editor-header">
    <h3>
      <i class="fas fa-box"></i>
      {t("shop.merchantItem.title")}
    </h3>
  </div>

  <div class="editor-content">
    <div class="item-info">
      <button type="button" class="item-link" onclick={handleOpenItem}>
        <i class="fas fa-external-link-alt"></i>
        {itemName}
      </button>
      <div class="merchant-name">
        <i class="fas fa-user-tie"></i>
        {t("shop.merchantItem.merchant")}: {merchantName}
      </div>
    </div>

    <div class="form-group">
      <label for="item-price">{t("shop.merchantItem.price")}</label>
      <Input
        id="item-price"
        type="number"
        value={price.toString()}
        oninput={(e) => (price = Number.parseInt(e.currentTarget.value) || 0)}
        placeholder={t("shop.merchantItem.pricePlaceholder")}
        min="0"
        step="1"
      />
    </div>

    <div class="form-group">
      <label for="item-quantity">{t("shop.merchantItem.quantity")}</label>
      <Input
        id="item-quantity"
        type="number"
        value={quantity.toString()}
        oninput={(e) => (quantity = Number.parseInt(e.currentTarget.value) || -1)}
        placeholder={t("shop.merchantItem.quantityPlaceholder")}
        step="1"
      />
      <small class="help-text">{t("shop.merchantItem.quantityHelp")}</small>
    </div>
  </div>

  <div class="editor-footer">
    <button type="button" class="cancel-button" onclick={handleCancel}>{t("shop.merchantItem.cancel")}</button>
    <button type="button" class="save-button" onclick={handleSave}>{t("shop.merchantItem.save")}</button>
  </div>
</div>

<style>
  .merchant-item-editor {
    display: flex;
    flex-direction: column;
    min-width: 400px;
    max-width: 600px;
  }

  .editor-header {
    padding: 1rem;
    background: rgba(180, 179, 186, 0.3);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  .editor-header h3 {
    margin: 0;
    color: #1a1820;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    border-bottom: none;
  }

  .editor-header i {
    color: #1a1820;
  }

  .editor-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    border-left: 3px solid rgba(0, 0, 0, 0.2);
  }

  .item-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s;
    text-align: left;
    color: #1a1820;
  }

  .item-link:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.3);
  }

  .item-link i {
    color: #666;
  }

  .merchant-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: #1a1820;
    font-size: 14px;
  }

  .help-text {
    font-size: 0.85rem;
    color: #666;
    font-style: italic;
  }

  .editor-footer {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .cancel-button,
  .save-button {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cancel-button {
    background: rgba(0, 0, 0, 0.1);
    color: #1a1820;
  }

  .cancel-button:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  .save-button {
    background: var(--dark);
    color: white;
  }

  .save-button:hover {
    opacity: 0.9;
  }
</style>
