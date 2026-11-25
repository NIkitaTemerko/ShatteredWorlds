<script lang="ts">
  import { untrack } from "svelte";
  import type { MenuQuantityItem } from "./types";

  interface Props {
    item: MenuQuantityItem;
  }

  let { item }: Props = $props();

  // Локальное состояние для мгновенного отклика UI
  let localValue = $state(untrack(() => item.value));

  const minValue = $derived(item.min ?? 1);

  // Если max изменился извне (например, stackLimit в редакторе) —
  // clamp localValue чтобы не выходить за новые границы
  $effect(() => {
    const clamped = clamp(localValue);
    if (clamped !== localValue) {
      localValue = clamped;
      item.onChange(localValue);
    }
  });

  function clamp(value: number): number {
    if (value < minValue) return minValue;
    if (item.max != null && value > item.max) return item.max;
    return value;
  }

  function decrement(e: Event) {
    e.stopPropagation();
    const next = clamp(localValue - 1);
    if (next !== localValue) {
      localValue = next;
      item.onChange(localValue);
    }
  }

  function increment(e: Event) {
    e.stopPropagation();
    const next = clamp(localValue + 1);
    if (next !== localValue) {
      localValue = next;
      item.onChange(localValue);
    }
  }

  function handleInput(e: Event) {
    e.stopPropagation();
    const input = e.currentTarget as HTMLInputElement;
    let value = Number.parseInt(input.value, 10);
    if (Number.isNaN(value)) {
      input.value = String(localValue);
      return;
    }
    value = clamp(value);
    localValue = value;
    // Принудительно синхронизируем DOM — Svelte может пропустить обновление
    // если localValue не изменился (когда clamp вернул то же значение)
    input.value = String(value);
    item.onChange(localValue);
  }
</script>

<div class="popup-menu-quantity">
  <span class="popup-menu-quantity__label">{item.label}</span>
  <div class="popup-menu-quantity__controls">
    <button class="popup-menu-quantity__btn" onclick={decrement} disabled={localValue <= minValue}>−</button>
    <input
      type="number"
      class="popup-menu-quantity__input"
      value={localValue}
      min={minValue}
      max={item.max ?? undefined}
      oninput={handleInput}
      onclick={(e) => e.stopPropagation()}
    />
    <button class="popup-menu-quantity__btn" onclick={increment} disabled={item.max != null && localValue >= item.max}
      >+</button
    >
  </div>
</div>

<style>
  .popup-menu-quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.75rem;
    gap: 0.5rem;
    border-top: 1px solid var(--shw-color-border, #4a425c);
    border-bottom: 1px solid var(--shw-color-border, #4a425c);
  }

  .popup-menu-quantity__label {
    font-size: 13px;
    color: var(--shw-color-text, #e8e4f0);
    white-space: nowrap;
  }

  .popup-menu-quantity__controls {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .popup-menu-quantity__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 1.75rem;
    height: 1.75rem;
    border: 1px solid var(--shw-color-border, #4a425c);
    border-radius: 0;
    background: var(--shw-glass-fill, rgb(255 255 255 / 7%));
    cursor: pointer;
    font-size: 14px;
    font-family: var(--shw-font, inherit);
    color: var(--shw-color-text, #e8e4f0);
    transition: background-color 0.15s, border-color 0.15s;
    padding: 0;
    line-height: 1;
  }

  .popup-menu-quantity__btn:hover:not(:disabled) {
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    border-color: var(--shw-color-primary, #8b4fc9);
  }

  .popup-menu-quantity__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .popup-menu-quantity__input {
    box-sizing: border-box;
    width: 2.5rem;
    height: 1.75rem;
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

  .popup-menu-quantity__input::-webkit-inner-spin-button,
  .popup-menu-quantity__input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
