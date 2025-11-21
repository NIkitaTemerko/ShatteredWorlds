<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    icon: Snippet;
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
  }

  let {
    icon,
    variant = 'default',
    size = 'md',
    disabled = false,
    class: className = '',
    type = 'button',
    ...restProps
  }: Props = $props();
</script>

<button
  {type}
  {disabled}
  class="action-icon {className}"
  class:variant-ghost={variant === 'ghost'}
  class:variant-outline={variant === 'outline'}
  class:size-sm={size === 'sm'}
  class:size-md={size === 'md'}
  class:size-lg={size === 'lg'}
  {...restProps}
>
  {@render icon()}
</button>

<style>
  .action-icon {
    /* Base styles */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid transparent;
    background: transparent;
    color: inherit;
    transition: all 0.2s ease;
    outline: none;
    padding: 0;
    flex-shrink: 0;
  }

  /* Size variants */
  .action-icon.size-sm {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  .action-icon.size-md {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .action-icon.size-lg {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  /* Default variant */
  .action-icon:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .action-icon:active {
    background: rgba(0, 0, 0, 0.1);
  }

  /* Ghost variant */
  .action-icon.variant-ghost {
    background: transparent;
  }

  .action-icon.variant-ghost:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .action-icon.variant-ghost:active {
    background: rgba(0, 0, 0, 0.08);
  }

  /* Outline variant */
  .action-icon.variant-outline {
    border-color: var(--color-border-light-2, rgba(0, 0, 0, 0.2));
  }

  .action-icon.variant-outline:hover {
    border-color: var(--color-border-dark, rgba(0, 0, 0, 0.4));
    background: rgba(0, 0, 0, 0.03);
  }

  .action-icon.variant-outline:active {
    background: rgba(0, 0, 0, 0.08);
  }

  /* Disabled state */
  .action-icon:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Focus state */
  .action-icon:focus-visible {
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.3);
  }
</style>
