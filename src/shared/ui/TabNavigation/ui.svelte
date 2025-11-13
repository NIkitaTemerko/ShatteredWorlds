<script lang="ts">
  import type { CharacterTab, TabConfig } from '../../model';
  import { TAB_CONFIGS } from '../../model';

  interface Props {
    activeTab: CharacterTab;
    onTabChange: (tab: CharacterTab) => void;
  }

  let { activeTab, onTabChange }: Props = $props();
</script>

<nav class="sheet-tabs" data-group="main">
  {#each TAB_CONFIGS as { id, icon, label }}
    <button
      type="button"
      class="item {id === activeTab ? 'active' : ''}"
      data-tab={id}
      title={label}
      onclick={() => onTabChange(id)}
    >
      <i class={'fa-solid ' + icon} aria-hidden="true"></i>
      <span>{label}</span>
    </button>
  {/each}
</nav>

<style>
  .sheet-tabs {
    --color-shadow-primary: transparent;
    display: flex;
    gap: 8px;
    border-bottom: 1px solid var(--color-border-light, #999);
    padding-bottom: 2px;
  }

  .sheet-tabs .item {
    position: relative;
    padding: 2px 4px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 11px;
    color: var(--color-text-light-5, #666);
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .sheet-tabs .item i {
    font-size: 17px;
    line-height: 1;
  }

  /* подчёркивание */
  .sheet-tabs .item::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: transparent;
    transition: background 0.15s;
  }

  .sheet-tabs .item.active,
  .sheet-tabs .item:hover {
    color: var(--color-text-light-1, #000);
  }

  .sheet-tabs .item.active::after {
    background: rgba(59, 130, 246, 0.22);
  }
</style>
