<script lang="ts">
  import CharacterStatsShell from "./CharacterStatsShell.svelte";
  import type { ShwActor } from "../../../documents/ShwActor";
  export let actor: ShwActor;
</script>

<CharacterStatsShell actor={actor} />