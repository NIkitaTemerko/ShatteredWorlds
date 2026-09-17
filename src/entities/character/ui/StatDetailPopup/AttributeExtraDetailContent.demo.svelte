<script lang="ts">
  import type { AttributeExtraSources } from '../../../../documents/Actor/types/ShwActorSystem';
  import AttributeExtraDetailContent from './AttributeExtraDetailContent.svelte';

  let sources = $state<AttributeExtraSources>({
    equipment: 1,
    abilities: 2,
    extra: 3,
  });
</script>

<div class="panel">
  <AttributeExtraDetailContent
    title="Force · char bonus"
    {sources}
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
