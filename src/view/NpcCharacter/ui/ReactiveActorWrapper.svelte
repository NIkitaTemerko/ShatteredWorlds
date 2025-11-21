<script lang="ts">
  import type { ShwActor } from "../../../documents/Actor/ShwActor";
  import { ReactiveDocumentWrapper } from "../../../shared/ui";
  import RootCharacterShell from "./RootCharacterShell.svelte";

  interface Props {
    getActor: () => ShwActor<"npc">;
  }

  let { getActor }: Props = $props();

  const actorHooks = ["updateActor", "createItem", "updateItem", "deleteItem"];
</script>

<ReactiveDocumentWrapper getDocument={getActor} Shell={RootCharacterShell} hooks={actorHooks} propName="actor" />
