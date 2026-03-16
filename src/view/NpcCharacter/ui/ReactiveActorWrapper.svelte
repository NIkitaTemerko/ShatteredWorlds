<script lang="ts">
  import type { ShwActor } from "../../../documents/Actor/ShwActor";
  import { ACTOR_HOOKS } from "../../../shared/model/constants";
  import { ReactiveDocumentWrapper } from "../../../shared/ui";
  import RootCharacterShell from "./RootCharacterShell.svelte";

  interface Props {
    getActor: () => ShwActor<"npc">;
  }

  let { getActor }: Props = $props();
</script>

<ReactiveDocumentWrapper getDocument={getActor} Shell={RootCharacterShell} hooks={ACTOR_HOOKS} propName="actor" />
