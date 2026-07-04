<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import type { ShwItem } from "../../../../documents/Item/ShwItem";
  import { collectionToEquipmentItems, EquipmentTree } from "../../../../entities/equipment";
  import { unequipItem } from "../../../../shared/helpers/Character/equipmentState";

  interface Props {
    actor: ShwActor<"character">;
  }

  let { actor }: Props = $props();

  const equipmentItems = $derived(collectionToEquipmentItems(actor.items));
  const itemCount = $derived(equipmentItems.length);

  function handleSelectItem(item: ShwItem) {
    item.sheet?.render(true);
  }

  async function handleUnequipItem(item: ShwItem) {
    await unequipItem(item);
  }
</script>

<div class="character-equipment">
  {#if actor.id}
    <EquipmentTree
      actorId={actor.id}
      items={equipmentItems}
      {itemCount}
      onSelectItem={handleSelectItem}
      onUnequipItem={handleUnequipItem}
    />
  {/if}
</div>

<style>
  .character-equipment {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 1rem;
  }
</style>
