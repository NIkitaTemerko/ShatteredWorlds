<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import type { SelectOption } from '../../../entities/consumable/model';

  interface Props extends HTMLSelectAttributes {
    value?: string | number;
    options: SelectOption[];
    variant?: 'default' | 'square';
    fullWidth?: boolean;
  }

  let {
    value = $bindable(''),
    options,
    variant = 'default',
    fullWidth = false,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<select
  bind:value
  class="shw-select {className}"
  class:full-width={fullWidth}
  class:variant-square={variant === 'square'}
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
    font-weight: 600;
    line-height: 1.5;

    /* Spacing */
    padding: 0.5rem 0.75rem;

    /* Border & background */
    border: 1px solid var(--color-border-light-2, rgba(0, 0, 0, 0.2));
    border-radius: 4px;
    background: white;

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

  /* Square variant - matches character sheet style */
  .shw-select.variant-square {
    border-radius: 0;
    border: none;
    padding: 0.25rem 0.5rem;
    text-align: center;
    min-height: auto;
    line-height: 1.4;
    height: 100%;
  }

  .shw-select.variant-square:focus {
    box-shadow: none;
  }
</style>
