<script lang="ts" module>
  import { closeActivePopup, setActivePopupClose } from './closeActivePopup';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    anchorEl: HTMLElement | undefined;
    onClose: () => void;
    popupId?: string;
    triggerMode?: 'click' | 'hover';
    children: Snippet;
    role?: string;
    panelClass?: string;
  }

  let {
    open,
    anchorEl,
    onClose,
    popupId = 'popup',
    triggerMode = 'click',
    children,
    role = 'dialog',
    panelClass = '',
  }: Props = $props();

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
    if (triggerMode !== 'hover') return;
    cancelLeaveTimer();
    leaveTimer = setTimeout(() => {
      onClose();
    }, 300);
  }

  function handleMouseEnter() {
    cancelLeaveTimer();
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }

  function isEventInsidePopup(event: Event, currentPopupId: string): boolean {
    const path = event.composedPath();
    if (anchorEl && path.includes(anchorEl)) return true;
    return path.some(
      (node) =>
        node instanceof Element && node.getAttribute('data-popup-id') === currentPopupId,
    );
  }

  $effect(() => {
    if (!open) return;

    closeActivePopup();
    setActivePopupClose(onClose);

    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      top = rect.bottom + 2;
      left = rect.left + rect.width / 2;

      if (triggerMode === 'hover') {
        anchorEl.addEventListener('mouseenter', handleMouseEnter);
        anchorEl.addEventListener('mouseleave', handleMouseLeave);
      }
    }

    const currentPopupId = popupId;
    const handleDocPointerDown = (e: PointerEvent) => {
      if (isEventInsidePopup(e, currentPopupId)) return;
      onClose();
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('pointerdown', handleDocPointerDown, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      cancelLeaveTimer();
      document.removeEventListener('pointerdown', handleDocPointerDown, true);
      if (anchorEl && triggerMode === 'hover') {
        anchorEl.removeEventListener('mouseenter', handleMouseEnter);
        anchorEl.removeEventListener('mouseleave', handleMouseLeave);
      }
      setActivePopupClose(null);
    };
  });
</script>

{#if open}
  <div
    use:portal
    data-popup-id={popupId}
    {role}
    tabindex="-1"
    style="position: fixed; top: {top}px; left: {left}px; transform: translateX(-50%); z-index: 999999; pointer-events: auto;"
    onpointerdown={(e) => e.stopPropagation()}
    onmouseleave={handleMouseLeave}
    onmouseenter={handleMouseEnter}
  >
    <div class="anchored-popup-panel {panelClass}">
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .anchored-popup-panel {
    min-width: 180px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
</style>
