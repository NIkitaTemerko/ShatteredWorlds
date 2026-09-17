<script lang="ts">
  import type { MenuActionItem } from './types';

  interface Props {
    item: MenuActionItem;
  }

  let { item }: Props = $props();
</script>

<button
  type="button"
  class="popup-menu-action"
  class:popup-menu-action--danger={item.danger}
  onclick={item.onClick}
>
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
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 0;
    background: transparent;
    color: var(--shw-color-text, #e8e4f0);
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .popup-menu-action:hover,
  .popup-menu-action:focus-visible {
    background: rgb(139 79 201 / 22%);
    outline: none;
  }

  .popup-menu-action--danger {
    color: #f07178;
  }

  .popup-menu-action--danger:hover,
  .popup-menu-action--danger:focus-visible {
    background: rgb(220 38 38 / 18%);
  }
</style>
