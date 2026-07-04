<script lang="ts">
  import { t } from '../../../../shared/i18n';
  import { ADDITIONAL_ATTRIBUTE_LABELS } from '../../../../shared/model/constants';
  import type { AdditionalAttributes } from '../../../../shared/model/types';
  import type { StatSourceValues } from '../../../../documents/Actor/types/ShwActorSystem';
  import { ActionIcon } from '../../../../shared/ui/ActionIcon';
  import { closeActivePopup } from '../../../../shared/ui/AnchoredPopup';
  import { ADDITIONAL_ATTRIBUTE_COLORS, ADDITIONAL_ATTRIBUTE_ICONS } from '../../model';
  import { StatDetailPopup } from '../StatDetailPopup';

  interface Props {
    statKey: keyof AdditionalAttributes;
    total: number;
    sources: StatSourceValues | undefined;
    variant?: 'character' | 'npc';
    isOpen: boolean;
    onToggle: (key: keyof AdditionalAttributes, e: Event) => void;
    onClose: () => void;
    onExtraChange: (key: keyof AdditionalAttributes, value: number) => void;
  }

  let {
    statKey,
    total,
    sources,
    variant = 'character',
    isOpen,
    onToggle,
    onClose,
    onExtraChange,
  }: Props = $props();

  let infoAnchorEl = $state<HTMLElement | undefined>();

  function handleToggle(e: Event) {
    if (!isOpen) {
      closeActivePopup();
    }
    onToggle(statKey, e);
  }
</script>

<div class="stat-tile" data-key={statKey}>
  <i class={ADDITIONAL_ATTRIBUTE_ICONS[statKey]} style="color: {ADDITIONAL_ATTRIBUTE_COLORS[statKey]}" aria-hidden="true"></i>
  <span class="label">{t(ADDITIONAL_ATTRIBUTE_LABELS[statKey])}</span>
  <span class="value">{total}</span>
  <div class="stat-menu-container" data-popup-id="stat-{statKey}" bind:this={infoAnchorEl}>
    <ActionIcon
      onclick={handleToggle}
      aria-label={t('character.statMenu')}
      title={t('character.statMenu')}
      variant="ghost"
      size="sm"
      class="menu-action"
    >
      {#snippet icon()}
        <i class="fas fa-bars"></i>
      {/snippet}
    </ActionIcon>
  </div>
  {#if isOpen && sources}
    <StatDetailPopup
      open={true}
      anchorEl={infoAnchorEl}
      popupId="stat-{statKey}"
      statKey={statKey}
      {sources}
      {total}
      {variant}
      onClose={onClose}
      onExtraChange={(value) => onExtraChange(statKey, value)}
    />
  {/if}
</div>

<style>
  .stat-tile {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    height: 40px;
    line-height: 1;
    background: #d1f7e4;
  }

  .stat-tile i {
    font-size: 14px;
    width: 16px;
    text-align: center;
    flex-shrink: 0;
  }

  .label {
    flex: 1 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .value {
    flex: 0 0 auto;
    min-width: 1.5rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .stat-menu-container {
    flex-shrink: 0;
  }

  .stat-tile :global(.menu-action) {
    transition: color 0.15s;
    color: #64748b;
  }

  .stat-tile :global(.menu-action:hover) {
    color: #374151;
  }
</style>
