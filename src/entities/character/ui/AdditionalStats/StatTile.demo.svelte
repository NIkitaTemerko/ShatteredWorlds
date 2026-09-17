<script lang="ts">
  import type { AdditionalAttributes } from '../../../../shared/model/types';
  import type { StatSourceValues } from '../../../../documents/Actor/types/ShwActorSystem';
  import StatTile from './StatTile.svelte';

  let openKey = $state<keyof AdditionalAttributes | null>(null);

  const sources: StatSourceValues = {
    base: 2,
    growth: 0,
    equipment: 1,
    abilities: 0,
    extra: 1,
  };
</script>

<div class="frame">
  <div class="row">
    <StatTile
      statKey="initiative"
      total={4}
      {sources}
      isOpen={openKey === 'initiative'}
      onToggle={(key) => (openKey = openKey === key ? null : key)}
      onClose={() => (openKey = null)}
      onExtraChange={(key, value) => console.log('extra', key, value)}
    />
    <StatTile
      statKey="actions"
      total={3}
      {sources}
      isOpen={openKey === 'actions'}
      onToggle={(key) => (openKey = openKey === key ? null : key)}
      onClose={() => (openKey = null)}
      onExtraChange={(key, value) => console.log('extra', key, value)}
    />
  </div>
  <p class="hint">Tiles open StatDetailPopup on ☰</p>
</div>

<style>
  .frame {
    width: 22rem;
    color: var(--shw-color-text, #e8e4f0);
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .hint {
    margin: 0.75rem 0 0;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }
</style>
