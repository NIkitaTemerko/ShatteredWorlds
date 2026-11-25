<script lang="ts">
  import type { MenuQuantityItem } from './types';
  import MenuQuantity from './MenuQuantity.svelte';

  let value = $state(3);

  const item = $derived<MenuQuantityItem>({
    type: 'quantity',
    label: 'Quantity',
    value,
    min: 1,
    max: 20,
    onChange: (v) => (value = v),
  });
</script>

<div class="panel">
  <MenuQuantity {item} />
  <p class="hint">Value: {value}</p>
</div>

<style>
  .panel {
    width: 14rem;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    background: rgb(28 24 40 / 96%);
    box-shadow: var(--shw-shadow-panel);
    color: var(--shw-color-text, #e8e4f0);
  }

  .hint {
    margin: 0.5rem 0.75rem 0.75rem;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }
</style>
