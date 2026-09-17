<script lang="ts">
  import { Button as BitsButton } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { ButtonSize, ButtonVariant } from '../Button/types';

  interface Props extends HTMLButtonAttributes {
    icon: Snippet;
    variant?: Extract<ButtonVariant, 'ghost' | 'outline'> | 'default';
    size?: ButtonSize;
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

  const visualVariant = $derived(variant === 'outline' ? 'outline' : 'ghost');

  const rootClass = $derived(
    [
      'shw-action-icon',
      `variant-${visualVariant}`,
      `size-${size}`,
      variant === 'default' ? 'variant-default' : '',
      className,
    ]
      .filter(Boolean)
      .join(' '),
  );
</script>

<BitsButton.Root {type} {disabled} class={rootClass} {...restProps}>
  <span class="shw-action-icon__glyph">{@render icon()}</span>
</BitsButton.Root>

<style>
  :global(.shw-action-icon) {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    border-radius: 0;
    border: 1px solid transparent;
    line-height: 0;
    color: var(--shw-color-text, inherit);
    cursor: pointer;
    outline: none;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  :global(.shw-action-icon),
  :global(.shw-action-icon *) {
    cursor: pointer;
  }

  :global(.shw-action-icon.size-sm) {
    width: var(--shw-size-sm, 24px);
    height: var(--shw-size-sm, 24px);
    font-size: 14px;
  }

  :global(.shw-action-icon.size-md) {
    width: var(--shw-size-md, 32px);
    height: var(--shw-size-md, 32px);
    font-size: 16px;
  }

  :global(.shw-action-icon.size-lg) {
    width: var(--shw-size-lg, 40px);
    height: var(--shw-size-lg, 40px);
    font-size: 20px;
  }

  :global(.shw-action-icon.variant-ghost),
  :global(.shw-action-icon.variant-default) {
    background: transparent;
    box-shadow: none;
  }

  :global(.shw-action-icon.variant-ghost:hover:not(:disabled)),
  :global(.shw-action-icon.variant-default:hover:not(:disabled)) {
    border-color: var(--shw-color-border);
    background: var(--shw-glass-fill);
    box-shadow: var(--shw-inner-glow);
  }

  :global(.shw-action-icon.variant-outline) {
    border-color: var(--shw-color-border-bright);
    background: var(--shw-glass-fill);
    box-shadow: var(--shw-inner-glow);
  }

  :global(.shw-action-icon.variant-outline:hover:not(:disabled)) {
    border-color: var(--shw-color-primary-bright);
    background: var(--shw-glass-fill-tint);
    box-shadow: var(--shw-inner-glow), var(--shw-bloom);
  }

  :global(.shw-action-icon:disabled) {
    opacity: 0.4;
    pointer-events: none;
  }

  :global(.shw-action-icon:disabled),
  :global(.shw-action-icon:disabled *) {
    cursor: not-allowed;
  }

  :global(.shw-action-icon:focus-visible) {
    box-shadow: var(--shw-focus-ring);
  }

  .shw-action-icon__glyph {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    line-height: 0;
    pointer-events: none;
  }

  .shw-action-icon__glyph :global(i),
  .shw-action-icon__glyph :global(svg),
  .shw-action-icon__glyph :global(span) {
    display: block;
    margin: 0;
    padding: 0;
    line-height: 1;
    width: 1em;
    height: 1em;
    text-align: center;
  }

  .shw-action-icon__glyph :global(svg) {
    fill: currentColor;
  }

  :global(body.game .app button.shw-action-icon > i),
  :global(body.game .app button.shw-action-icon > svg),
  :global(body.game .app button.shw-action-icon .shw-action-icon__glyph > i),
  :global(body.game .app button.shw-action-icon .shw-action-icon__glyph > svg) {
    margin: 0 !important;
  }
</style>
