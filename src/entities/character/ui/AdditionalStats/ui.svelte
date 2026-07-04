<script lang="ts">
  import type { ShwActor } from '../../../../documents/Actor/ShwActor';
  import { ALL_ADDITIONAL_KEYS } from '../../../../shared/model/constants';
  import type { AdditionalAttributes } from '../../../../shared/model/types';
  import StatTile from './StatTile.svelte';

  interface Props {
    actor: ShwActor<'character'> | ShwActor<'npc'>;
    onUpdate: (key: keyof AdditionalAttributes, value: number) => void;
  }

  let { actor, onUpdate }: Props = $props();

  const sys = $derived(actor.system);
  const variant = $derived(actor.type === 'npc' ? 'npc' : 'character');

  let openStatKey = $state<keyof AdditionalAttributes | null>(null);

  function toggleInfo(key: keyof AdditionalAttributes, e: Event) {
    e.stopPropagation();
    openStatKey = openStatKey === key ? null : key;
  }

  function closePopup() {
    openStatKey = null;
  }
</script>

<div class="stats-grid">
  {#each ALL_ADDITIONAL_KEYS as key (key)}
    <StatTile
      statKey={key}
      total={sys.totals[key] ?? 0}
      sources={sys.additionalStatSources?.[key]}
      {variant}
      isOpen={openStatKey === key}
      onToggle={toggleInfo}
      onClose={closePopup}
      onExtraChange={onUpdate}
    />
  {/each}
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    width: 100%;
    user-select: none;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 0;
  }
</style>
