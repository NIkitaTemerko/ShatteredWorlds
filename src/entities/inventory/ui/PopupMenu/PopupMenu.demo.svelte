<script lang="ts">
  import type { PopupMenuItem } from './types';
  import PopupMenuDropdown from './PopupMenuDropdown.svelte';

  let quantity = $state(3);

  const items = $derived<PopupMenuItem[]>([
    {
      type: 'action',
      label: 'Edit',
      icon: 'fas fa-edit',
      onClick: () => console.log('edit'),
    },
    {
      type: 'quantity',
      label: 'Quantity',
      value: quantity,
      min: 1,
      max: 20,
      onChange: (v) => {
        quantity = v;
        console.log('quantity', v);
      },
    },
    {
      type: 'action',
      label: 'Delete',
      icon: 'fas fa-trash',
      danger: true,
      onClick: () => console.log('delete'),
    },
  ]);
</script>

<div class="frame">
  <p class="hint">Inventory context menu surface (actions + quantity)</p>
  <div class="panel">
    <PopupMenuDropdown {items} />
  </div>
  <p class="hint">Quantity state: {quantity}</p>
</div>

<style>
  .frame {
    width: 14rem;
    color: var(--shw-color-text, #e8e4f0);
  }

  .hint {
    margin: 0 0 0.5rem;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }

  .panel {
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    background: rgb(28 24 40 / 96%);
    box-shadow: var(--shw-shadow-panel);
  }
</style>
