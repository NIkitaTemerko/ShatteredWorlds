<script lang="ts">
  import { Input, SelectInput } from "../../../shared/ui";
  import type { ShopNode, LocationNode, MerchantNode } from "../model/types";
  import { SHOP_NODE_COLORS } from "../model/constants";
  import { loadShopDatabase } from "../model/storage";

  interface Props {
    node: ShopNode;
    onSave: (updates: Partial<ShopNode>) => void;
    onCancel: () => void;
  }

  let { node, onSave, onCancel }: Props = $props();

  let name = $state(node.name);
  let description = $state("description" in node ? node.description || "" : "");
  let parentId = $state(node.parentId || "");

  const colors = $derived(SHOP_NODE_COLORS[node.type]);

  // Загружаем доступные родительские ноды (только локации)
  const availableParents = $derived.by(() => {
    const db = loadShopDatabase();

    // Для торговцев - только локации
    // Для локаций - другие локации (кроме себя и своих потомков)
    const candidates = db.nodes.filter((n) => {
      if (n.id === node.id) return false; // Нельзя быть родителем самому себе

      if (node.type === "merchant") {
        return n.type === "location"; // Торговцы только в локациях
      }

      if (node.type === "location") {
        if (n.type !== "location") return false; // Локации только в локациях

        // Проверяем, не является ли кандидат потомком текущей ноды
        let current: ShopNode = n;
        while (current.parentId) {
          if (current.parentId === node.id) return false;
          const parent = db.nodes.find((nd) => nd.id === current.parentId);
          if (!parent) break;
          current = parent;
        }
        return true;
      }

      return false;
    });

    return [{ value: "", label: "(Корень)" }, ...candidates.map((n) => ({ value: n.id, label: n.name }))];
  });

  function handleSave() {
    const updates: Partial<ShopNode> = {
      name,
      parentId: parentId || undefined,
    };

    if ("description" in node) {
      (updates as Partial<LocationNode | MerchantNode>).description = description;
    }

    onSave(updates);
  }

  function handleCancel() {
    onCancel();
  }
</script>

<div class="node-editor" style="--dark:{colors.dark}; --light:{colors.light}">
  <div class="editor-header">
    <h3>
      <i class="fas {node.type === 'location' ? 'fa-map-marker-alt' : 'fa-user-tie'}"></i>
      {node.type === "location" ? "Редактировать локацию" : "Редактировать торговца"}
    </h3>
  </div>

  <div class="editor-content">
    <div class="form-group">
      <label for="node-name">Название</label>
      <Input
        id="node-name"
        type="text"
        value={name}
        oninput={(e) => (name = e.currentTarget.value)}
        placeholder="Введите название"
      />
    </div>

    <div class="form-group">
      <label for="node-parent">Родительская локация</label>
      <SelectInput id="node-parent" bind:value={parentId} options={availableParents} />
    </div>

    <div class="form-group">
      <label for="node-description">Описание</label>
      <textarea id="node-description" bind:value={description} placeholder="Введите описание (опционально)" rows="4"
      ></textarea>
    </div>
  </div>

  <div class="editor-footer">
    <button type="button" class="cancel-button" onclick={handleCancel}>Отмена</button>
    <button type="button" class="save-button" onclick={handleSave}>Сохранить</button>
  </div>
</div>

<style>
  .node-editor {
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

  .form-group textarea {
    padding: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
  }

  .form-group textarea:focus {
    outline: none;
    border-color: var(--dark);
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
