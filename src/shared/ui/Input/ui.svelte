<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    value?: string | number;
    background?: string;
    textAlign?: 'left' | 'center' | 'right';
    fullWidth?: boolean;
    /**
     * ghost — только нижняя линия (дефолт)
     * outline — рамка
     * underline / default — алиасы ghost (обратная совместимость)
     */
    variant?: 'ghost' | 'outline' | 'underline' | 'default';
  }

  let {
    value = $bindable(''),
    background,
    textAlign = 'center',
    fullWidth = false,
    variant = 'ghost',
    class: className = '',
    type = 'text',
    ...restProps
  }: Props = $props();

  const fieldVariant = $derived(
    variant === 'outline' ? 'outline' : 'ghost',
  );
</script>

<input
  bind:value
  {type}
  class="shw-input variant-{fieldVariant} {className}"
  class:full-width={fullWidth}
  style:background
  style:text-align={textAlign}
  {...restProps}
/>

<style>
  .shw-input {
    box-sizing: border-box;
    width: auto;
    min-height: var(--shw-size-md, 2rem);
    margin: 0;
    padding: 0.25rem 0.5rem;
    border-radius: 0;
    font-family: var(--shw-font, inherit);
    font-size: var(--font-size-14, 14px);
    font-weight: 400;
    line-height: 1.5;
    color: var(--shw-color-text, inherit);
    outline: none;
    background: transparent;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background-color 0.15s ease;
  }

  .shw-input.full-width {
    width: 100%;
  }

  /* ghost — underline field */
  .shw-input.variant-ghost {
    border: none;
    border-bottom: 1px solid var(--shw-color-border);
    box-shadow: none;
  }

  .shw-input.variant-ghost:hover:not(:disabled) {
    border-bottom-color: var(--shw-color-border-bright);
  }

  .shw-input.variant-ghost:focus {
    border-bottom-color: var(--shw-color-primary);
  }

  /* outline — rimmed field */
  .shw-input.variant-outline {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--shw-color-border);
    background: var(--shw-glass-fill);
    box-shadow: var(--shw-inner-glow);
  }

  .shw-input.variant-outline:hover:not(:disabled) {
    border-color: var(--shw-color-border-bright);
  }

  .shw-input.variant-outline:focus {
    border-color: var(--shw-color-primary-bright);
    box-shadow: var(--shw-inner-glow), var(--shw-bloom);
  }

  .shw-input:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .shw-input[type='number'] {
    appearance: textfield;
  }

  .shw-input[type='number']::-webkit-inner-spin-button,
  .shw-input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
