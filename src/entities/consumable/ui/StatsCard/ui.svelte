<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    borderColor?: string;
    columns?: number;
  }

  let { children, borderColor = 'var(--dark, var(--shw-color-primary))', columns = 3 }: Props = $props();
</script>

<div class="stats-card" style="--max-cols: {columns}; --accent: {borderColor}">
  {@render children()}
</div>

<style>
  .stats-card {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    background: var(--shw-color-border, #4a425c);
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    box-shadow: var(--shw-shadow-panel);
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
    overflow: hidden;
  }

  .stats-card :global(.stat-col) {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
    flex: 1 1 calc(100% / var(--max-cols, 3) - 1px);
  }

  .stats-card :global(.stat-col.full) {
    flex-basis: 100%;
  }

  @media (max-width: 449px) {
    .stats-card :global(.stat-col) {
      flex-basis: 100%;
    }
  }

  .stats-card :global(.stat-header) {
    background: color-mix(in srgb, var(--dark, var(--accent)) 55%, #1c1828);
    color: var(--shw-color-text, #e8e4f0);
    padding: 0.4rem 0.35rem;
    font-weight: 700;
    font-size: 13px;
    text-align: center;
    word-wrap: break-word;
    border-bottom: 1px solid color-mix(in srgb, var(--dark, var(--accent)) 70%, transparent);
  }

  .stats-card :global(.stat-body) {
    box-sizing: border-box;
    width: 100%;
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    color: var(--shw-color-text, #e8e4f0);
    padding: 0.6rem 0.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  .stats-card :global(.stat-body.full-width) {
    align-items: stretch;
    justify-content: flex-start;
  }

  .stats-card :global(.stat-body.full-width > *) {
    width: 100%;
  }
</style>
