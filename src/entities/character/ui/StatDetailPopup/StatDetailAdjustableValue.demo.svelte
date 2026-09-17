<script lang="ts">
  import StatDetailAdjustableValue from './StatDetailAdjustableValue.svelte';

  let value = $state(3);
</script>

<div class="frame">
  <StatDetailAdjustableValue {value} onChange={(v) => (value = v)} />
  <p class="hint">Value: {value}</p>
</div>

<style>
  .frame {
    width: 10rem;
    color: var(--shw-color-text, #e8e4f0);
  }

  .hint {
    margin: 0.75rem 0 0;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }
</style>
