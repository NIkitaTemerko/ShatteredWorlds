<script lang="ts">
  import AttributeStatCell from './AttributeStatCell.svelte';

  let open = $state(false);
</script>

<div class="frame">
  <div class="cell-wrap">
    <AttributeStatCell
      value={14}
      popupId="story-attr-cell"
      isOpen={open}
      onToggle={() => (open = !open)}
      onClose={() => (open = false)}
    >
      {#snippet popupContent()}
        <div class="popup">
          <p>Base 10 + Extra 4</p>
          <p class="muted">Popup content stub</p>
        </div>
      {/snippet}
    </AttributeStatCell>
  </div>
  <p class="hint">Click ☰ to open anchored popup</p>
</div>

<style>
  .frame {
    width: 12rem;
    color: var(--shw-color-text, #e8e4f0);
  }

  .cell-wrap {
    display: inline-flex;
    padding: 0.75rem 1rem;
    border: 1px solid var(--shw-color-border, #4a425c);
    background: rgb(18 16 28 / 45%);
  }

  .hint {
    margin: 0.75rem 0 0;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }

  .popup {
    min-width: 10rem;
    padding: 0.75rem;
    color: var(--shw-color-text, #e8e4f0);
  }

  .popup p {
    margin: 0 0 0.35rem;
  }

  .muted {
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }
</style>
