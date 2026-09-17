<script lang="ts">
  import { Select } from 'bits-ui';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { resolveLabel } from '../../i18n';
  import type { SelectOption } from './types';

  interface Props {
    value?: string | number;
    options: SelectOption[];
    variant?: 'underline' | 'bordered' | 'ghost' | 'outline';
    fullWidth?: boolean;
    class?: string;
    disabled?: boolean;
    id?: string;
    name?: string;
    /** Legacy native-select compatible change handler. */
    onchange?: (
      event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement },
    ) => void;
  }

  let {
    value = $bindable(''),
    options,
    variant = 'bordered',
    fullWidth = false,
    class: className = '',
    disabled = false,
    id,
    name,
    onchange,
    ...restProps
  }: Props & Omit<HTMLButtonAttributes, 'value' | 'onchange' | 'disabled' | 'id' | 'name'> =
    $props();

  const stringValue = $derived(value === undefined || value === null ? '' : String(value));

  const bitsItems = $derived(
    options.map((option) => ({
      value: String(option.value),
      label: resolveLabel(option.label),
    })),
  );

  const selectedLabel = $derived(
    bitsItems.find((item) => item.value === stringValue)?.label ?? '',
  );

  const fieldVariant = $derived(
    variant === 'underline' || variant === 'ghost' ? 'underline' : 'ghost',
  );

  function handleValueChange(next: string) {
    const matched = options.find((option) => String(option.value) === next);
    value = matched ? (matched.value as string | number) : next;

    if (onchange) {
      const target = { value: next } as HTMLSelectElement;
      onchange({
        currentTarget: target,
        target,
      } as Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement });
    }
  }
</script>

<div class="shw-select-root {className}" class:full-width={fullWidth}>
  <Select.Root
    type="single"
    value={stringValue}
    onValueChange={handleValueChange}
    items={bitsItems}
    {disabled}
    {name}
  >
    <Select.Trigger
      {id}
      class="shw-select-trigger variant-{fieldVariant} {fullWidth ? 'full-width' : ''}"
      {...restProps}
    >
      <span class="shw-select-value">{selectedLabel || '—'}</span>
      <span class="shw-select-caret" aria-hidden="true">▾</span>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content class="shw-select-content" sideOffset={4}>
        <Select.Viewport class="shw-select-viewport">
          {#each bitsItems as item (item.value)}
            <Select.Item class="shw-select-item" value={item.value} label={item.label}>
              {#snippet children({ selected })}
                <span>{item.label}</span>
                {#if selected}
                  <span class="shw-select-check" aria-hidden="true">◆</span>
                {/if}
              {/snippet}
            </Select.Item>
          {/each}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>

<style>
  .shw-select-root.full-width {
    display: block;
    width: 100%;
  }

  .shw-select-root.full-width :global(.shw-select-trigger) {
    width: 100%;
  }

  :global(.shw-select-trigger) {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    box-sizing: border-box;
    min-height: var(--shw-size-md, 2rem);
    margin: 0;
    padding: 0.45rem 0.75rem;
    border-radius: 0;
    border: 1px solid transparent;
    font-family: var(--shw-font, inherit);
    font-size: var(--font-size-14, 14px);
    font-weight: 600;
    line-height: 1.5;
    text-align: left;
    color: var(--shw-color-text, inherit);
    cursor: pointer;
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background-color 0.15s ease;
  }

  :global(.shw-select-trigger:not(.full-width)) {
    min-width: 10rem;
  }

  :global(.shw-select-trigger.variant-ghost) {
    border-color: var(--shw-color-border);
    background: rgb(18 16 28 / 55%);
    box-shadow: var(--shw-inner-glow);
  }

  :global(.shw-select-trigger.variant-ghost:hover:not(:disabled)) {
    border-color: var(--shw-color-border-bright);
  }

  :global(.shw-select-trigger.variant-ghost:focus-visible),
  :global(.shw-select-trigger.variant-ghost[data-state='open']) {
    border-color: var(--shw-color-primary-bright);
    box-shadow: var(--shw-inner-glow), var(--shw-bloom);
  }

  :global(.shw-select-trigger.variant-underline) {
    border: none;
    border-bottom: 1px solid var(--shw-color-border);
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  :global(.shw-select-trigger.variant-underline:hover:not(:disabled)) {
    border-bottom-color: var(--shw-color-border-bright);
  }

  :global(.shw-select-trigger:disabled) {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .shw-select-value {
    flex: 1;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .shw-select-caret {
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 0.75em;
  }

  :global(.shw-select-content) {
    z-index: var(--shw-z-popover, 100000);
    overflow: hidden;
    min-width: var(--bits-select-anchor-width);
    max-height: min(16rem, var(--bits-select-content-available-height));
    border-radius: 0;
    border: 1px solid var(--shw-color-border-bright);
    background: rgb(28 24 40 / 92%);
    color: var(--shw-color-text, #e8e4f0);
    outline: none;
    box-shadow: var(--shw-shadow-panel);
  }

  :global(.shw-select-viewport) {
    padding: 0.25rem;
  }

  :global(.shw-select-item) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.4rem 0.55rem;
    border-radius: 0;
    font-family: var(--shw-font, inherit);
    font-size: 13px;
    cursor: pointer;
    outline: none;
  }

  :global(.shw-select-item[data-highlighted]) {
    background: rgb(139 79 201 / 22%);
  }

  :global(.shw-select-item[data-selected]) {
    color: var(--shw-color-primary-bright, #b57aef);
  }

  :global(.shw-select-check) {
    font-size: 0.7em;
    color: var(--shw-color-secondary-bright, #e0b44a);
  }
</style>
