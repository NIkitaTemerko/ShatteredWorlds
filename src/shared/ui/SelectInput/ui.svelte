<script lang="ts">
  import type { VariantProps } from 'class-variance-authority';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import type { SelectOption } from '../../../entities/consumable/model';
  import { cn } from '../../lib/cn';
  import { selectVariants } from './select.variants';

  interface Props extends HTMLSelectAttributes, VariantProps<typeof selectVariants> {
    value?: string | number;
    options: SelectOption[];
  }

  let {
    value = $bindable(''),
    options,
    variant = 'bordered',
    fullWidth = false,
    class: className = '',
    ...restProps
  }: Props = $props();

  const classes = $derived(cn(selectVariants({ variant, fullWidth }), className));
</script>

<select bind:value class={classes} {...restProps}>
  {#each options as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>
