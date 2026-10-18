<script lang="ts">
  import type { Snippet } from 'svelte';
  import { AnchoredPopup, closeActivePopup } from '../../../../shared/ui/AnchoredPopup';
  import { ActionIcon } from '../../../../shared/ui/ActionIcon';
  import { t } from '../../../../shared/i18n';

  interface Props {
    value: number;
    popupId: string;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    popupContent: Snippet;
  }

  let { value, popupId, isOpen, onToggle, onClose, popupContent }: Props = $props();

  let anchorEl = $state<HTMLElement | undefined>();

  function handleToggle(e: Event) {
    e.stopPropagation();
    if (!isOpen) {
      closeActivePopup();
    }
    onToggle();
  }
</script>

<div class="stat-cell">
  <span class="stat-value">{value}</span>
  <div class="stat-menu-container" data-popup-id={popupId} bind:this={anchorEl}>
    <ActionIcon
      onclick={handleToggle}
      aria-label={t('character.statMenu')}
      title={t('character.statMenu')}
      variant="ghost"
      size="sm"
      class="menu-action"
    >
      {#snippet icon()}
        <i class="fas fa-bars" aria-hidden="true"></i>
      {/snippet}
    </ActionIcon>
  </div>
</div>

{#if isOpen}
  <AnchoredPopup open={true} anchorEl={anchorEl} onClose={onClose} {popupId} triggerMode="click">
    {#snippet children()}
      {@render popupContent()}
    {/snippet}
  </AnchoredPopup>
{/if}

<style>
  .stat-cell {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    width: 100%;
    min-width: 0;
  }

  .stat-value {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .stat-menu-container {
    flex-shrink: 0;
  }

  .stat-cell :global(.menu-action) {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 11px;
    transition: color 0.15s;
    color: var(--shw-color-text, #e8e4f0);
  }

  .stat-cell :global(.menu-action:hover) {
    color: var(--shw-color-primary-bright, #b57aef);
  }
</style>
