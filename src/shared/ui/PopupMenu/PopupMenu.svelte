<script lang="ts" module>
  // Глобальный трекер: только один попап может быть открыт одновременно
  let activeMenuClose: (() => void) | null = null;

  /** Закрыть текущий открытый попап (если есть) */
  export function closeActivePopup() {
    if (activeMenuClose) {
      activeMenuClose();
      activeMenuClose = null;
    }
  }
</script>

<script lang="ts">
  import type { PopupMenuItem } from "./types";
  import PopupMenuDropdown from "./PopupMenuDropdown.svelte";

  interface Props {
    open: boolean;
    anchorEl: HTMLElement | undefined;
    items: PopupMenuItem[];
    onClose: () => void;
    menuId?: string;
  }

  let { open, anchorEl, items, onClose, menuId = "popup" }: Props = $props();

  let top = $state(0);
  let left = $state(0);

  // Svelte action: телепортирует DOM-узел в document.body.
  // Компонент остаётся в дереве Svelte → полная реактивность пропсов.
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }

  $effect(() => {
    if (!open) return;

    // Singleton: закрываем предыдущий попап
    if (activeMenuClose) {
      activeMenuClose();
      activeMenuClose = null;
    }
    activeMenuClose = onClose;

    // Позиция относительно якоря
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      top = rect.bottom + 2;
      left = rect.left + rect.width / 2;
    }

    // Закрытие по клику вне меню
    const currentMenuId = menuId;
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-popup-menu-id="${currentMenuId}"]`)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleDocClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleDocClick);
      activeMenuClose = null;
    };
  });
</script>

{#if open}
  <div
    use:portal
    data-popup-menu-id={menuId}
    style="position: fixed; top: {top}px; left: {left}px; transform: translateX(-50%); z-index: 999999; pointer-events: auto;"
  >
    <PopupMenuDropdown {items} />
  </div>
{/if}
