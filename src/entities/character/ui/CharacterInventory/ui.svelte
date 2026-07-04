<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import type { ShwItem } from "../../../../documents/Item/ShwItem";
  import { localize, t } from "../../../../shared/i18n";
  import { equipItem, isItemEquipped } from "../../../../shared/helpers/Character/equipmentState";
  import { InventoryTree } from "../../../inventory";
  import { collectionToInventoryItems } from "../../../inventory/lib/mappers";

  interface Props {
    actor: ShwActor<"character">;
  }

  let { actor }: Props = $props();

  const inventoryItems = $derived(
    collectionToInventoryItems(actor.items).filter(
      (item) => item.type !== "ability" && item.type !== "spell" && !isItemEquipped(item),
    ),
  );

  function handleSelectItem(item: ShwItem) {
    item.sheet?.render(true);
  }

  async function handleDeleteItem(item: ShwItem) {
    const confirmed = await Dialog.confirm({
      title: t("inventory.deleteConfirmTitle"),
      content: `<p>${localize("inventory.deleteConfirmContent", { name: item.name })}</p>`,
    });

    if (confirmed) {
      await item.delete();
    }
  }

  async function handleDuplicateItem(item: ShwItem) {
    const itemData = item.toObject();
    itemData.system.quantity = 1;
    await actor.createEmbeddedDocuments("Item", [itemData], { skipStack: true });
  }

  async function handleQuantityChange(item: ShwItem, newQuantity: number) {
    await item.update({ "system.quantity": newQuantity });
  }

  async function handleEquipItem(item: ShwItem) {
    await equipItem(item);
  }
</script>

<div class="character-inventory">
  {#if actor.id}
    <InventoryTree
      actorId={actor.id}
      items={inventoryItems}
      itemCount={inventoryItems.length}
      onSelectItem={handleSelectItem}
      onDeleteItem={handleDeleteItem}
      onDuplicateItem={handleDuplicateItem}
      onQuantityChange={handleQuantityChange}
      onEquipItem={handleEquipItem}
    />
  {/if}
</div>

<style>
  .character-inventory {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem 0;
  }
</style>
