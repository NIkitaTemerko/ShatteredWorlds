<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    class?: string;
  }

  let { children, class: className = '' }: Props = $props();
</script>

<div class="shw-anchored-popup-panel {className}">
  {@render children()}
</div>

<style>
  .shw-anchored-popup-panel {
    min-width: 180px;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    border-radius: 0;
    background: rgb(28 24 40 / 96%);
    color: var(--shw-color-text, #e8e4f0);
    box-shadow: var(--shw-shadow-panel, 0 10px 28px rgb(0 0 0 / 40%));
    padding: 0.5rem;
  }
</style>
