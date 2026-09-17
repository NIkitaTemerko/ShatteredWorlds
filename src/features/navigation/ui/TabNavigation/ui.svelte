<script lang="ts">
  import { Tabs } from 'bits-ui';
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
    light: string;
    dark: string;
    hover: string;
  }

  const TAB_COLORS: Record<CharacterTab, TabColors> = {
    stats: { icon: '#198754', light: '#d1f7e4', dark: '#198754', hover: '#4db083' },
    inventory: { icon: '#fd7e14', light: '#ffe5cc', dark: '#fd7e14', hover: '#ff9a4d' },
    equipment: { icon: '#6c757d', light: '#dee2e6', dark: '#6c757d', hover: '#a5acb2' },
    spells: { icon: '#6f42c1', light: '#e8d9f5', dark: '#6f42c1', hover: '#9966cc' },
    abilities: { icon: '#dc3545', light: '#f8d7da', dark: '#dc3545', hover: '#e15361' },
    consumable: { icon: '#f08c00', light: '#ffd580', dark: '#f08c00', hover: '#ffae40' },
  };
</script>

<Tabs.Root
  value={activeTab}
  onValueChange={(value) => onTabChange(value as CharacterTab)}
  class="shw-sheet-tabs-root"
>
  <Tabs.List class="shw-sheet-tabs" data-group="main">
    {#each TAB_CONFIGS as { id, icon, label } (id)}
      <Tabs.Trigger
        value={id}
        class="shw-sheet-tab"
        style="--icon:{TAB_COLORS[id].icon}; --light:{TAB_COLORS[id].light}; --dark:{TAB_COLORS[id]
          .dark}; --hover:{TAB_COLORS[id].hover};"
        data-tab={id}
        title={label}
      >
        <i class={"fa-solid " + icon} aria-hidden="true"></i>
        <span>{t(label)}</span>
      </Tabs.Trigger>
    {/each}
  </Tabs.List>
</Tabs.Root>

<style>
  :global(.shw-sheet-tabs-root) {
    width: 100%;
  }

  :global(.shw-sheet-tabs) {
    --color-shadow-primary: transparent;
    display: flex;
    gap: 0;
    padding: 0 0 4px;
    background: var(--color-border-light-3);
    border: none;
  }

  :global(.shw-sheet-tab) {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin: 0;
    padding: 8px;
    border: none;
    border-radius: 0;
    background: var(--light);
    color: #000;
    font-size: 10px;
    font-weight: bold;
    line-height: 1;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  :global(.shw-sheet-tab i) {
    font-size: 16px;
    line-height: 1;
    color: var(--icon);
  }

  :global(.shw-sheet-tab:hover) {
    background: var(--hover);
  }

  :global(.shw-sheet-tab[data-state='active']) {
    background: var(--dark);
    color: #fff;
  }

  :global(.shw-sheet-tab[data-state='active'] i) {
    color: #fff;
  }
</style>
