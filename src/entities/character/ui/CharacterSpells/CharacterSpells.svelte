<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import type { ShwItem } from "../../../../documents/Item/ShwItem";
  import { SpellTree } from "../../../../entities/spell";
  import { localize, t } from "../../../../shared/i18n";

  interface Props {
    actor: ShwActor<"character">;
  }

  let { actor }: Props = $props();

  const spells = $derived(Array.from(actor.items).filter((item: ShwItem) => item.type === "spell"));
  const spellCount = $derived(spells.length);

  function handleSelectSpell(item: ShwItem) {
    item.sheet?.render(true);
  }

  async function handleDeleteSpell(item: ShwItem) {
    const confirmed = await foundry.appv1.api.Dialog.confirm({
      title: t("spells.deleteConfirmTitle") ?? "Delete Spell",
      content: `<p>${localize("spells.deleteConfirmContent", { name: item.name }) ?? `Delete ${item.name}?`}</p>`,
    });

    if (confirmed) {
      await item.delete();
    }
  }
</script>

<div class="character-spells">
  <SpellTree
    actorId={actor.id ?? actor._id ?? ""}
    items={spells}
    {spellCount}
    onSelectSpell={handleSelectSpell}
    onDeleteSpell={handleDeleteSpell}
  />
</div>

<style>
  .character-spells {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 1rem;
  }
</style>
