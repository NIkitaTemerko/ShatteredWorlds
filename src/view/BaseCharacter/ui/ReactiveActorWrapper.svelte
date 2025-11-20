<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { ShwActor } from "../../../documents/Actor/ShwActor";
  import RootCharacterShell from "./RootCharacterShell.svelte";

  interface Props {
    getActor: () => ShwActor<"character">;
  }

  let { getActor }: Props = $props();

  let actorData = $state({ actor: getActor(), version: 0 });

  function handleUpdate(doc: any) {
    const currentActor = getActor();
    // Only update if it's our actor
    if (!doc || doc.id === currentActor.id || doc.parent?.id === currentActor.id) {
      actorData = { actor: currentActor, version: actorData.version + 1 };
    }
  }

  onMount(() => {
    Hooks.on("updateActor", handleUpdate);
    Hooks.on("createItem", handleUpdate);
    Hooks.on("updateItem", handleUpdate);
    Hooks.on("deleteItem", handleUpdate);
  });

  onDestroy(() => {
    Hooks.off("updateActor", handleUpdate);
    Hooks.off("createItem", handleUpdate);
    Hooks.off("updateItem", handleUpdate);
    Hooks.off("deleteItem", handleUpdate);
  });
</script>

<RootCharacterShell actor={actorData.actor} />
