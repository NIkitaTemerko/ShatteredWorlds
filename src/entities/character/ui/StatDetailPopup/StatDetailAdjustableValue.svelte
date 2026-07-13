<script lang="ts">
  import { untrack } from "svelte";

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
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
    padding: 0;
    line-height: 1;
  }

  .extra-btn:hover {
    background-color: rgba(222, 184, 135, 0.25);
  }

  .extra-input {
    width: 40px;
    height: 24px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    font-size: 13px;
    color: #374151;
    background: transparent;
    padding: 0;
    -moz-appearance: textfield;
  }

  .extra-input::-webkit-inner-spin-button,
  .extra-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
