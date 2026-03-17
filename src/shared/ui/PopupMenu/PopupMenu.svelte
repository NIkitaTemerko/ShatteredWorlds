<script lang="ts" module>
  import { closeActivePopup, setActiveMenuClose } from "./closeActivePopup";
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
  let leaveTimer: ReturnType<typeof setTimeout> | null = null;

  function cancelLeaveTimer() {
    if (leaveTimer !== null) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
  }

  function handleMouseLeave() {
    cancelLeaveTimer();
    leaveTimer = setTimeout(() => {
      onClose();
    }, 300);
  }

  function handleMouseEnter() {
    cancelLeaveTimer();
  }

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
    closeActivePopup();
    setActiveMenuClose(onClose);

    // Позиция относительно якоря
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      top = rect.bottom + 2;
      left = rect.left + rect.width / 2;

      // Якорь тоже участвует в hover-зоне попапа
      anchorEl.addEventListener("mouseenter", handleMouseEnter);
      anchorEl.addEventListener("mouseleave", handleMouseLeave);
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
      cancelLeaveTimer();
      document.removeEventListener("click", handleDocClick);
      if (anchorEl) {
        anchorEl.removeEventListener("mouseenter", handleMouseEnter);
        anchorEl.removeEventListener("mouseleave", handleMouseLeave);
      }
      setActiveMenuClose(null);
    };
  });
</script>

{#if open}
  <div
    use:portal
    data-popup-menu-id={menuId}
    role="menu"
    tabindex="-1"
    style="position: fixed; top: {top}px; left: {left}px; transform: translateX(-50%); z-index: 999999; pointer-events: auto;"
    onmouseleave={handleMouseLeave}
    onmouseenter={handleMouseEnter}
  >
    <PopupMenuDropdown {items} />
  </div>
{/if}
