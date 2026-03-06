# Shattered Worlds - AI Coding Agent Instructions

## Project Overview

This is a **Foundry VTT game system** for "Shattered Worlds" - a techno-fantasy RPG with roguelike elements. The system uses a modern stack with **Svelte 5**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

## FSD Architecture (Feature-Sliced Design)

The project follows an **adapted FSD methodology** — a strict layered architecture where each layer has defined responsibilities and import rules.

### Layers (bottom → top)

| Layer | Path | Responsibility | Can import from |
|---|---|---|---|
| **shared** | `src/shared/` | Reusable UI, utilities, types, constants. No business logic. | Only itself |
| **entities** | `src/entities/` | Domain models + entity-specific UI (character, ability, spell, inventory, consumable) | `shared` |
| **features** | `src/features/` | Cross-cutting user-facing functionality (navigation, roll, activation, uses, itemImport) | `shared`, `entities` |
| **modules** | `src/modules/` | Standalone application windows (shop manager) | `shared`, `entities`, `features` |
| **view** | `src/view/` | Foundry sheet adapters — wire entities + features into Foundry application windows | All layers above |

Two additional non-FSD layers exist alongside:
- **documents** (`src/documents/`) — Foundry document classes (`ShwActor`, `ShwItem`, `ShwTokenDocument`). Used by all layers as data source.
- **helpers** (`src/helpers/`) — Pure data preparation functions (`prepareBaseData`, `prepareDerivedData`, `StackManager`). Used by `documents` and `view`.

### Import Direction Rule

**Imports go strictly downward.** A lower layer NEVER imports from a higher layer:

```
shared ← entities ← features ← modules ← view
                                              ↑
                                     documents + helpers (used by all)
```

❌ **Violation:** `shared/ui/tree/TreeNodeView.svelte` importing from `entities/inventory/`
✅ **Correct:** `entities/inventory/ui/InventoryTree.svelte` importing from `shared/ui/tree/`

### Slice Structure

Each slice (entity, feature, module) follows the `model/` + `ui/` convention:

```
entities/ability/
  index.ts           # Barrel: public API of the slice
  model/             # Types, constants, state, mappers, business logic
    index.ts         # Barrel: re-exports model pieces
    types.ts
    constants.ts
    mappers.ts
    abilityTreeState.ts
  ui/                # Svelte components specific to this entity
    index.ts         # Barrel: re-exports components
    AbilityTree.svelte
```

### Barrel Export Conventions

- **Standard:** `export * from './model'; export * from './ui'` (ability, character, spell, consumable)
- **Selective API:** Only expose what consumers need (inventory exports only mappers + InventoryTree, not internal state)
- **Encapsulated modules:** Only expose the Application class (shop exports only `ShopManagerApp`)

### Key FSD Principle: Domain Knowledge in the Right Layer

Generic components in `shared/` must NOT contain domain-specific logic:

❌ **Wrong:** TreeNodeView has `rarityColors` map and reads `node.data.system.rarity`
✅ **Right:** TreeNode has generic `badge?: TreeBadge` field, populated by entity mapper in `entities/inventory/model/mappers.ts`

The rule: **shared knows shapes, entities fill them with domain meaning.**

## Architecture: Hybrid Handlebars + Svelte

The system uses a **two-layer rendering approach**:

1. **Handlebars templates** (`templates/`) render minimal outer `<form>` shells (typically just `<section class="svelte-sheet-body"></section>`)
2. **Svelte 5 components** mount into `.svelte-sheet-body` containers for all reactive UI

### Key Pattern: SvelteActorSheet

All actor/item sheets extend `SvelteActorSheet` (or `SveltItemSheet`):

```typescript
// src/view/BaseCharacter/CharacterApp.ts
export class CharacterApp extends SvelteActorSheet {
  static Shell = ReactiveActorWrapper; // Svelte 5 component
  get template() {
    return 'systems/shattered-worlds/templates/actor/ShwCharacterSheet.hbs';
  }
}
```

**Rendering Flow:**
1. Handlebars template renders minimal shell: `<form><section class="svelte-sheet-body"></section></form>`
2. `SvelteActorSheet._renderSvelte()` mounts Svelte component into `.svelte-sheet-body`
3. Component receives `getActor` function prop for reactivity
4. `ReactiveDocumentWrapper` subscribes to Foundry hooks for auto-updates

**Key Implementation Details:**
- `mountSvelte()` helper wraps Svelte 5's `mount()`/`unmount()` API
- Base class tracks `_mountedActorId` to prevent unnecessary remounts
- `close()` method properly unmounts Svelte to prevent memory leaks
- Actor changes trigger remount, but render calls without changes just bring sheet to top

## Document Model Architecture

### Actor Types: `character` | `npc`

Both use `ShwActor<K>` with type-safe system data:

```typescript
// src/documents/Actor/ShwActor.ts
export class ShwActor<K extends 'character' | 'npc'> extends Actor {
  declare system: SystemByKind[K];
  
  prepareBaseData() {
    if (this.isCharacter()) prepareCharacterBaseData(this.system);
    else if (this.isNpc()) prepareNpcBaseData(this.system);
  }
}
```

**Data preparation flow:**
1. `prepareBaseData()` - Initialize defaults, ensure all fields exist
2. `prepareDerivedData()` - Calculate bonuses, totals (e.g., `totalHealth`, attribute bonuses)

### Item Types: `consumable` | `ability` | `spell`

Items use factory pattern (`ItemFactory.createConsumable()`, `ItemFactory.createAbility()`) with discriminated unions:

```typescript
// src/documents/Item/types/ConsumableDataTypes.ts
type ConsumableData = BombData | PotionData | ScrollData | PoisonData | FoodData;
// src/documents/Item/types/AbilityDataTypes.ts
type AbilityData = ActiveAbilityData | PassiveAbilityData;
// src/documents/Item/types/SpellDataTypes.ts
type SpellCategory = 'code' | 'elemental' | 'dark' | 'holy' | 'arcane';
type SpellKind = 'attack' | 'heal' | 'support' | 'debuff' | 'control' | 'movement' | 'summon' | 'utility';
```

**Consumable types** have specific fields (e.g., `bomb.damage.amount`, `potion.effects[]`)
**Ability types** distinguish between `active` (with cooldowns, costs) and `passive` (always-on effects)
**Spell types** have `spellKind`, `category`, `actionType`, `castTime`, `range`, `targeting`, `effects[]`, `savingThrow[]`, `rank`, cooldowns, and resource costs

## Development Workflow

### Build & Dev Server

```bash
pnpm dev          # Vite dev server on :30001, proxies to Foundry on :30000
pnpm build        # Production build to dist/
pnpm watch        # Build + watch mode
```

**Critical:** Vite config proxies requests to Foundry server. Dev workflow requires:
1. Foundry running on `localhost:30000`
2. Vite dev server on `localhost:30001`
3. System loaded in Foundry pointing to dev server

**Vite proxy details (`vite.config.ts`):**
- Static assets (lang, assets, packs, CSS) proxied from Foundry `:30000`
- Module JS requests rewritten: `shattered-worlds.js` → `index.js`
- Socket.io WebSocket proxied for real-time Foundry updates
- Dev server base path: `/systems/shattered-worlds/dist`

### Version Bumping

```bash
pnpm bump:patch   # Updates package.json, system.json, README.md
pnpm bump:minor
pnpm bump:major
```

Scripts sync version across files and update download URL in `system.json`.

### Packaging

```bash
pnpm pack         # Builds + creates shattered-worlds.zip for distribution
```

## Code Conventions

### Language Rules

- **Code comments and docstrings:** Russian (Cyrillic)
- **Variable/function names:** English
- **Commit messages:** English (see branch/commit instruction files)
- **Branch names:** English (see branch/commit instruction files)

### Biome Formatting

- **Line width:** 100 chars
- **Quotes:** Single quotes for JS/TS
- **Indentation:** 2 spaces
- **Import types:** Use `import type` for type-only imports (enforced)
- **Svelte overrides:** `useConst`, `useImportType`, `noUnusedVariables`, and `noUnusedImports` rules disabled for `*.svelte` files

### Svelte 5 Patterns

**CRITICAL:** Always use Svelte 5 runes syntax, NOT Svelte 4 patterns. This project uses Svelte 5.

#### State Management: Use Runes, Not Stores

❌ **Svelte 4 (Don't use):**
```svelte
<script>
  import { writable } from 'svelte/store';
  const count = writable(0);
</script>
<button on:click={() => $count++}>{$count}</button>
```

✅ **Svelte 5 (Use this):**
```svelte
<script>
  let count = $state(0);
</script>
<button onclick={() => count++}>{count}</button>
```

#### Component Props

❌ **Svelte 4 (Don't use):**
```svelte
<script>
  export let actor;
  export let isEditable = true;
</script>
```

✅ **Svelte 5 (Use this):**
```svelte
<script>
  interface Props { 
    actor: ShwActor<'character'>; 
    isEditable?: boolean;
  }
  let { actor, isEditable = true }: Props = $props();
</script>
```

#### Reactive Computations

❌ **Svelte 4 (Don't use):**
```svelte
<script>
  export let value;
  $: doubled = value * 2;
  $: {
    console.log('Value changed:', value);
  }
</script>
```

✅ **Svelte 5 (Use this):**
```svelte
<script>
  let { value }: Props = $props();
  let doubled = $derived(value * 2);
  $effect(() => {
    console.log('Value changed:', value);
  });
</script>
```

#### Event Handlers

❌ **Svelte 4 (Don't use):**
```svelte
<button on:click={handleClick}>Click</button>
<input on:change={handleChange} />
```

✅ **Svelte 5 (Use this):**
```svelte
<button onclick={handleClick}>Click</button>
<input onchange={handleChange} />
```

For custom events, use callback props:
```svelte
<!-- Parent -->
<TabNavigation {activeTab} onTabChange={handleTabChange} />

<!-- Child -->
interface Props { onTabChange: (tab: CharacterTab) => void; }
let { onTabChange }: Props = $props();
```

#### Key Runes Reference

- `$state(value)` - Reactive state variable
- `$state<T>(value)` - Typed reactive state
- `$derived(expression)` - Computed value (like Svelte 4's `$:`)
- `$effect(() => {})` - Side effects (like Svelte 4's `$: {}` blocks)
- `$props()` - Component props (replaces `export let`)

**Note:** Legacy stores still exist in `*/store/` directories - migrate to runes when refactoring

### File Organization

```
src/
  documents/              # [NON-FSD] Foundry document classes
    Actor/ShwActor.ts     # ShwActor<K> with type guards + prepare hooks
    Actor/types/          # ShwActorSystem type definitions
    Item/ShwItem.ts       # ShwItem with sync hooks
    Item/ItemFactory.ts   # Factory for creating typed items
    Item/types/           # ConsumableDataTypes, AbilityDataTypes, SpellDataTypes, ItemDataInterface
    ShwTokenDocument.ts   # Token auto-link logic

  helpers/                # [NON-FSD] Pure data preparation functions
    Character/            # prepareCharacterBaseData, prepareDerivedData, characterRoll, calculateItemBonuses
    Item/                 # StackManager (stacking + dedup), migrateConsumableData
    Npc/                  # prepareNpcBaseData, prepareNpcDerivedData
    constants.ts          # Global constants

  sheets/                 # [NON-FSD] Base Foundry sheet adapters
    Actor/SvelteActorSheet.ts   # Svelte mount/unmount lifecycle for actor sheets
    Item/SveltItemSheet.ts      # Svelte mount/unmount lifecycle for item sheets

  shared/                 # [FSD: shared] Reusable, no business logic
    data/foundryIcons.json  # Static icon catalog for item import
    i18n/index.ts           # Type-safe t() and localize() with I18nKey autocomplete
    lib/cn.ts               # clsx + tailwind-merge utility
    model/                  # Shared types and constants
      types/attributes.ts   # AttributeKey, AdditionalAttributes (derived from actor schema)
      constants/attributes.ts # ADDITIONAL_ATTRIBUTE_LABELS with i18n keys
      characterStatPaths.ts # Stat path mappings for roll system
    ui/                     # Reusable Svelte components
      ActionIcon/           # Icon button with variants (ghost, filled)
      BonusCharacteristics/ # Bonus display widget
      Input/                # Styled text input
      SelectInput/          # Styled select dropdown
      ReactiveDocumentWrapper/  # Foundry hook subscriber → Svelte reactivity bridge
      PopupMenu/            # Generic popup menu with action portal pattern
      tree/                 # Generic tree: Tree, TreeWithSearch, TreeNodeView, types, treeUtils

  entities/               # [FSD: entities] Domain models + entity-specific UI
    character/            # Character entity
      model/types.ts      # CharacterTab, RollMode, TAB_CONFIGS, ATTRIBUTE_COLORS
      ui/                 # CharacterHeader, AttributeStats, AdditionalStats, CharacterAbilities,
                          # CharacterInventory, CharacterSpells
    ability/              # Ability entity
      model/              # types, constants, mappers (ability → FlatItem), abilityTreeState
      ui/AbilityTree.svelte
    spell/                # Spell entity
      model/              # types, constants, mappers (spell → FlatItem), spellTreeState
      ui/SpellTree.svelte
    consumable/           # Consumable entity
      model/              # types (ActivationType, PerType, RarityType), constants
      ui/StatsCard/       # Consumable stats display
    inventory/            # Cross-item inventory entity
      model/              # types, mappers (item → FlatItem with badge), inventoryTreeState
      ui/InventoryTree.svelte  # Tree with Foundry hooks, popup menu, drag-and-drop

  features/               # [FSD: features] Cross-cutting user-facing functionality
    navigation/           # Tab navigation component (TabNavigation)
    roll/                 # Roll panel for dice rolls (RollPanel)
    activation/           # Action/bonus/reaction type + cost selector (ActivationControl)
    uses/                 # Charges/uses/turns tracker (UsesControl)
    itemImport/           # Bulk JSON import with Zod validation
      ImportItemsApp.ts   # Foundry Application wrapper
      model/              # parseItems, validateItems, importItems, schemas, schemaPrompt,
                          # errorPrompt, iconsPrompt, iconCategories, types
      ui/ImportItemsDialog.svelte

  modules/                # [FSD: modules] Standalone application windows
    shop/                 # ShopManagerApp: merchant/location tree
      ShopManagerApp.ts   # Foundry Application class
      model/              # types, constants, mappers, storage (localStorage), shopTreeState
      ui/                 # ShopManagerShell, ShopTree, NodeEditorDialog, MerchantItemEditorDialog

  view/                   # [FSD: view] Foundry sheet adapters wiring entities + features
    BaseCharacter/        # CharacterApp → RootCharacterShell (main character sheet)
    NpcCharacter/         # NpcApp → NpcCharacterShell
    ConsumableItem/       # ConsumableItemApp → RootItemShell with type-specific views
    AbilityItem/          # AbilityItemApp → RootItemShell with active/passive views
    SpellItem/            # SpellItemApp → RootItemShell with spell details

templates/                # Handlebars shells (minimal, just mount points for Svelte)
```

**Import pattern example:**
```typescript
// In view/BaseCharacter/ui/RootCharacterShell.svelte (view layer)
import { CharacterHeader, AttributeStats } from '../../../entities/character';  // entities
import { TabNavigation } from '../../../features/navigation';                   // features
import { RollPanel } from '../../../features/roll';                             // features
```

This keeps domain logic (entities) separate from presentation wiring (view) and shared features.

### Shared Tree System

A generic tree UI (`src/shared/ui/tree/`) is reused across inventory, abilities, spells, and shop:

**Core types:**
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

**Components chain:** `TreeWithSearch` → `Tree` → `TreeNodeView`
- `TreeWithSearch` — adds search input + `filterTree()` above the tree
- `Tree` — renders root nodes, passes callbacks down
- `TreeNodeView` — renders a single node with expand/collapse, badge indicator, drag-and-drop, popup menu
- `buildTreeFromFlatList()` — converts `FlatItem[]` → `TreeNode[]` using hierarchical `path`

**Badge pattern (FSD-compliant):** Instead of TreeNodeView reading domain data (`node.data.system.rarity`), nodes carry a generic `badge?: TreeBadge`. Entity mappers fill the badge with domain-specific meaning:
```typescript
// entities/inventory/model/mappers.ts — sets badge from rarity
badge: { color: rarityColors[rarity], label: rarity }
```

**Menu delegation pattern:** TreeNodeView accepts `getMenuItems?: (node: TreeNode) => PopupMenuItem[]` callback prop, which is passed down through the component chain. The entity/feature layer provides the menu items, keeping TreeNodeView generic.

**State per tree:** Each entity maintains in-memory state per actor ID (`expandedIds`, `selectedId`, `searchQuery`) — survives scrolling/resizing, resets on page refresh:
```typescript
// Pattern used by ability, spell, inventory trees
const treeStates = new Map<string, TreeState>();
export function getTreeState(actorId: string): TreeState
export function updateTreeState(actorId: string, updates: Partial<TreeState>)
export function clearTreeState(actorId: string)
```

### PopupMenu System

A generic popup menu (`src/shared/ui/PopupMenu/`) used for tree node context menus:

**Architecture:**
- **Action portal pattern:** Component lives in Svelte tree (full reactivity) but DOM is teleported to `document.body` via `use:portal` action for correct z-index stacking
- **Singleton:** Only one popup open at a time — `closeActivePopup()` closes previous before opening new
- **Positioned:** Uses `anchorEl.getBoundingClientRect()` for placement below the trigger button

**Menu item types:**
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

### Type-Safe Internationalization

The i18n system (`src/shared/i18n/`) provides compile-time key validation:

```typescript
// Recursive type extracts all dot-notation paths from lang JSON
type I18nKey = PathsToStringProps<typeof translations['SHW']>;
// e.g.: 'attributes.natural' | 'tabs.stats' | 'inventory.categories.consumable'

export function t(key: I18nKey): string        // Simple lookup
export function localize(key: I18nKey, data?): string  // With template substitution
```

All translation keys get full TypeScript autocomplete from `lang/en.json` structure.

## Foundry VTT Integration

### System Manifest (`system.json`)

- **ID:** `shattered-worlds`
- **Compatibility:** Foundry v12+
- **Entry point:** `dist/shattered-worlds.js` (built from `src/index.ts`)
- **Hot reload:** Enabled for `lang/*.json` files
- **Download URL:** Auto-updated by `scripts/update-system-version.js` to match package version

### Hooks Usage

```typescript
// src/index.ts - Three-stage initialization
Hooks.once('init', () => {
  CONFIG.Actor.documentClass = ShwActor;
  CONFIG.Item.documentClass = ShwItem;
  CONFIG.Token.documentClass = ShwTokenDocument;
  CONFIG.Combat.initiative = { formula: '1d20 + @initiative', decimals: 0 };
});

Hooks.once('setup', () => {
  foundry.documents.collections.Actors.registerSheet('shw', CharacterApp, {
    types: ['character'], makeDefault: true
  });
  foundry.documents.collections.Actors.registerSheet('shw', NpcApp, {
    types: ['npc'], makeDefault: true
  });
  foundry.documents.collections.Items.registerSheet('shw', ConsumableItemApp, {
    types: ['consumable'], makeDefault: true
  });
  foundry.documents.collections.Items.registerSheet('shw', AbilityItemApp, {
    types: ['ability'], makeDefault: true
  });
  foundry.documents.collections.Items.registerSheet('shw', SpellItemApp, {
    types: ['spell'], makeDefault: true
  });
});

Hooks.on('preCreateToken', (tokenDocument, tokenData) => {
  // Character tokens auto-link to actor (shared token)
  const actor = game.actors.get(tokenData.actorId);
  if (actor?.type === 'character') {
    tokenDocument.updateSource({ actorLink: true });
  }
});

Hooks.on('preCreateItem', (item, data, options) => {
  // Auto-migrate legacy consumable data
  if (needsMigration(data)) {
    const migrated = migrateConsumableData(data);
    item.updateSource({ system: migrated.system });
  }
  
  // Track origin + stack management for items added to actors
  if (item.parent && item.parent instanceof ShwActor) {
    const originItemId = findOriginItem(item, options);
    if (originItemId) {
      item.updateSource({ 'flags.shw.originItemId': originItemId });
    }
    const result = handleAddItem(item.parent, {
      type: item.type, name: item.name, system: item.system
    });
    if (result === 'stacked' || result === 'blocked') return false;
  }
});

// Two-way sync: owned ↔ global items
Hooks.on('updateItem', async (item, changes, options) => {
  if (options?.skipSync) return;
  if (item.parent instanceof ShwActor) {
    // Owned → Global: sync to origin item
    await syncOwnedToGlobal(item, changes);
  } else if (!item.parent) {
    // Global → Owned: propagate to all copies
    await syncGlobalToOwned(item, changes);
  }
});
```

### Data Model (`template.json`)

Minimal schema - actual structure defined in TypeScript types (`src/documents/*/types/`). Only declares actor/item types (`character`, `npc`, `consumable`, `ability`, `spell`), not full data structure.

### Item Synchronization System

Owned items (on actors) maintain a two-way sync with their global source items:

- **Origin tracking:** `flags.shw.originItemId` links owned items to their global source
- **Origin discovery:** By explicit ID → by `baseId` → by name+type (drag-drop fallback)
- **Owned → Global:** Editing an owned item syncs changes to the global source
- **Global → Owned:** Editing a global item propagates to all owned copies across all actors
- **Recursion prevention:** `skipSync` option flag prevents infinite update loops

### Nav Bar Buttons

Two custom buttons are injected into Foundry's nav bar via `Hooks.once('ready')` with DOM manipulation:
- **Shop** (`fa-solid fa-store`) — Opens `ShopManagerApp`
- **Import** (`fa-solid fa-file-import`) — Opens `ImportItemsApp`

## Common Tasks

### Adding a New Actor Type

1. Add type to `template.json` Actor.types
2. Create system type in `src/documents/Actor/types/ShwActorSystem.ts`
3. Add prepare functions in `src/helpers/[Type]/`
4. Update `ShwActor` type guards and prepare methods
5. Create sheet class in `src/view/[Type]/` with Svelte Shell
6. Register sheet in `src/index.ts` setup hook

### Adding a New Consumable Type

1. Define type in `src/documents/Item/types/ConsumableDataTypes.ts`
2. Add factory method in `ItemFactory.createConsumable()`
3. Create Svelte component in `src/view/ConsumableItem/ui/`
4. Add conditional rendering in `RootItemShell.svelte`
5. Update `typeColors` in `consumableConstants.ts`

### Adding a New Spell Category or Kind

1. Add to discriminated union in `src/documents/Item/types/SpellDataTypes.ts`
2. Update category colors in `src/entities/spell/model/`
3. Update `SpellTree.svelte` if tree grouping changes
4. Add localization keys to `lang/en.json` and `lang/ru.json`

### Modifying Attribute Calculations

Edit `src/helpers/Character/prepareCharacterDerivedData.ts`:
- Attribute bonuses: `charBonus = Math.floor(value / 5)`
- Level-gated features: Check `sys.utility.level >= 5`
- Helpers (totals): Update in `updateHelpers()` function

### Updating Item Data Safely

Use the `getUpdateConsumable()` utility pattern to avoid data loss:

```typescript
// src/view/ConsumableItem/utils/updateConsumable.ts
export const getUpdateConsumable = (item: ShwItem) =>
  async function updateConsumable(path: string, value: any, e?: Event) {
    e?.stopPropagation();
    await item.update({
      system: item.system,  // Preserve current data
      [`system.${path}`]: value,  // Update specific path
    });
  };

// Usage in components
import { getUpdateConsumable } from '../utils/updateConsumable';
const updateConsumable = getUpdateConsumable(item);
<input on:change={(e) => updateConsumable('field', e.currentTarget.value)} />
```

**Critical:** This pattern prevents data loss by preserving the entire `system` object while updating specific nested paths. Without this, partial updates can overwrite sibling fields.

### Item Stacking & Duplicate Prevention

The `StackManager.ts` handles automatic stacking of consumables and prevents duplicate abilities:

```typescript
// src/helpers/Item/StackManager.ts - Key functions:

// 1. Identity matching: Uses baseId if available, else type:name
export function getIdentityKey(itemData: ItemDataLike): string {
  if (itemData.system?.baseId) return itemData.system.baseId;
  return `${itemData.type}:${itemData.name?.toLowerCase().trim()}`;
}

// 2. Stack finding: Prioritizes non-full stacks
export function findExistingStack(actor: ShwActor, itemData: ItemDataLike): ShwItem | null

// 3. Auto-increment: Handles overflow by creating new stacks
export function incrementStack(existingItem: ShwItem, incomingData: ItemDataLike): void

// 4. Main handler: Called from preCreateItem hook
export function handleAddItem(actor: ShwActor, itemData: ItemDataLike): 'created' | 'stacked' | 'blocked'
```

**Behavior:**
- **Consumables** (`stackable`): Auto-stack if identity matches, respects `stackLimit`
- **Abilities** (`unique`): Blocks duplicates, shows notification
- **Overflow handling**: When adding to full stack, fills current to limit and creates additional stacks
- **Recursion prevention**: Uses `isCreatingOverflowStacks` flag during overflow stack creation

**Hook integration** (`src/index.ts`):
```typescript
Hooks.on('preCreateItem', (item, data) => {
  if (item.parent && item.parent instanceof ShwActor) {
    const result = handleAddItem(item.parent, {
      type: item.type, name: item.name, system: item.system
    });
    // Return false to prevent creation if item was stacked or blocked
    if (result === 'stacked' || result === 'blocked') return false;
  }
});
```

## Item Import Feature

The `features/itemImport/` slice provides bulk JSON import of items with validation:

**Pipeline:** Parse JSON → Zod validate → dry-run report → import with dedup

**Model files (split by responsibility):**
- `parseItems.ts` — `parseItemCores()`: JSON parsing, path formatting
- `validateItems.ts` — `validateItemCores()`: Zod schema validation, duplicate detection
- `importItems.ts` — `importItemCores()`: Foundry item creation/update via `baseId` matching
- `schemas.ts` — Zod schemas for consumable, ability, spell item structures
- `schemaPrompt.ts` — Generates schema description for AI-assisted item creation
- `errorPrompt.ts` — Formats validation errors for AI correction
- `iconsPrompt.ts` — Generates icon assignment prompt
- `iconCategories.ts` — Icon catalog organized by item type
- `types.ts` — `ItemCore`, `ValidationReport`, `ImportReport`, `ImportResult`

**Key types:**
```typescript
interface ItemCore {
  baseId: string;           // Unique identifier for deduplication
  type: 'consumable' | 'ability' | 'spell';
  name: string;
  img?: string;
  system: Record<string, unknown>;
}

interface ImportReport {
  dryRun: boolean;
  total: number;
  created: number; updated: number; skipped: number;
}
```

**UI:** `ImportItemsDialog.svelte` — single dialog component handling the full import workflow with step-by-step feedback.

## Patterns & Best Practices

### Component Communication

**Props down, callbacks up:**
```typescript
// Parent component
function handleTabChange(tab: CharacterTab) {
  activeTab = tab;
}
<TabNavigation {activeTab} onTabChange={handleTabChange} />

// Child component
interface Props {
  activeTab: CharacterTab;
  onTabChange: (tab: CharacterTab) => void;
}
const { activeTab, onTabChange }: Props = $props();
```

### Type-Safe Actor Updates

Always use type-safe paths with discriminated unions:
```typescript
if (actor.isCharacter()) {
  // TypeScript knows system is ShwActorSystem here
  actor.update({ 'system.health.value': newValue });
}
```

### Conditional Rendering by Type

Use discriminated unions for items:
```svelte
{#if item.system.consumableType === 'bomb'}
  <BombStats {item} />
{:else if item.system.consumableType === 'potion'}
  <PotionsAndFood {item} />
{/if}
```

### CSS Custom Properties for Theming

Components use CSS variables for type-specific colors:
```svelte
<div style="--dark:{colors.dark}; --light:{colors.light}">
  <!-- Component uses var(--dark) and var(--light) in CSS -->
</div>
```

### Tree State Management

Tree UI state (search, expanded nodes, selection) is managed per-actor in memory using `Map<string, TreeState>`. Three independent implementations exist:
- `src/entities/ability/model/abilityTreeState.ts`
- `src/entities/spell/model/spellTreeState.ts`
- `src/entities/inventory/model/inventoryTreeState.ts`

**Pattern:** State persists during session but resets on page refresh. This keeps UI responsive without polluting actor data with transient UI state.

**Usage in components:**
```typescript
let treeState = $state(getAbilityTreeState(actor.id));

function handleSearch(query: string) {
  updateAbilityTreeState(actor.id, { searchQuery: query });
  treeState = getAbilityTreeState(actor.id);
}
```

## Debugging Tips

- **Svelte DevTools:** Install browser extension for Svelte 5
- **Foundry Console:** Access via `game.actors`, `game.items`, `CONFIG`
- **Type errors:** Check `@ts-expect-error` comments for Foundry API mismatches
- **Hot reload:** Only works for lang files; code changes require page refresh in dev mode
- **Vite dev server issues:** Ensure Foundry is running on `:30000` before starting `:30001`
- **Sheet not rendering:** Check browser console for Svelte mount errors in `.svelte-sheet-body`

## Performance Considerations

### Reactive Document Updates

`ReactiveDocumentWrapper` subscribes to Foundry hooks for auto-updates:

```svelte
<!-- src/shared/ui/ReactiveDocumentWrapper/ui.svelte -->
<script>
  let docData = $state({ doc: getDocument(), version: 0 });
  
  function handleUpdate(doc: any) {
    const currentDoc = getDocument();
    // Only update if it's our document or child
    if (doc?.id === currentDoc?.id || doc?.parent?.id === currentDoc?.id) {
      docData = { doc: currentDoc, version: docData.version + 1 };
    }
  }
</script>
```

**Optimization strategies:**
- **Identity checks:** Updates only fire for relevant document changes
- **Version counter:** Forces Svelte reactivity even when object reference doesn't change
- **Hook cleanup:** `onDestroy` properly unregisters hooks to prevent memory leaks

### Sheet Remounting Strategy

`SvelteActorSheet` avoids unnecessary remounts:

```typescript
// Tracks mounted actor ID to detect changes
private _mountedActorId: string | null = null;

// Only remount if actor actually changed
const actorChanged = this._mountedActorId !== null && 
                     this._mountedActorId !== this.actor.id;

if (actorChanged) {
  unmount(this._svelte);
  this._svelte = null;
}
```

**Why it matters:** Remounting Svelte components is expensive. This pattern ensures sheets only remount when switching between different actors, not on every render call.

### Item Stack Operations

Stack updates use async fire-and-forget pattern:

```typescript
// Updates fire asynchronously but function returns immediately
existingItem.update({ 'system.quantity': totalQuantity }).then(() => {
  ui.notifications?.info(`Stack increased`);
});
// Function returns here, doesn't wait for update to complete
```

**Result:** UI remains responsive during bulk item operations. Foundry's document system queues updates automatically.

## External Dependencies

- **Foundry VTT Types:** `@league-of-foundry-developers/foundry-vtt-types` (v13)
- **Svelte 5:** Latest runes API (not Svelte 4 stores)
- **Tailwind v4:** Uses new `@tailwindcss/vite` plugin (not PostCSS)
- **Biome:** Replaces ESLint/Prettier for linting and formatting
- **Zod:** Schema validation (used in item import for JSON validation)
- **clsx + tailwind-merge:** Utility class merging (via `cn()` helper in `src/shared/lib/cn.ts`)

## Localization

- **Files:** `lang/en.json`, `lang/ru.json` (English and Russian)
- **Access in code:** Use type-safe `t()` / `localize()` from `src/shared/i18n/` (see Type-Safe Internationalization section above)
- **Key format:** Nested structure under `SHW` namespace (e.g., `SHW.attributes.natural`, `SHW.tabs.stats`)
- **Hot reload:** Enabled in dev mode for both language files

## Common Pitfalls & Solutions

### 1. **Data Loss on Partial Updates**
❌ **Wrong:** `item.update({ 'system': { name: newName } })`  
✅ **Right:** Use `getUpdateConsumable()` utility pattern or dotted path syntax

Without the pattern, partial updates overwrite entire nested objects. The `getUpdateConsumable` pattern preserves all `system` fields while updating specific paths using `system.${path}` syntax.

### 2. **Svelte 5 vs Svelte 4 Patterns**
❌ **Wrong:** `export let actor;` (Svelte 4)  
✅ **Right:** `let { actor }: Props = $props();` (Svelte 5)

### 3. **Event Handlers in Svelte 5**
❌ **Wrong:** `<button on:click={handler}>` (works but not idiomatic)  
✅ **Right:** `<button onclick={handler}>` (native DOM events in Svelte 5)

For custom events, use callback props:
```svelte
// Parent
<TabNavigation {activeTab} onTabChange={handleTabChange} />

// Child
interface Props { onTabChange: (tab: CharacterTab) => void; }
let { onTabChange }: Props = $props();
```

### 4. **Type Guards for Actor Types**
Always use type guards before accessing type-specific fields:
```typescript
if (actor.isCharacter()) {
  // Safe: actor.system is ShwActorSystem (character)
  const level = actor.system.utility.level;
} else if (actor.isNpc()) {
  // Safe: actor.system is ShwNpcSystem (npc)
  const type = actor.system.npcType;
}
```

### 5. **Foundry Hook Timing**
Respect hook order: `init` → `setup` → `ready`. Register document classes in `init`, sheets in `setup`.

### 6. **Vite Dev Server Requirements**
- Foundry **must** run on `localhost:30000` before starting Vite dev server
- Vite dev server runs on `localhost:30001`
- System in Foundry should point to dev server build path
- Code changes require browser refresh (hot reload only works for `lang/*.json`)

## Testing & Quality

- **No automated tests** currently - manual testing in Foundry required
- **Biome checks:** Run `pnpm lint` before commits
- **Build validation:** Ensure `pnpm build` succeeds without errors
- **Manual testing workflow:**
  1. Start Foundry on `:30000`
  2. Run `pnpm dev` for `:30001` dev server
  3. Create test actors/items in Foundry
  4. Verify sheet rendering and data updates
  5. Check browser console for errors

## Available Scripts

```bash
pnpm dev          # Vite dev server on :30001, proxies to Foundry :30000
pnpm build        # Production build to dist/
pnpm build:dev    # Development build (unminified)
pnpm watch        # Build + watch mode (development)
pnpm lint         # Biome check (linting + formatting)
pnpm pack         # Build + create shattered-worlds.zip
pnpm bump:patch   # Bump patch version across all manifests
pnpm bump:minor   # Bump minor version
pnpm bump:major   # Bump major version
```
