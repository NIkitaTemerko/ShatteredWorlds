<script lang="ts">
  import type { AttributeRollSources } from '../../../../documents/Actor/types/ShwActorSystem';
  import AttributeRollDetailContent from './AttributeRollDetailContent.svelte';

  let sources = $state<AttributeRollSources>({
    base: 2,
    equipment: 1,
    abilities: 0,
    extra: 1,
  });

  const total = $derived(sources.base + sources.equipment + sources.abilities + sources.extra);
</script>

<div class="panel">
  <AttributeRollDetailContent
    title="Force · roll bonus"
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
