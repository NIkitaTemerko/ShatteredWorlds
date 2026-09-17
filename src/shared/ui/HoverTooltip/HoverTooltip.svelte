<script lang="ts">
  import { Tooltip } from 'bits-ui';
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    /** Kept for call-site compatibility; unused by bits Tooltip. */
    popupId?: string;
    children: Snippet;
    delayDuration?: number;
  }

  let { label, popupId: _popupId, children, delayDuration = 100 }: Props = $props();
</script>

<Tooltip.Provider>
  <Tooltip.Root {delayDuration}>
    <Tooltip.Trigger class="shw-tooltip-trigger">
      {@render children()}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content class="shw-tooltip-content" sideOffset={6}>
        <span class="shw-tooltip-text">{label}</span>
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>

<style>
  :global(.shw-tooltip-trigger) {
    display: inline-flex;
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    cursor: inherit;
    font: inherit;
  }

  :global(.shw-tooltip-content) {
    z-index: var(--shw-z-popover, 100000);
    max-width: 240px;
    padding: 0.4rem 0.55rem;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    background: linear-gradient(
      160deg,
      var(--shw-color-surface-raised, #262033) 0%,
      var(--shw-color-primary-deep, #5a2d8a) 140%
    );
    color: var(--shw-color-text, #fff);
    font-family: var(--shw-font, inherit);
    font-size: 12px;
    font-weight: 500;
    line-height: 1.35;
    text-align: center;
    box-shadow: var(--shw-shadow-panel, 0 4px 12px rgba(0, 0, 0, 0.35));
    outline: none;
  }

  :global(.shw-tooltip-text) {
    display: block;
    color: inherit;
  }
</style>
