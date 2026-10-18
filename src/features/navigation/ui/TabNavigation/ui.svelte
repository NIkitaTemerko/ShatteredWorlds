<script lang="ts">
  import type { CharacterTab } from '../../../../entities/character/model';
  import { TAB_CONFIGS } from '../../../../entities/character/model';
  import { t } from '../../../../shared/i18n';

  interface Props {
    activeTab: CharacterTab;
    onTabChange: (tab: CharacterTab) => void;
  }

  const { activeTab, onTabChange }: Props = $props();

  interface TabColors {
    icon: string;
    fill: string;
    accent: string;
    hover: string;
  }

  /** Crystal accents — shared glass fill, unique icon/active rim */
  const TAB_COLORS: Record<CharacterTab, TabColors> = {
    stats: {
      icon: '#4ec4b6',
      fill: 'rgb(28 24 40 / 85%)',
      accent: '#2a9b8f',
      hover: 'rgb(42 155 143 / 22%)',
    },
    inventory: {
      icon: '#e0b44a',
      fill: 'rgb(28 24 40 / 85%)',
      accent: '#c4922a',
      hover: 'rgb(196 146 42 / 22%)',
    },
    equipment: {
      icon: '#e8e4f0',
      fill: 'rgb(28 24 40 / 85%)',
      accent: '#8b4fc9',
      hover: 'rgb(139 79 201 / 22%)',
    },
    spells: {
      icon: '#d4a8ff',
      fill: 'rgb(28 24 40 / 85%)',
      accent: '#8b4fc9',
      hover: 'rgb(139 79 201 / 28%)',
    },
    abilities: {
      icon: '#f07178',
      fill: 'rgb(28 24 40 / 85%)',
      accent: '#d4555c',
      hover: 'rgb(240 113 120 / 22%)',
    },
    consumable: {
      icon: '#e0b44a',
      fill: 'rgb(28 24 40 / 85%)',
      accent: '#c4922a',
      hover: 'rgb(196 146 42 / 22%)',
    },
  };
</script>

<div class="shw-sheet-tabs" data-group="main" role="tablist">
  {#each TAB_CONFIGS as { id, icon, label } (id)}
    <button
      type="button"
      role="tab"
      class="shw-sheet-tab"
      class:is-active={activeTab === id}
      style="--icon:{TAB_COLORS[id].icon}; --fill:{TAB_COLORS[id].fill}; --accent:{TAB_COLORS[id]
        .accent}; --hover:{TAB_COLORS[id].hover};"
      data-tab={id}
      data-state={activeTab === id ? 'active' : 'inactive'}
      aria-selected={activeTab === id}
      title={label}
      onclick={() => onTabChange(id)}
    >
      <i class={"fa-solid " + icon} aria-hidden="true"></i>
      <span>{t(label)}</span>
    </button>
  {/each}
</div>

<style>
  .shw-sheet-tabs {
    display: flex;
    gap: 1px;
    width: 100%;
    padding: 0;
    background: var(--shw-color-border, #4a425c);
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    box-shadow: var(--shw-shadow-panel);
  }

  .shw-sheet-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    margin: 0;
    padding: 0.65rem 0.35rem;
    border: none;
    border-radius: 0;
    background: var(--fill);
    color: var(--shw-color-text-muted, #9a93ad);
    font-family: var(--shw-font, inherit);
    font-size: 11px;
    font-weight: 700;
    line-height: 1.1;
    cursor: pointer;
    transition:
      background 0.12s ease,
      color 0.12s ease,
      box-shadow 0.12s ease;
  }

  .shw-sheet-tab i {
    font-size: 16px;
    line-height: 1;
    color: var(--icon);
  }

  .shw-sheet-tab:hover {
    background: var(--hover);
    color: var(--shw-color-text, #e8e4f0);
  }

  .shw-sheet-tab.is-active,
  .shw-sheet-tab[data-state='active'] {
    background: var(--shw-glass-fill-strong, rgb(90 50 140 / 42%));
    color: var(--shw-color-text, #e8e4f0);
    box-shadow: inset 0 -2px 0 var(--accent);
  }

  .shw-sheet-tab.is-active i,
  .shw-sheet-tab[data-state='active'] i {
    color: var(--icon);
  }
</style>
