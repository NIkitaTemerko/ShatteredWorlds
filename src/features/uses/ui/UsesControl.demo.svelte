<script lang="ts">
  import type { PerType } from '../../../entities/consumable/model';
  import UsesControl from './UsesControl.svelte';

  let usesValue = $state(2);
  let usesMax = $state(5);
  let usesPer = $state<PerType>('charges');
</script>

<div class="frame">
  <UsesControl
    {usesValue}
    {usesMax}
    {usesPer}
    onUsesValueChange={(v) => (usesValue = v)}
    onUsesMaxChange={(v) => (usesMax = v)}
    onUsesPerChange={(v) => (usesPer = v)}
  />
  <p class="hint">{usesValue} / {usesMax} per {usesPer}</p>
</div>

<style>
  .frame {
    width: 12rem;
    color: var(--shw-color-text, #e8e4f0);
  }

  .hint {
    margin: 0.75rem 0 0;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }
</style>
