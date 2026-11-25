<script lang="ts">
  import type { Snippet } from 'svelte';
  import './foundry-window.css';

  interface Props {
    title: string;
    width?: number;
    height?: number;
    kind?: 'actor' | 'item';
    children: Snippet;
  }

  let {
    title,
    width = 600,
    height = 650,
    kind = 'item',
    children,
  }: Props = $props();
</script>

<div
  class="app window-app sheet {kind}"
  style="width: {width}px; height: {height}px"
  role="dialog"
  aria-label={title}
>
  <header class="window-header flexrow">
    <h4 class="window-title">{title}</h4>
    <a class="header-button" href="#close" aria-label="Close" onclick={(e) => e.preventDefault()}>
      <i class="fas fa-times" aria-hidden="true"></i>
    </a>
  </header>
  <section class="window-content">
    <form>
      <section class="svelte-sheet-body">
        {@render children()}
      </section>
    </form>
  </section>
</div>
