<script lang="ts">
  import type { Snippet } from 'svelte';
  import { AnchoredPopup } from '../AnchoredPopup';

  interface Props {
    label: string;
    popupId: string;
    children: Snippet;
  }

  let { label, popupId, children }: Props = $props();

  let anchorEl: HTMLElement | undefined = $state();
  let open = $state(false);
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  function show() {
    if (hideTimer) clearTimeout(hideTimer);
    open = true;
  }

  function scheduleHide() {
    hideTimer = setTimeout(() => {
      open = false;
    }, 100);
  }

  function cancelHide() {
    if (hideTimer) clearTimeout(hideTimer);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  bind:this={anchorEl}
  class="hover-tooltip-anchor"
  onmouseenter={show}
  onmouseleave={scheduleHide}
>
  {@render children()}
</span>

<AnchoredPopup
  open={open}
  {anchorEl}
  {popupId}
  triggerMode="hover"
  role="tooltip"
  panelClass="hover-tooltip-panel"
  onClose={() => {
    open = false;
  }}
>
  {#snippet children()}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span class="hover-tooltip-text" onmouseenter={cancelHide} onmouseleave={scheduleHide}>
      {label}
    </span>
  {/snippet}
</AnchoredPopup>

<style>
  .hover-tooltip-anchor {
    display: inline-flex;
  }

  :global(.anchored-popup-panel.hover-tooltip-panel) {
    min-width: 0;
    max-width: 240px;
    padding: 0.35rem 0.5rem;
    background: #1a1a1a;
    border: none;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.35;
    text-align: center;
  }

  :global(.hover-tooltip-text) {
    display: block;
    color: inherit;
  }
</style>
