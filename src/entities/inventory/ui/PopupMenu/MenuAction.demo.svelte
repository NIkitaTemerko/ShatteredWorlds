<script lang="ts">
  import type { MenuActionItem } from './types';
  import MenuAction from './MenuAction.svelte';

  const items: MenuActionItem[] = [
    {
      type: 'action',
      label: 'Edit',
      icon: 'fas fa-edit',
      onClick: () => console.log('edit'),
    },
    {
      type: 'action',
      label: 'Delete',
      icon: 'fas fa-trash',
      danger: true,
      onClick: () => console.log('delete'),
    },
  ];
</script>

<div class="panel">
  {#each items as item (item.label)}
    <MenuAction {item} />
  {/each}
</div>

<style>
  .panel {
    width: 12rem;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    background: rgb(28 24 40 / 96%);
    box-shadow: var(--shw-shadow-panel);
  }
</style>
