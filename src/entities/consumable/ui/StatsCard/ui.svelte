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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
    gap: 2px;
    background: var(--color-border-light-3);
    border-left: 4px solid;
  }

  /* Enforce max columns constraint */
  @media (min-width: 450px) {
    .stats-card {
      grid-template-columns: repeat(auto-fit, minmax(min(100% / var(--max-cols, 3), 150px), 1fr));
    }
  }

  .stats-card :global(.stat-col) {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0; /* Allow flex items to shrink below content size */
  }

  .stats-card :global(.stat-col.full) {
    grid-column: 1 / -1;
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
    border: none;
    border-bottom: 2px solid var(--dark);
    padding: 0;
  }

  /* Smart grid logic using CSS Grid */
  @supports (grid-template-columns: subgrid) {
    .stats-card {
      grid-template-columns: repeat(auto-fit, minmax(calc(100% / var(--max-cols, 3) - 2px), 1fr));
    }
  }
</style>
