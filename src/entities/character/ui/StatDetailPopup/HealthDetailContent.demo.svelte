<script lang="ts">
  import type {
    HealthStatSources,
    StatSourceValues,
  } from '../../../../documents/Actor/types/ShwActorSystem';
  import HealthDetailContent from './HealthDetailContent.svelte';

  let sources = $state<HealthStatSources>({
    base: 20,
    equipment: 4,
    abilities: 2,
    extra: 0,
  });

  let barrierSources = $state<StatSourceValues>({
    base: 5,
    growth: 0,
    equipment: 2,
    abilities: 0,
    extra: 1,
  });

  const total = $derived(sources.base + sources.equipment + sources.abilities + sources.extra);
  const barrierTotal = $derived(
    barrierSources.base +
      barrierSources.growth +
      barrierSources.equipment +
      barrierSources.abilities +
      barrierSources.extra,
  );
</script>

<div class="panel">
  <HealthDetailContent
    {sources}
    {total}
    barrierValue={6}
    {barrierSources}
    {barrierTotal}
    onExtraChange={(v) => (sources = { ...sources, extra: v })}
    onBarrierExtraChange={(v) => (barrierSources = { ...barrierSources, extra: v })}
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
