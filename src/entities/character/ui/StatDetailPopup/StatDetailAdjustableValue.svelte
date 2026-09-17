<script lang="ts">
  import { untrack } from 'svelte';

  interface Props {
    value: number;
    onChange: (value: number) => void;
  }

  let { value, onChange }: Props = $props();

  let localValue = $state(untrack(() => value));

  $effect(() => {
    localValue = value;
  });

  function decrement(e: Event) {
    e.stopPropagation();
    const next = localValue - 1;
    localValue = next;
    onChange(next);
  }

  function increment(e: Event) {
    e.stopPropagation();
    const next = localValue + 1;
    localValue = next;
    onChange(next);
  }

  function handleInput(e: Event) {
    e.stopPropagation();
    const input = e.currentTarget as HTMLInputElement;
    const parsed = Number.parseInt(input.value, 10);
    if (Number.isNaN(parsed)) {
      input.value = String(localValue);
      return;
    }
    localValue = parsed;
    input.value = String(parsed);
    onChange(parsed);
  }
</script>

<div role="region" class="extra-controls" onpointerdown={(e) => e.stopPropagation()}>
  <button type="button" class="extra-btn" onclick={decrement}>−</button>
  <input
    type="number"
    class="extra-input"
    value={localValue}
    oninput={handleInput}
    onclick={(e) => e.stopPropagation()}
  />
  <button type="button" class="extra-btn" onclick={increment}>+</button>
</div>

<style>
  .extra-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .extra-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid var(--shw-color-border, #4a425c);
    border-radius: 0;
    background: var(--shw-glass-fill, rgb(255 255 255 / 7%));
    cursor: pointer;
    font-size: 14px;
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
    padding: 0;
    line-height: 1;
    transition:
      background-color 0.12s ease,
      border-color 0.12s ease;
  }

  .extra-btn:hover {
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    border-color: var(--shw-color-primary, #8b4fc9);
  }

  .extra-input {
    width: 40px;
    height: 24px;
    text-align: center;
    border: 1px solid var(--shw-color-border, #4a425c);
    border-radius: 0;
    font-size: 13px;
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
    background: var(--shw-glass-fill, rgb(255 255 255 / 7%));
    padding: 0;
    -moz-appearance: textfield;
  }

  .extra-input:focus {
    outline: none;
    border-color: var(--shw-color-primary-bright, #b57aef);
    box-shadow: var(--shw-focus-ring);
  }

  .extra-input::-webkit-inner-spin-button,
  .extra-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
