<script lang="ts">
  import { tick } from 'svelte';
  import { Combobox } from 'bits-ui';
  import { resolveLabel } from '../../i18n';
  import type { SelectOption } from '../SelectInput/types';

  interface Props {
    value?: string;
    options: SelectOption[];
    placeholder?: string;
    variant?: 'ghost' | 'outline' | 'underline' | 'bordered';
    fullWidth?: boolean;
    disabled?: boolean;
    class?: string;
    onchange?: (value: string) => void;
    /** Fires on every keystroke (for live filtering). */
    onInput?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    options,
    placeholder = '',
    variant = 'ghost',
    fullWidth = false,
    disabled = false,
    class: className = '',
    onchange,
    onInput,
  }: Props = $props();

  /** Filter query only — do not drive the input `value` (bits owns that). */
  let searchValue = $state('');

  const fieldVariant = $derived(
    variant === 'outline' || variant === 'bordered' ? 'outline' : 'ghost',
  );

  const bitsItems = $derived(
    options.map((option) => ({
      value: String(option.value),
      label: resolveLabel(option.label),
    })),
  );

  function matchesQuery(item: { value: string; label: string }, query: string): boolean {
    if (!query) return true;
    const q = query.toLowerCase();
    return item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q);
  }

  const visibleCount = $derived(
    bitsItems.reduce((count, item) => count + (matchesQuery(item, searchValue) ? 1 : 0), 0),
  );

  function handleValueChange(next: string) {
    value = next;
    searchValue = '';
    onchange?.(next);
  }

  function handleOpenChangeComplete(nextOpen: boolean) {
    if (nextOpen) return;

    const typed = searchValue.trim();
    searchValue = '';

    if (!typed) return;

    const match =
      bitsItems.find((item) => item.label.toLowerCase() === typed.toLowerCase()) ??
      bitsItems.find((item) => item.value.toLowerCase() === typed.toLowerCase());

    if (match) {
      if (match.value !== value) {
        value = match.value;
        onchange?.(match.value);
      }
      return;
    }

    // Free-text (tree live filter).
    value = typed;
    onchange?.(typed);
  }

  async function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
    searchValue = event.currentTarget.value;
    onInput?.(searchValue);

    // After hide/disable flush, bits may still point at a stale node. HOME selects
    // candidates[0] without needing a prior highlight (ArrowDown no-ops at index -1).
    const inputEl = event.currentTarget;
    await tick();
    inputEl.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }),
    );
  }
</script>

<div class="shw-autocomplete-root {className}" class:full-width={fullWidth}>
  <!--
    bits-ui Combobox:
    - bits owns input text; we only track searchValue for filtering
    - Items stay mounted (disabled + hidden when filtered out) so highlight ids stay valid
  -->
  <Combobox.Root
    type="single"
    bind:value
    onValueChange={handleValueChange}
    onOpenChangeComplete={handleOpenChangeComplete}
    items={bitsItems}
    {disabled}
    loop
    allowDeselect={false}
  >
    <Combobox.Input
      class="shw-autocomplete-input variant-{fieldVariant}"
      {placeholder}
      {disabled}
      oninput={handleInput}
    />
    <Combobox.Portal>
      <Combobox.Content
        class="shw-autocomplete-content"
        sideOffset={4}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Combobox.Viewport class="shw-autocomplete-viewport">
          {#each bitsItems as item (item.value)}
            {@const visible = matchesQuery(item, searchValue)}
            <Combobox.Item
              class="shw-autocomplete-item{visible ? '' : ' shw-autocomplete-item--hidden'}"
              value={item.value}
              label={item.label}
              disabled={!visible}
            >
              {#snippet children({ selected })}
                <span>{item.label}</span>
                {#if selected}
                  <span class="shw-autocomplete-check" aria-hidden="true">◆</span>
                {/if}
              {/snippet}
            </Combobox.Item>
          {/each}
          {#if visibleCount === 0}
            <div class="shw-autocomplete-empty">—</div>
          {/if}
        </Combobox.Viewport>
      </Combobox.Content>
    </Combobox.Portal>
  </Combobox.Root>
</div>

<style>
  .shw-autocomplete-root.full-width {
    width: 100%;
  }

  .shw-autocomplete-root.full-width :global(.shw-autocomplete-input) {
    width: 100%;
  }

  :global(.shw-autocomplete-input) {
    box-sizing: border-box;
    min-height: var(--shw-size-md, 2rem);
    margin: 0;
    padding: 0.45rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 0;
    font-family: var(--shw-font, inherit);
    font-size: var(--font-size-14, 14px);
    font-weight: 600;
    line-height: 1.5;
    color: var(--shw-color-text, inherit);
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background-color 0.15s ease;
  }

  :global(.shw-autocomplete-input.variant-ghost) {
    border: none;
    border-bottom: 1px solid var(--shw-color-border);
    background: transparent;
    box-shadow: none;
    padding: 0.25rem 0.5rem;
  }

  :global(.shw-autocomplete-input.variant-ghost:hover:not(:disabled)) {
    border-bottom-color: var(--shw-color-border-bright);
  }

  :global(.shw-autocomplete-input.variant-ghost:focus) {
    border-bottom-color: var(--shw-color-primary);
  }

  :global(.shw-autocomplete-input.variant-outline) {
    border-color: var(--shw-color-border);
    background: var(--shw-glass-fill);
    box-shadow: var(--shw-inner-glow);
  }

  :global(.shw-autocomplete-input.variant-outline:hover:not(:disabled)) {
    border-color: var(--shw-color-border-bright);
  }

  :global(.shw-autocomplete-input.variant-outline:focus) {
    border-color: var(--shw-color-primary-bright);
    box-shadow: var(--shw-inner-glow), var(--shw-bloom);
  }

  :global(.shw-autocomplete-input:disabled) {
    opacity: 0.55;
    cursor: not-allowed;
  }

  :global(.shw-autocomplete-content) {
    z-index: var(--shw-z-popover, 100000);
    overflow: hidden;
    min-width: var(--bits-combobox-anchor-width);
    max-height: min(16rem, var(--bits-combobox-content-available-height));
    border: 1px solid var(--shw-color-border-bright);
    border-radius: 0;
    background: rgb(28 24 40 / 92%);
    color: var(--shw-color-text, #e8e4f0);
    outline: none;
    box-shadow: var(--shw-shadow-panel);
  }

  :global(.shw-autocomplete-viewport) {
    padding: 0.25rem;
  }

  :global(.shw-autocomplete-item) {
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

  :global(.shw-autocomplete-item--hidden) {
    display: none;
  }

  :global(.shw-autocomplete-item[data-highlighted]) {
    background: rgb(139 79 201 / 35%);
  }

  :global(.shw-autocomplete-item[data-selected]) {
    color: var(--shw-color-primary-bright, #b57aef);
  }

  :global(.shw-autocomplete-check) {
    font-size: 0.7em;
    color: var(--shw-color-secondary-bright, #e0b44a);
  }

  :global(.shw-autocomplete-empty) {
    padding: 0.4rem 0.55rem;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 13px;
  }
</style>
