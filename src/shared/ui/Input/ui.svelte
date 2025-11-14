<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    value?: string | number;
    background?: string;
    textAlign?: 'left' | 'center' | 'right';
    fullWidth?: boolean;
  }

  let {
    value = $bindable(''),
    background = 'transparent',
    textAlign = 'center',
    fullWidth = false,
    class: className = '',
    type = 'text',
    ...restProps
  }: Props = $props();
</script>

<input
  bind:value
  {type}
  class="shw-input {className}"
  class:full-width={fullWidth}
  style:background
  style:text-align={textAlign}
  {...restProps}
/>

<style>
  .shw-input {
    /* Base styles */
    font-family: var(--font-primary, inherit);
    font-size: var(--font-size-14, 14px);
    font-weight: 400;
    line-height: 1.5;

    /* Spacing */
    padding: 0.5rem 0.75rem;

    /* Border & background */
    border: 1px solid var(--color-border-light-2, rgba(0, 0, 0, 0.2));
    border-radius: 4px;
    background: transparent;

    /* Transitions */
    transition: all 0.2s ease;

    /* Misc */
    outline: none;
    color: inherit;
  }

  .shw-input:hover {
    border-color: var(--color-border-dark, rgba(0, 0, 0, 0.4));
  }

  .shw-input:focus {
    border-color: var(--color-primary, #0066cc);
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }

  .shw-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.05);
  }

  .shw-input.full-width {
    width: 100%;
  }

  /* Number input specific */
  .shw-input[type='number'] {
    appearance: textfield;
  }

  .shw-input[type='number']::-webkit-inner-spin-button,
  .shw-input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
