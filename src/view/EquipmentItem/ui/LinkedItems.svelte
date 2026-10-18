<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { EquipmentSystem } from "../../../documents/Item/types/EquipmentDataTypes";
  import { t } from "../../../shared/i18n";
  import { getUpdateEquipment } from "../utils/updateEquipment";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateEquipment = $derived(getUpdateEquipment(item));

  const system = $derived(item.system as EquipmentSystem);
  const linkedIds = $derived(system.linkedItemIds ?? []);

  // Получаем привязанные предметы из глобальных Items (сохраняя удалённые как null)
  const linkedEntries = $derived(
    linkedIds.map((id: string) => ({
      id,
      item: (game as any).items?.get(id) as ShwItem | undefined,
    }))
  );

  function handleRemoveLinked(itemId: string) {
    const updated = linkedIds.filter((id: string) => id !== itemId);
    updateEquipment("linkedItemIds", updated);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const raw = event.dataTransfer?.getData("text/plain");
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      // Принимаем только Items (способности, заклинания)
      if (data.type !== "Item" || !data.uuid) return;

      const id = data.uuid.split(".").pop();
      if (!id) return;

      // Не добавляем дубликаты
      if (linkedIds.includes(id)) {
        ui.notifications?.warn(t("equipment.linkedItems.alreadyLinked"));
        return;
      }

      // Проверяем, что предмет существует и это способность или заклинание
      const droppedItem = (game as any).items?.get(id);
      if (!droppedItem) return;

      if (droppedItem.type !== "ability" && droppedItem.type !== "spell") {
        ui.notifications?.warn(t("equipment.linkedItems.wrongType"));
        return;
      }

      updateEquipment("linkedItemIds", [...linkedIds, id]);
    } catch {
      // Невалидный drag data — игнорируем
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "link";
    }
  }
</script>

<section style="--dark: #8b4fc9; --light: rgb(139 79 201 / 28%)">
  <div class="section-header">{t("equipment.linkedItems.title")}</div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="drop-zone" ondrop={handleDrop} ondragover={handleDragOver}>
    {#if linkedEntries.length === 0}
      <div class="drop-hint">{t("equipment.linkedItems.dropHint")}</div>
    {:else}
      <ul class="linked-list">
        {#each linkedEntries as entry (entry.id)}
          <li class="linked-item" class:missing={!entry.item}>
            {#if entry.item}
              <img src={entry.item.img} alt="" width="24" height="24" />
              <span class="linked-name">{entry.item.name} <span class="linked-type">({entry.item.type})</span></span>
            {:else}
              <span class="linked-name error">{t("equipment.linkedItems.deleted")}</span>
            {/if}
            <button
              class="remove-btn"
              onclick={() => handleRemoveLinked(entry.id)}
              title={t("equipment.linkedItems.remove")}
            >
              ✕
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<style>
  section {
    background: transparent;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: var(--shw-font, inherit);
  }

  .section-header {
    box-sizing: border-box;
    background: color-mix(in srgb, var(--dark, var(--shw-color-primary)) 55%, #1c1828);
    color: var(--shw-color-text, #e8e4f0);
    padding: 0.4rem 0.65rem;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    border-bottom: none;
    font-weight: 700;
    font-size: 13px;
    font-family: var(--shw-font, inherit);
  }

  .drop-zone {
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    border: 1px dashed var(--shw-color-border-bright, #6e6488);
    border-radius: 0;
    min-height: 60px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .drop-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }

  .linked-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .linked-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 6px;
    background: var(--shw-glass-fill, rgb(255 255 255 / 7%));
    border: 1px solid var(--shw-color-border, #4a425c);
    border-radius: 0;
    color: var(--shw-color-text, #e8e4f0);
  }

  .linked-item.missing {
    background: rgb(196 90 106 / 18%);
    border: 1px dashed #c45a6a;
  }

  .linked-item img {
    flex-shrink: 0;
    border-radius: 0;
  }

  .linked-name {
    flex: 1;
    font-size: 12px;
    font-weight: 600;
  }

  .linked-name.error {
    color: #e07a88;
    font-style: italic;
    font-weight: 400;
  }

  .linked-name :global(.linked-type) {
    font-size: 11px;
    font-weight: 400;
    color: var(--shw-color-text-muted, #9a93ad);
  }

  .remove-btn {
    background: none;
    border: none;
    color: #e07a88;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.15s;
    flex-shrink: 0;
    width: auto;
  }

  .remove-btn:hover {
    opacity: 1;
  }
</style>
