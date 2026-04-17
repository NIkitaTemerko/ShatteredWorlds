<script lang="ts">
  import type { SelectOption } from "../../../entities/consumable/model/types";
  import { t, type I18nKey } from "../../i18n";

  interface Props {
    /** Текущее значение (ключ пресета или произвольная строка) */
    value?: string;
    /** Предустановленные опции с i18n-ключами */
    options: SelectOption[];
    /** Плейсхолдер для текстового ввода */
    placeholder?: string;
    variant?: "underline" | "bordered";
    fullWidth?: boolean;
    class?: string;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(""),
    options,
    placeholder = "",
    variant = "bordered",
    fullWidth = false,
    class: className = "",
    onchange,
  }: Props = $props();

  let inputValue = $state("");
  let isOpen = $state(false);
  let filteredOptions = $state<SelectOption[]>([]);
  let inputEl: HTMLInputElement | undefined = $state();

  /** Возвращает отображаемый текст для значения */
  function getDisplayText(val: string): string {
    const preset = options.find((o) => o.value === val);
    if (preset) return t(preset.label as I18nKey);
    return val;
  }

  // Инициализация и синхронизация с внешним value
  $effect(() => {
    inputValue = getDisplayText(value);
  });

  function updateFiltered() {
    const query = inputValue.toLowerCase().trim();
    if (!query) {
      filteredOptions = options;
      return;
    }
    filteredOptions = options.filter((o) => {
      const label = t(o.label as I18nKey).toLowerCase();
      return label.includes(query) || o.value.toLowerCase().includes(query);
    });
  }

  function handleInput() {
    isOpen = true;
    updateFiltered();
  }

  function handleFocus() {
    isOpen = true;
    updateFiltered();
  }

  function handleBlur() {
    // Задержка, чтобы клик по опции успел сработать
    setTimeout(() => {
      isOpen = false;
      commitValue();
    }, 150);
  }

  function selectOption(option: SelectOption) {
    value = option.value;
    inputValue = t(option.label as I18nKey);
    isOpen = false;
    onchange?.(option.value);
  }

  function commitValue() {
    // Проверяем, совпадает ли введённый текст с пресетом
    const matchByLabel = options.find((o) => t(o.label as I18nKey).toLowerCase() === inputValue.toLowerCase().trim());
    const matchByValue = options.find((o) => o.value.toLowerCase() === inputValue.toLowerCase().trim());
    const match = matchByLabel || matchByValue;

    if (match) {
      value = match.value;
      inputValue = t(match.label as I18nKey);
      onchange?.(match.value);
    } else if (inputValue.trim()) {
      // Кастомное значение — сохраняем как есть
      value = inputValue.trim();
      onchange?.(value);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      isOpen = false;
      commitValue();
      inputEl?.blur();
    } else if (e.key === "Escape") {
      isOpen = false;
      inputValue = getDisplayText(value);
      inputEl?.blur();
    }
  }
</script>

<div class="autocomplete-wrapper" class:full-width={fullWidth}>
  <input
    bind:this={inputEl}
    bind:value={inputValue}
    type="text"
    class="shw-autocomplete {className}"
    class:variant-underline={variant === "underline"}
    {placeholder}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    onkeydown={handleKeydown}
  />

  {#if isOpen && filteredOptions.length > 0}
    <ul class="autocomplete-dropdown">
      {#each filteredOptions as option}
        <li>
          <button
            type="button"
            class="autocomplete-option"
            class:active={option.value === value}
            onmousedown={() => selectOption(option)}
          >
            {t(option.label as I18nKey)}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .autocomplete-wrapper {
    position: relative;
    display: inline-block;
  }

  .autocomplete-wrapper.full-width {
    width: 100%;
  }

  .shw-autocomplete {
    font-size: var(--font-size-14, 14px);
    font-weight: 700;
    line-height: 1.5;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-border-light-2, rgba(0, 0, 0, 0.2));
    border-radius: 4px;
    background: transparent;
    transition: all 0.2s ease;
    outline: none;
    color: inherit;
    width: 100%;
  }

  .shw-autocomplete:hover {
    border-color: var(--color-border-dark, rgba(0, 0, 0, 0.4));
  }

  .shw-autocomplete:focus {
    border-color: var(--color-primary, #0066cc);
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }

  .shw-autocomplete.variant-underline {
    border: none;
    border-bottom: 1px solid var(--color-border-light-2, rgba(0, 0, 0, 0.2));
    border-radius: 0;
    padding: 0.25rem 0.5rem;
  }

  .shw-autocomplete.variant-underline:hover {
    border-bottom-color: var(--color-border-dark, rgba(0, 0, 0, 0.4));
  }

  .shw-autocomplete.variant-underline:focus {
    border-bottom-color: var(--color-primary, #0066cc);
    box-shadow: none;
  }

  .autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid var(--color-border-light-2, rgba(0, 0, 0, 0.2));
    border-radius: 4px;
    margin: 2px 0 0;
    padding: 0;
    list-style: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .autocomplete-option {
    width: 100%;
    text-align: left;
    padding: 0.35rem 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: var(--font-size-14, 14px);
    color: #111;
    transition: background 0.1s;
  }

  .autocomplete-option:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  .autocomplete-option.active {
    background: rgba(0, 102, 204, 0.1);
    font-weight: 700;
  }
</style>
