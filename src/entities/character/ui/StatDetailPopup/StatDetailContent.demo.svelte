<script lang="ts">
  import type { StatSourceValues } from '../../../../documents/Actor/types/ShwActorSystem';
  import StatDetailContent from './StatDetailContent.svelte';

  let sources = $state<StatSourceValues>({
    base: 2,
    growth: 1,
    equipment: 3,
    abilities: 0,
    extra: 1,
  });

  const total = $derived(
    sources.base + sources.growth + sources.equipment + sources.abilities + sources.extra,
  );
</script>

<div class="panel">
  <StatDetailContent
    titleKey="additionalAttributes.initiative"
    {sources}
    {total}
    onExtraChange={(v) => (sources = { ...sources, extra: v })}
  />
</div>

<style>
  .panel {
    width: 16rem;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    background: rgb(28 24 40 / 96%);
    box-shadow: var(--shw-shadow-panel);
    padding: 0.5rem;
  }
</style>
