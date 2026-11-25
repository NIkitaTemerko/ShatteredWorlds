<script lang="ts">
  import type { ActivationType } from '../../../entities/consumable/model';
  import ActivationControl from './ActivationControl.svelte';

  let activationType = $state<ActivationType>('action');
  let activationCost = $state(1);
</script>

<div class="frame">
  <ActivationControl
    {activationType}
    {activationCost}
    onActivationTypeChange={(v) => (activationType = v)}
    onActivationCostChange={(v) => (activationCost = v)}
  />
  <p class="hint">{activationType} · cost {activationCost}</p>
</div>

<style>
  .frame {
    width: 14rem;
    color: var(--shw-color-text, #e8e4f0);
  }

  .hint {
    margin: 0.75rem 0 0;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }
</style>
