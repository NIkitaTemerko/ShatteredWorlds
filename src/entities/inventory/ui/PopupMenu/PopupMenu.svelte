<script lang="ts">
  import { AnchoredPopup } from '../../../../shared/ui/AnchoredPopup';
  import PopupMenuDropdown from './PopupMenuDropdown.svelte';
  import type { PopupMenuItem } from './types';

  interface Props {
    open: boolean;
    anchorEl: HTMLElement | undefined;
    items: PopupMenuItem[];
    onClose: () => void;
    menuId?: string;
  }

  let { open, anchorEl, items, onClose, menuId = 'popup' }: Props = $props();
</script>

<AnchoredPopup
  {open}
  {anchorEl}
  {onClose}
  popupId={menuId}
  triggerMode="hover"
  role="menu"
  panelClass="anchored-popup-panel--bare"
>
  {#snippet children()}
    <PopupMenuDropdown {items} />
  {/snippet}
</AnchoredPopup>

<style>
  :global(.anchored-popup-panel--bare) {
    background: transparent;
    border: none;
    box-shadow: none;
    min-width: 0;
    padding: 0;
  }
</style>
