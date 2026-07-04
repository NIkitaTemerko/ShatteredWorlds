<script lang="ts">
  import type { MenuActionItem } from "./types";

  interface Props {
    item: MenuActionItem;
  }

  let { item }: Props = $props();
</script>

<button class="popup-menu-action" class:popup-menu-action--danger={item.danger} onclick={item.onClick}>
  {#if item.icon}
    <i class="{item.icon} fa-fw"></i>
  {/if}
  <span>{item.label}</span>
</button>

<style>
  .popup-menu-action {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    color: #374151;
    text-align: left;
    width: 100%;
    transition: background-color 0.15s;
  }

  .popup-menu-action:hover {
    background-color: rgba(222, 184, 135, 0.25);
  }

  .popup-menu-action--danger {
    color: #dc2626;
  }

  .popup-menu-action--danger:hover {
    background-color: rgba(220, 38, 38, 0.1);
  }
</style>
