<script lang="ts">
  import type { CharacterTab, TabConfig } from '../../../../entities/character/model';
  import { TAB_CONFIGS } from '../../../../entities/character/model';

  interface Props {
    activeTab: CharacterTab;
    onTabChange: (tab: CharacterTab) => void;
  }

  const { activeTab, onTabChange }: Props = $props();

  interface TabColors {
    icon: string;
    light: string;
    dark: string;
    hover: string;
  }

  const TAB_COLORS: Record<CharacterTab, TabColors> = {
    stats: { icon: '#198754', light: '#d1f7e4', dark: '#198754', hover: '#4db083' },
    inventory: { icon: '#fd7e14', light: '#ffe5cc', dark: '#fd7e14', hover: '#ff9a4d' },
    equipment: { icon: '#6c757d', light: '#dee2e6', dark: '#6c757d', hover: '#a5acb2' },
    spells: { icon: '#6f42c1', light: '#e8d9f5', dark: '#6f42c1', hover: '#9966cc' },
    passives: { icon: '#0d6efd', light: '#cfe2ff', dark: '#0d6efd', hover: '#4d8fff' },
    abilities: { icon: '#dc3545', light: '#f8d7da', dark: '#dc3545', hover: '#e15361' },
    consumable: { icon: '#f08c00', light: '#ffd580', dark: '#f08c00', hover: '#ffae40' },
  };
</script>

<nav class="sheet-tabs" data-group="main">
  {#each TAB_CONFIGS as { id, icon, label }}
    <button
      type="button"
      class="item {id === activeTab ? 'active' : ''}"
      style="--icon:{TAB_COLORS[id].icon}; --light:{TAB_COLORS[id].light}; --dark:{TAB_COLORS[id].dark}; --hover:{TAB_COLORS[id].hover};"
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
    gap: 0;
    padding: 0;
    background: var(--color-border-light-3);
    border: none;
    padding: 3px 0;
  }

  .sheet-tabs .item {
    flex: 1;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    line-height: 1;
    font-weight: bold;
    color: #000;
    background: var(--light);
    border: none;
    border-radius: 0;
    cursor: pointer;
    transition: background 0.2s ease;
    margin: 0;
  }

  .sheet-tabs .item i {
    font-size: 16px;
    line-height: 1;
    color: var(--icon);
  }

  .sheet-tabs .item:hover {
    background: var(--hover);
  }

  .sheet-tabs .item.active {
    background: var(--dark);
    color: #fff;
  }

  .sheet-tabs .item.active i {
    color: #fff;
  }
</style>
