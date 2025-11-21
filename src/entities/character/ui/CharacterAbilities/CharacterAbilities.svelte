<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import type { ShwItem } from "../../../../documents/Item/ShwItem";
  import { AbilityTree } from "../../../../entities/ability";

  interface Props {
    actor: ShwActor<"character">;
  }

  let { actor }: Props = $props();

  const abilities = $derived(Array.from(actor.items).filter((item: ShwItem) => item.type === "ability"));
  const abilityCount = $derived(abilities.length);

  function handleSelectAbility(item: ShwItem) {
    item.sheet?.render(true);
  }

  async function handleDeleteAbility(item: ShwItem) {
    const confirmed = await Dialog.confirm({
      title: game.i18n?.localize("SHW.abilities.deleteConfirmTitle") ?? "Delete Ability",
      content: `<p>${game.i18n?.format("SHW.abilities.deleteConfirmContent", { name: item.name }) ?? `Delete ${item.name}?`}</p>`,
    });

    if (confirmed) {
      await item.delete();
    }
  }
</script>

<div class="character-abilities">
  <AbilityTree
    actorId={actor.id ?? actor._id ?? ""}
    items={abilities}
    {abilityCount}
    onSelectAbility={handleSelectAbility}
    onDeleteAbility={handleDeleteAbility}
  />
</div>

<style>
  .character-abilities {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 1rem;
  }
</style>
