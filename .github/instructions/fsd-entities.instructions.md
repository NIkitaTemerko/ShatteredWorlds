---
applyTo: "src/entities/**,src/features/**"
---

# Domain Entities & Features

## Shared Tree System

A generic tree UI (`src/shared/ui/tree/`) is reused across inventory, abilities, spells, and shop.

### Core Types

```typescript
interface TreeBadge { color: string; label: string; }

interface FlatItem {
  id: string; label: string; path: string[];
  color?: string; icon?: string; categoryIcons?: string[];
  badge?: TreeBadge; data?: unknown;
}

interface TreeNode {
  id: string; label: string; color?: string; icon?: string;
  badge?: TreeBadge; children?: TreeNode[];
  data?: unknown; isLeaf?: boolean;
}
```

### Components Chain

`TreeWithSearch` → `Tree` → `TreeNodeView`
- `TreeWithSearch` — adds search input + `filterTree()` above the tree
- `Tree` — renders root nodes, passes callbacks down
- `TreeNodeView` — renders a single node with expand/collapse, badge indicator, drag-and-drop, popup menu
- `buildTreeFromFlatList()` — converts `FlatItem[]` → `TreeNode[]` using hierarchical `path`

### Badge Pattern (FSD-compliant)

Instead of TreeNodeView reading domain data (`node.data.system.rarity`), nodes carry a generic `badge?: TreeBadge`. Entity mappers fill the badge with domain-specific meaning:

```typescript
// entities/inventory/model/mappers.ts — sets badge from rarity
badge: { color: rarityColors[rarity], label: rarity }
```

### Menu Delegation Pattern

TreeNodeView accepts `getMenuItems?: (node: TreeNode) => PopupMenuItem[]` callback prop, which is passed down through the component chain. The entity/feature layer provides the menu items, keeping TreeNodeView generic.

### Tree State Management

Each entity maintains in-memory state per actor ID (`expandedIds`, `selectedId`, `searchQuery`) — survives scrolling/resizing, resets on page refresh:

```typescript
// Pattern used by ability, spell, inventory trees
const treeStates = new Map<string, TreeState>();
export function getTreeState(actorId: string): TreeState
export function updateTreeState(actorId: string, updates: Partial<TreeState>)
export function clearTreeState(actorId: string)
```

Three independent implementations exist:
- `src/entities/ability/model/abilityTreeState.ts`
- `src/entities/spell/model/spellTreeState.ts`
- `src/entities/inventory/model/inventoryTreeState.ts`

**Usage in components:**
```typescript
let treeState = $state(getAbilityTreeState(actor.id));

function handleSearch(query: string) {
  updateAbilityTreeState(actor.id, { searchQuery: query });
  treeState = getAbilityTreeState(actor.id);
}
```

## PopupMenu System

A generic popup menu (`src/shared/ui/PopupMenu/`) used for tree node context menus.

### Architecture

- **Action portal pattern:** Component lives in Svelte tree (full reactivity) but DOM is teleported to `document.body` via `use:portal` action for correct z-index stacking
- **Singleton:** Only one popup open at a time — `closeActivePopup()` closes previous before opening new
- **Positioned:** Uses `anchorEl.getBoundingClientRect()` for placement below the trigger button

### Menu Item Types

```typescript
type PopupMenuItem = MenuActionItem | MenuQuantityItem;
// Action: { type: 'action', label, icon?, danger?, onClick }
// Quantity: { type: 'quantity', label, value, min, max, onChange }
```

**MenuQuantity specifics:**
- Uses local `$state` for instant UI feedback, clamps to `[min, max]`
- Forces DOM sync on external value changes (Foundry hooks update quantity)
- Calls `onChange` which triggers Foundry item update

**Usage in InventoryTree:** Menu items are built per-node using live Foundry data (quantity, stackLimit). The `getMenuItems` callback reads fresh data from `item.parent.items.get(id)` to stay in sync.

## Type-Safe Internationalization

The i18n system (`src/shared/i18n/`) provides compile-time key validation:

```typescript
// Recursive type extracts all dot-notation paths from lang JSON
type I18nKey = PathsToStringProps<typeof translations['SHW']>;
// e.g.: 'attributes.natural' | 'tabs.stats' | 'inventory.categories.consumable'

export function t(key: I18nKey): string        // Simple lookup
export function localize(key: I18nKey, data?): string  // With template substitution
```

All translation keys get full TypeScript autocomplete from `lang/en.json` structure.
