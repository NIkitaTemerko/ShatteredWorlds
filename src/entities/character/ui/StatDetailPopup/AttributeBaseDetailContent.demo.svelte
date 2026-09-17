<script lang="ts">
  import type { AttributeValueSources } from '../../../../documents/Actor/types/ShwActorSystem';
  import AttributeBaseDetailContent from './AttributeBaseDetailContent.svelte';

  let sources = $state<AttributeValueSources>({
    base: 10,
    equipment: 2,
    abilities: 1,
  });

  const total = $derived(sources.base + sources.equipment + sources.abilities);
</script>

<div class="panel">
  <AttributeBaseDetailContent
    titleKey="attributes.force"
    {sources}
    {total}
    onBaseChange={(v) => (sources = { ...sources, base: v })}
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
