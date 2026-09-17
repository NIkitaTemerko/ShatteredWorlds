<script lang="ts">
  import { Button as BitsButton, type ButtonRootProps as BitsButtonRootProps } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import type { ButtonSize, ButtonVariant } from './types';

  type Props = BitsButtonRootProps & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: Snippet;
  };

  let {
    variant = 'primary',
    size = 'md',
    class: className = '',
    icon,
    children,
    ...rest
  }: Props = $props();
</script>

<BitsButton.Root
  {...rest}
  class="shw-button {className}"
  data-variant={variant}
  data-size={size}
>
  {#if icon}
    <span class="shw-button__slot">{@render icon()}</span>
  {/if}
  {#if children}
    <span class="shw-button__slot">{@render children()}</span>
  {/if}
</BitsButton.Root>

<style>
  :global(.shw-button) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid transparent;
    border-radius: 0;
    font-family: var(--shw-font);
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    color: var(--shw-color-text);
    cursor: pointer;
    user-select: none;
    outline: none;
    transition:
      border-color 0.12s ease,
      background-color 0.12s ease,
      color 0.12s ease;
  }

  :global(.shw-button[data-size='sm']) {
    min-height: var(--shw-size-sm);
    padding: var(--shw-pad-sm);
    font-size: 12px;
  }

  :global(.shw-button[data-size='md']) {
    min-height: var(--shw-size-md);
    padding: var(--shw-pad-md);
    font-size: 14px;
  }

  :global(.shw-button[data-size='lg']) {
    min-height: var(--shw-size-lg);
    padding: var(--shw-pad-lg);
    font-size: 16px;
  }

  :global(.shw-button:disabled) {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }

  :global(.shw-button:focus-visible) {
    box-shadow: var(--shw-focus-ring);
  }

  :global(.shw-button[data-variant='primary']) {
    color: #f4eefe;
    border-color: color-mix(in srgb, var(--shw-color-primary-bright) 55%, transparent);
    background: linear-gradient(
      160deg,
      var(--shw-color-primary-bright),
      var(--shw-color-primary) 45%,
      var(--shw-color-primary-deep)
    );
    box-shadow: var(--shw-inner-glow), var(--shw-bloom);
  }

  :global(.shw-button[data-variant='primary']:hover:not(:disabled)) {
    border-color: var(--shw-color-primary-bright);
    background: linear-gradient(
      160deg,
      #c9a0f5,
      var(--shw-color-primary-bright) 45%,
      var(--shw-color-primary)
    );
  }

  :global(.shw-button[data-variant='secondary']) {
    color: var(--shw-color-text-inverse);
    border-color: color-mix(in srgb, var(--shw-color-secondary-bright) 60%, transparent);
    background: linear-gradient(
      160deg,
      var(--shw-color-secondary-bright),
      var(--shw-color-secondary) 45%,
      var(--shw-color-secondary-deep)
    );
    box-shadow: var(--shw-inner-glow), 0 0 18px var(--shw-color-secondary-glow);
  }

  :global(.shw-button[data-variant='secondary']:hover:not(:disabled)) {
    border-color: var(--shw-color-secondary-bright);
    background: linear-gradient(
      160deg,
      #ebc86a,
      var(--shw-color-secondary-bright) 45%,
      var(--shw-color-secondary)
    );
  }

  :global(.shw-button[data-variant='outline']) {
    border-color: var(--shw-color-border-bright);
    background: var(--shw-glass-fill-tint);
    box-shadow: var(--shw-inner-glow);
  }

  :global(.shw-button[data-variant='outline']:hover:not(:disabled)) {
    border-color: var(--shw-color-primary-bright);
    background: var(--shw-glass-fill-strong);
  }

  :global(.shw-button[data-variant='ghost']) {
    color: var(--shw-color-text-muted);
    background: transparent;
    box-shadow: none;
  }

  :global(.shw-button[data-variant='ghost']:hover:not(:disabled)) {
    color: var(--shw-color-text);
    border-color: var(--shw-color-border);
    background: var(--shw-glass-fill);
    box-shadow: var(--shw-inner-glow);
  }

  .shw-button__slot {
    display: inline-flex;
    align-items: center;
    pointer-events: none;
  }
</style>
