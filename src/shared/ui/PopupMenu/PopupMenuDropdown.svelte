<script lang="ts">
  import type { PopupMenuItem } from "./types";
  import MenuAction from "./MenuAction.svelte";
  import MenuQuantity from "./MenuQuantity.svelte";

  interface Props {
    items: PopupMenuItem[];
  }

  let { items }: Props = $props();
</script>

<div class="popup-menu-dropdown">
  {#each items as item (item.label)}
    {#if item.type === "action"}
      <MenuAction {item} />
    {:else if item.type === "quantity"}
      <MenuQuantity {item} />
    {/if}
  {/each}
</div>

<style>
  .popup-menu-dropdown {
    min-width: 180px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 0.25rem 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>
