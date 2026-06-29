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
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-popup-id="${currentPopupId}"]`)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleDocClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      cancelLeaveTimer();
      document.removeEventListener('click', handleDocClick);
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
