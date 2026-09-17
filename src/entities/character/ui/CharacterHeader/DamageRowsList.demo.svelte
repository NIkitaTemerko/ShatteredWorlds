<script lang="ts">
  import type { DamageRow } from './DamageRowItem.svelte';
  import DamageRowsList from './DamageRowsList.svelte';

  let rows = $state<DamageRow[]>([
    { id: 'r1', type: 'physical', amount: 8, penetration: 1, fallHeight: 0 },
    { id: 'r2', type: 'elemental', amount: 5, penetration: 0, fallHeight: 0 },
    { id: 'r3', type: 'magical', amount: 3, penetration: 2, fallHeight: 0 },
  ]);
</script>

<div class="frame">
  <DamageRowsList bind:rows massCategory={2} />
</div>

<style>
  .frame {
    width: min(28rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
