<script lang="ts">
  import TreeWithSearch from './TreeWithSearch.svelte';
  import type { ContextMenuArgs, FlatItem } from './types';

  type Variant =
    | 'search'
    | 'fontIcons'
    | 'imageIcons'
    | 'editDelete'
    | 'contextMenu'
    | 'inventoryLike'
    | 'deepNesting';

  interface Props {
    variant?: Variant;
  }

  let { variant = 'search' }: Props = $props();

  const gemSvg =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c9a0f5"/><stop offset="100%" stop-color="#5a2d8a"/></linearGradient></defs><polygon points="16,2 28,12 22,30 10,30 4,12" fill="url(#g)" stroke="#b57aef" stroke-width="1.5"/></svg>',
    );

  const bladeSvg =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8e4f0"/><stop offset="100%" stop-color="#6e6488"/></linearGradient></defs><rect x="14" y="2" width="4" height="22" rx="1" fill="url(#b)"/><rect x="10" y="24" width="12" height="3" rx="1" fill="#c4922a"/><rect x="13" y="27" width="6" height="3" rx="1" fill="#8a6418"/></svg>',
    );

  const potionSvg =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12 4h8v4l4 6v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V14l4-6V4z" fill="#2a9b8f" stroke="#4ec4b6" stroke-width="1.2"/><rect x="12" y="2" width="8" height="3" rx="1" fill="#c4922a"/></svg>',
    );

  const fontIconItems: FlatItem[] = [
    {
      id: 'amethyst',
      label: 'Amethyst',
      path: ['Gems', 'Amethyst'],
      icon: 'fas fa-gem',
      badge: { color: '#8b4fc9', label: 'Rare' },
      categoryIcons: ['fas fa-gem'],
    },
    {
      id: 'quartz',
      label: 'Quartz',
      path: ['Gems', 'Quartz'],
      icon: 'fas fa-gem',
      categoryIcons: ['fas fa-gem'],
    },
    {
      id: 'blade',
      label: 'Crystal Blade',
      path: ['Weapons', 'Crystal Blade'],
      icon: 'fas fa-shield-halved',
      badge: { color: '#c4922a', label: 'Legendary' },
      categoryIcons: ['fas fa-shield-halved'],
    },
  ];

  const imageIconItems: FlatItem[] = [
    {
      id: 'amethyst-img',
      label: 'Amethyst',
      path: ['Gems', 'Amethyst'],
      icon: gemSvg,
      badge: { color: '#8b4fc9', label: 'Rare' },
    },
    {
      id: 'quartz-img',
      label: 'Quartz',
      path: ['Gems', 'Quartz'],
      icon: gemSvg,
    },
    {
      id: 'blade-img',
      label: 'Crystal Blade',
      path: ['Weapons', 'Crystal Blade'],
      icon: bladeSvg,
    },
    {
      id: 'elixir-img',
      label: 'Void Elixir',
      path: ['Consumables', 'Void Elixir'],
      icon: potionSvg,
      badge: { color: '#2a9b8f', label: 'Uncommon' },
    },
  ];

  const actionItems: FlatItem[] = [
    {
      id: 'scroll',
      label: 'Ward Scroll',
      path: ['Consumables', 'Scrolls', 'Ward Scroll'],
      icon: 'fas fa-scroll',
      badge: { color: '#4ec4b6', label: 'Common' },
    },
    {
      id: 'bomb',
      label: 'Flash Bomb',
      path: ['Consumables', 'Bombs', 'Flash Bomb'],
      icon: 'fas fa-bomb',
      deleteDisabled: true,
      deleteDisabledTitle: 'Bound to character',
    },
    {
      id: 'ring',
      label: 'Ring of Echoes',
      path: ['Equipment', 'Ring of Echoes'],
      icon: 'fas fa-ring',
      badge: { color: '#e0b44a', label: 'Rare' },
    },
  ];

  /** 4 levels + mixed icons (some leaves/categories without) to stress alignment. */
  const deepNestingItems: FlatItem[] = [
    {
      id: 'ward-scroll',
      label: 'Ward Scroll',
      path: ['Inventory', 'Consumables', 'Scrolls', 'Ward Scroll'],
      icon: 'fas fa-scroll',
      badge: { color: '#4ec4b6', label: 'Common' },
      categoryIcons: ['fas fa-box', 'fas fa-flask', 'fas fa-scroll'],
    },
    {
      id: 'fire-scroll',
      label: 'Fire Scroll',
      path: ['Inventory', 'Consumables', 'Scrolls', 'Fire Scroll'],
      icon: 'fas fa-scroll',
      categoryIcons: ['fas fa-box', 'fas fa-flask', 'fas fa-scroll'],
    },
    {
      id: 'flash-bomb',
      label: 'Flash Bomb',
      path: ['Inventory', 'Consumables', 'Bombs', 'Flash Bomb'],
      icon: 'fas fa-bomb',
      categoryIcons: ['fas fa-box', 'fas fa-flask'],
    },
    {
      id: 'plain-note',
      label: 'Plain Note',
      path: ['Inventory', 'Consumables', 'Notes', 'Plain Note'],
      // no leaf icon — icon slot must still reserve space
      categoryIcons: ['fas fa-box', 'fas fa-flask'],
    },
    {
      id: 'crystal-blade',
      label: 'Crystal Blade',
      path: ['Inventory', 'Weapons', 'Melee', 'Blades', 'Crystal Blade'],
      icon: 'fas fa-shield-halved',
      badge: { color: '#c4922a', label: 'Legendary' },
      categoryIcons: ['fas fa-box', 'fas fa-shield-halved', 'fas fa-hand-fist'],
    },
    {
      id: 'echo-ring',
      label: 'Ring of Echoes',
      path: ['Inventory', 'Equipment', 'Ring of Echoes'],
      icon: 'fas fa-ring',
      badge: { color: '#e0b44a', label: 'Rare' },
      // Equipment category intentionally without icon
      categoryIcons: ['fas fa-box'],
    },
  ];

  const deepExpandedIds = new Set([
    'Inventory',
    'Inventory/Consumables',
    'Inventory/Consumables/Scrolls',
    'Inventory/Consumables/Bombs',
    'Inventory/Consumables/Notes',
    'Inventory/Weapons',
    'Inventory/Weapons/Melee',
    'Inventory/Weapons/Melee/Blades',
    'Inventory/Equipment',
  ]);

  const initialExpandedIds = new Set([
    'Gems',
    'Weapons',
    'Consumables',
    'Consumables/Scrolls',
    'Consumables/Bombs',
    'Equipment',
  ]);

  const items = $derived.by((): FlatItem[] => {
    switch (variant) {
      case 'imageIcons':
        return imageIconItems;
      case 'editDelete':
      case 'contextMenu':
        return actionItems;
      case 'inventoryLike':
        return [...fontIconItems, ...actionItems];
      case 'deepNesting':
        return deepNestingItems;
      default:
        return fontIconItems;
    }
  });

  const expandedIds = $derived(variant === 'deepNesting' ? deepExpandedIds : initialExpandedIds);

  const hint = $derived.by(() => {
    switch (variant) {
      case 'fontIcons':
        return 'Font Awesome icons on leaves + categories';
      case 'imageIcons':
        return 'Image / SVG icons (Foundry item art path)';
      case 'editDelete':
        return 'Edit + delete on the right (one delete disabled)';
      case 'contextMenu':
        return 'Burger menu + delete on leaves';
      case 'inventoryLike':
        return 'Icons + badges + context menu — closest to inventory';
      case 'deepNesting':
        return '4–5 levels; some rows without icons — labels must stay aligned';
      default:
        return '';
    }
  });

  const showEditDelete = $derived(variant === 'editDelete' || variant === 'inventoryLike');
  const showContextMenu = $derived(variant === 'contextMenu' || variant === 'inventoryLike');
</script>

{#snippet leafContextMenu({ node, close }: ContextMenuArgs)}
  <div class="story-tree-menu">
    <button
      type="button"
      class="story-tree-menu__item"
      onclick={() => {
        console.log('edit', node.id);
        close();
      }}
    >
      <i class="fas fa-edit fa-fw"></i>
      <span>Edit</span>
    </button>
    <button
      type="button"
      class="story-tree-menu__item"
      onclick={() => {
        console.log('duplicate', node.id);
        close();
      }}
    >
      <i class="fas fa-copy fa-fw"></i>
      <span>Duplicate</span>
    </button>
    <button
      type="button"
      class="story-tree-menu__item story-tree-menu__item--danger"
      onclick={() => {
        console.log('delete', node.id);
        close();
      }}
    >
      <i class="fas fa-trash fa-fw"></i>
      <span>Delete</span>
    </button>
  </div>
{/snippet}

<div class="story-tree-frame" class:story-tree-frame--deep={variant === 'deepNesting'}>
  {#if hint}
    <p class="story-tree-hint">{hint}</p>
  {/if}
  <TreeWithSearch
    {items}
    initialExpandedIds={expandedIds}
    searchPlaceholder="Search…"
    onEdit={showEditDelete ? (node) => console.log('edit', node.id) : undefined}
    onDelete={
      showEditDelete || showContextMenu ? (node) => console.log('delete', node.id) : undefined
    }
    contextMenu={showContextMenu ? leafContextMenu : undefined}
  />
</div>

<style>
  .story-tree-frame {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 22rem;
    height: 28rem;
  }

  .story-tree-frame--deep {
    width: 26rem;
    height: 34rem;
  }

  .story-tree-frame :global(.tree-actions) {
    opacity: 1;
  }

  .story-tree-hint {
    margin: 0;
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 12px;
    line-height: 1.35;
  }

  .story-tree-menu {
    display: flex;
    flex-direction: column;
    min-width: 10rem;
    padding: 0.15rem 0;
  }

  .story-tree-menu__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 0;
    background: transparent;
    color: var(--shw-color-text, #e8e4f0);
    font-family: var(--shw-font, inherit);
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }

  .story-tree-menu__item:hover,
  .story-tree-menu__item:focus-visible {
    background: rgb(139 79 201 / 22%);
    outline: none;
  }

  .story-tree-menu__item--danger {
    color: #f07178;
  }

  .story-tree-menu__item--danger:hover,
  .story-tree-menu__item--danger:focus-visible {
    background: rgb(220 38 38 / 18%);
  }
</style>
