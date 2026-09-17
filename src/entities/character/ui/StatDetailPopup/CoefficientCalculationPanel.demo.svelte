<script lang="ts">
  import CoefficientCalculationPanel from './CoefficientCalculationPanel.svelte';
</script>

<div class="frame">
  <CoefficientCalculationPanel statTotal={14} />
</div>

<style>
  .frame {
    color: var(--shw-color-text, #e8e4f0);
  }
</style>
