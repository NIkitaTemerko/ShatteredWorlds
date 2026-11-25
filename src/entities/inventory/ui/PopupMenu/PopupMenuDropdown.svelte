<script lang="ts">
  import type { PopupMenuItem } from './types';
  import MenuAction from './MenuAction.svelte';
  import MenuQuantity from './MenuQuantity.svelte';

  interface Props {
    items: PopupMenuItem[];
  }

  let { items }: Props = $props();
</script>

<div class="popup-menu-dropdown">
  {#each items as item (item.label)}
    {#if item.type === 'action'}
      <MenuAction {item} />
    {:else if item.type === 'quantity'}
      <MenuQuantity {item} />
    {/if}
  {/each}
</div>

<style>
  .popup-menu-dropdown {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-width: 180px;
    padding: 0.15rem 0;
  }
</style>
