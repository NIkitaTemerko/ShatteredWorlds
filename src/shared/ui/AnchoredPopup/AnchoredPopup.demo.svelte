<script lang="ts">
  import { Button } from '../Button';
  import AnchoredPopup from './AnchoredPopup.svelte';

  interface Props {
    triggerMode?: 'click' | 'hover';
  }

  let { triggerMode = 'click' }: Props = $props();

  let open = $state(false);
  let anchorEl = $state<HTMLElement | undefined>();

  function toggle() {
    open = !open;
  }
</script>

<div class="demo">
  <span bind:this={anchorEl}>
    <Button
      variant="outline"
      onclick={toggle}
      onmouseenter={() => {
        if (triggerMode === 'hover') open = true;
      }}
    >
      {triggerMode === 'hover' ? 'Hover me' : 'Open popup'}
    </Button>
  </span>

  <AnchoredPopup {open} {anchorEl} {triggerMode} onClose={() => (open = false)} popupId="story-popup">
    {#snippet children()}
      <div class="demo-body">
        <strong>Crystal panel</strong>
        <p>Anchored via bits-ui Popover.</p>
      </div>
    {/snippet}
  </AnchoredPopup>
</div>

<style>
  .demo {
    min-height: 8rem;
    display: grid;
    place-items: center;
  }

  .demo-body {
    padding: 0.75rem 1rem;
    max-width: 14rem;
  }

  .demo-body strong {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--shw-color-primary-bright, #b57aef);
  }

  .demo-body p {
    margin: 0;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 13px;
    line-height: 1.4;
  }
</style>
