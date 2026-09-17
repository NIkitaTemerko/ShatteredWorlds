<script lang="ts" module>
  import { closeActivePopup, setActivePopupClose } from './closeActivePopup';
</script>

<script lang="ts">
  import { Popover } from 'bits-ui';
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

  let leaveTimer: ReturnType<typeof setTimeout> | null = null;

  function cancelLeaveTimer() {
    if (leaveTimer !== null) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
  }

  function scheduleClose() {
    if (triggerMode !== 'hover') return;
    cancelLeaveTimer();
    leaveTimer = setTimeout(() => onClose(), 300);
  }

  function handleOpenChange(next: boolean) {
    if (!next) onClose();
  }

  $effect(() => {
    if (!open) {
      cancelLeaveTimer();
      return;
    }

    closeActivePopup();
    setActivePopupClose(onClose);

    if (triggerMode === 'hover' && anchorEl) {
      anchorEl.addEventListener('mouseenter', cancelLeaveTimer);
      anchorEl.addEventListener('mouseleave', scheduleClose);
    }

    return () => {
      cancelLeaveTimer();
      if (triggerMode === 'hover' && anchorEl) {
        anchorEl.removeEventListener('mouseenter', cancelLeaveTimer);
        anchorEl.removeEventListener('mouseleave', scheduleClose);
      }
      setActivePopupClose(null);
    };
  });
</script>

<Popover.Root {open} onOpenChange={handleOpenChange}>
  <Popover.Portal>
    <Popover.Content
      class="shw-anchored-popup {panelClass}"
      data-popup-id={popupId}
      {role}
      customAnchor={anchorEl}
      side="bottom"
      align="center"
      sideOffset={2}
      trapFocus={false}
      preventScroll={false}
      onInteractOutside={(event) => {
        if (anchorEl && event.target instanceof Node && anchorEl.contains(event.target)) {
          event.preventDefault();
        }
      }}
      onmouseenter={cancelLeaveTimer}
      onmouseleave={scheduleClose}
    >
      {@render children()}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style>
  :global(.shw-anchored-popup) {
    z-index: var(--shw-z-popover, 100000);
    min-width: 180px;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    border-radius: 0;
    background: rgb(28 24 40 / 96%);
    color: var(--shw-color-text, #e8e4f0);
    box-shadow: var(--shw-shadow-panel, 0 10px 28px rgb(0 0 0 / 40%));
    outline: none;
    padding: 0.5rem;
  }

  :global(.shw-anchored-popup.anchored-popup-panel--bare) {
    min-width: 0;
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
  }
</style>
