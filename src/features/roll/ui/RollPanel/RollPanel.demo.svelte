<script lang="ts">
  import type { ShwActor } from '../../../../documents/Actor/ShwActor';
  import RollPanel from './ui.svelte';

  // Story stub — no Foundry actor; roll logs to console.
  const actor = {
    roll: (...args: unknown[]) => console.log('[RollPanel story] roll', ...args),
  } as unknown as ShwActor<'character'>;
</script>

<div class="frame">
  <RollPanel {actor} />
</div>

<style>
  .frame {
    width: min(36rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
