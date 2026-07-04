<script lang="ts">
  import type { AdditionalAttributes } from '../../../../documents/Actor/types/ShwActorSystem';
  import { AnchoredPopup } from '../../../../shared/ui/AnchoredPopup';
  import type { StatSourceValues } from '../../../../documents/Actor/types/ShwActorSystem';
  import StatDetailContent from './StatDetailContent.svelte';

  interface Props {
    open: boolean;
    anchorEl: HTMLElement | undefined;
    popupId: string;
    statKey: keyof AdditionalAttributes;
    sources: StatSourceValues;
    total: number;
    variant?: 'character' | 'npc';
    onClose: () => void;
    onExtraChange: (value: number) => void;
  }

  let {
    open,
    anchorEl,
    popupId,
    statKey,
    sources,
    total,
    variant = 'character',
    onClose,
    onExtraChange,
  }: Props = $props();
</script>

<AnchoredPopup {open} {anchorEl} {onClose} {popupId} triggerMode="click">
  {#snippet children()}
    <StatDetailContent {statKey} {sources} {total} {variant} {onExtraChange} />
  {/snippet}
</AnchoredPopup>
