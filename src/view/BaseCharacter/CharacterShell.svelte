<script lang="ts">
  export let actor: import("../../documents/ShwActor").ShwActor;

  function save() {
    actor.update({ "system.health.value": actor.system.health.value });
  }
</script>

<label>HP:
  <input type="number" bind:value={actor.system.health.value} class="border w-16" />
  / {actor.system.health.max}
</label>

<div on:click={() => actor.rollAbility("force")}>{actor.system.attributes.force.value}</div>

<button class="mt-2 px-2 py-1 bg-gray-700 text-white" on:click={save}>
  Save
</button>
