<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import type { SelectOption } from '../../../entities/consumable/model';

  interface Props extends HTMLSelectAttributes {
    value?: string | number;
    options: SelectOption[];
    variant?: 'underline' | 'bordered';
    fullWidth?: boolean;
  }

  let {
    value = $bindable(''),
    options,
    variant = 'bordered',
    fullWidth = false,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<select
  bind:value
  class="shw-select {className}"
  class:full-width={fullWidth}
  class:variant-underline={variant === 'underline'}
  {...restProps}
>
  {#each options as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>

<style>
  .shw-select {
    /* Base styles */
    font-size: var(--font-size-14, 14px);
    font-weight: 700;
    line-height: 1.5;

    /* Spacing */
    padding: 0.25rem 0.5rem;

    /* Border & background */
    border: 1px solid var(--color-border-light-2, rgba(0, 0, 0, 0.2));
    border-radius: 4px;
    background: transparent;

    /* Transitions */
    transition: all 0.2s ease;

    /* Misc */
    outline: none;
    color: inherit;
    cursor: pointer;
  }

  .shw-select:hover {
    border-color: var(--color-border-dark, rgba(0, 0, 0, 0.4));
  }

  .shw-select:focus {
    border-color: var(--color-primary, #0066cc);
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }

  .shw-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.05);
  }

  .shw-select.full-width {
    width: 100%;
  }

  /* Underline variant */
  .shw-select.variant-underline {
    border: none;
    border-bottom: 1px solid var(--color-border-light-2, rgba(0, 0, 0, 0.2));
    border-radius: 0;
    padding: 0.25rem 0.5rem;
  }

  .shw-select.variant-underline:hover {
    border-bottom-color: var(--color-border-dark, rgba(0, 0, 0, 0.4));
  }

  .shw-select.variant-underline:focus {
    border-bottom-color: var(--color-primary, #0066cc);
    box-shadow: none;
  }
</style>
