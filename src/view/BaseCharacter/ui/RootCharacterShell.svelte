<script lang="ts">
  import CharacterStats from "./CharacterStats.svelte";
  import type { ShwActor } from "../../../documents/ShwActor";
  import CharacterAdditionalStats from "./CharacterAdditionalStats.svelte";
  export let actor: ShwActor;

  function handleChange(event: CustomEvent) {
    const { value, path } = event.detail;
    actor.update({ [path]: value });
  }
</script>

<div>
  <CharacterStats actor={actor} />
  <CharacterAdditionalStats
    stats={actor.system.additionalAttributes}
    helpers={actor.system.helpers}
    on:change={handleChange}
  />
</div>