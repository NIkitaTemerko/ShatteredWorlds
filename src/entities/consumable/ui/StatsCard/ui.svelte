<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    borderColor?: string;
    columns?: number;
  }

  let { children, borderColor = 'var(--dark)', columns = 3 }: Props = $props();
</script>

<div class="stats-card" style="--max-cols: {columns}; border-left-color: {borderColor}">
  {@render children()}
</div>

<style>
  .stats-card {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    background: var(--color-border-light-3);
  }

  .stats-card :global(.stat-col) {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 150px;
    flex: 1 1 calc(100% / var(--max-cols, 3) - 4px);
  }

  .stats-card :global(.stat-col.full) {
    flex-basis: 100%;
  }

  /* Mobile: stack vertically */
  @media (max-width: 449px) {
    .stats-card :global(.stat-col) {
      flex-basis: 100%;
    }
  }

  .stats-card :global(.stat-header) {
    background: var(--dark, #666);
    color: #000;
    padding: 0.35rem 0.25rem;
    font-weight: 700;
    font-size: var(--font-size-14, 14px);
    text-align: center;
    word-wrap: break-word;
  }

  .stats-card :global(.stat-body) {
    background: var(--light);
    padding: 0.35rem 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1; /* Stretch to fill available height */
  }

  .stats-card :global(.stat-body .shw-input),
  .stats-card :global(.stat-body .shw-select) {
    background: transparent;
  }
</style>
