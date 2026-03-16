<script lang="ts">
  import type { MenuQuantityItem } from "./types";

  interface Props {
    item: MenuQuantityItem;
  }

  let { item }: Props = $props();

  // Локальное состояние для мгновенного отклика UI
  let localValue = $state(item.value);

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
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .popup-menu-quantity__label {
    font-size: 13px;
    color: #374151;
    white-space: nowrap;
  }

  .popup-menu-quantity__controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .popup-menu-quantity__btn {
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
    transition: background-color 0.15s;
    padding: 0;
    line-height: 1;
  }

  .popup-menu-quantity__btn:hover:not(:disabled) {
    background-color: rgba(222, 184, 135, 0.25);
  }

  .popup-menu-quantity__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .popup-menu-quantity__input {
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

  .popup-menu-quantity__input::-webkit-inner-spin-button,
  .popup-menu-quantity__input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
