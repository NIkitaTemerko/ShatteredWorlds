<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import type { ShwItem } from "../../../../documents/Item/ShwItem";
  import { AbilityTree } from "../../../../entities/ability";
  import { getCharacterAbilityPool } from "../../../../shared/helpers/Character/getCharacterAbilityPool";
  import { getEquipmentLinkedAbilitySources } from "../../../../shared/helpers/Character/getEquipmentLinkedAbilities";

  interface Props {
    actor: ShwActor<"character">;
  }

  let { actor }: Props = $props();

  const abilities = $derived(getCharacterAbilityPool(actor));
  const abilityCount = $derived(abilities.length);
  const equipmentLinkedSourceNames = $derived(getEquipmentLinkedAbilitySources(actor));

  function isEquipmentLinkedAbility(item: ShwItem): boolean {
    const id = item.id ?? item._id;
    return id ? equipmentLinkedSourceNames.has(id) : false;
  }

  function handleSelectAbility(item: ShwItem) {
    item.sheet?.render(true);
  }

  async function handleDeleteAbility(item: ShwItem) {
    if (isEquipmentLinkedAbility(item)) return;

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
    {equipmentLinkedSourceNames}
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
