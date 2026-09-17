<script lang="ts">
  import DamageRowItem, { type DamageRow } from './DamageRowItem.svelte';

  let row = $state<DamageRow>({
    id: 'row-1',
    type: 'physical',
    amount: 8,
    penetration: 1,
    fallHeight: 0,
  });
</script>

<div class="frame">
  <DamageRowItem
    {row}
    massCategory={2}
    onUpdate={(patch) => (row = { ...row, ...patch })}
    onRemove={() => console.log('remove')}
  />
</div>

<style>
  .frame {
    width: min(28rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
