<script lang="ts">
  import type { CharacterTab } from '../../../../entities/character/model';
  import TabNavigation from './ui.svelte';

  let activeTab = $state<CharacterTab>('stats');
</script>

<div class="frame">
  <TabNavigation {activeTab} onTabChange={(tab) => (activeTab = tab)} />
  <p class="hint">Active: {activeTab}</p>
</div>

<style>
  .frame {
    width: min(40rem, 100vw);
    color: var(--shw-color-text, #e8e4f0);
  }

  .hint {
    margin: 0.75rem 0 0;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
  }
</style>
