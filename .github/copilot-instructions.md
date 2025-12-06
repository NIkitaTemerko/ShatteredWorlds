# Shattered Worlds - AI Coding Agent Instructions

## Project Overview

This is a **Foundry VTT game system** for "Shattered Worlds" - a techno-fantasy RPG with roguelike elements. The system uses a modern stack with **Svelte 5**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

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

### Item Types: `consumable` | `ability`

Items use factory pattern (`ItemFactory.createConsumable()`, `ItemFactory.createAbility()`) with discriminated unions:

```typescript
// src/documents/Item/types/ConsumableDataTypes.ts
type ConsumableData = BombData | PotionData | ScrollData | PoisonData | FoodData;
// src/documents/Item/types/AbilityDataTypes.ts
type AbilityData = ActiveAbilityData | PassiveAbilityData;
```

**Consumable types** have specific fields (e.g., `bomb.damage.amount`, `potion.effects[]`)
**Ability types** distinguish between `active` (with cooldowns, costs) and `passive` (always-on effects)

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

### Biome Formatting

- **Line width:** 100 chars
- **Quotes:** Single quotes for JS/TS
- **Indentation:** 2 spaces
- **Import types:** Use `import type` for type-only imports (enforced)

### Svelte 5 Patterns

- Use **runes** (`$state`, `$derived`, `$effect`) instead of stores where possible
- Component props: Use `$props()` with interface destructuring:
  ```typescript
  interface Props { actor: ShwActor<'character'>; }
  let { actor }: Props = $props();
  ```
- Event handlers: Use callback props, not `on:` directives:
  ```svelte
  <TabNavigation {activeTab} onTabChange={handleTabChange} />
  ```
- State management: `let activeTab = $state<CharacterTab>('stats');`
- Legacy stores still exist in `*/store/` - migrate to runes when refactoring

### File Organization

```
src/
  documents/        # Foundry document classes (Actor, Item, Token)
  helpers/          # Pure functions for data preparation (prepareBaseData, prepareDerivedData)
  sheets/           # Base classes (SvelteActorSheet, ShwItemSheet)
  view/             # Sheet applications (CharacterApp, ItemApp) + Root Svelte shells
    */ui/           # Svelte components (RootCharacterShell.svelte, etc)
    */store/        # Svelte stores (legacy, prefer runes in new code)
  entities/         # Domain models + UI components organized by entity
    character/      # Character-specific types, constants, and components
      model/        # Types, interfaces, constants (CharacterTab, AttributeColors)
      ui/           # Character-specific Svelte components (AttributeStats, CharacterHeader)
  features/         # Cross-cutting features (navigation, roll)
    navigation/     # Tab navigation components
    roll/           # Roll panel and roll logic
  shared/ui/        # Reusable Svelte components (Input, ActionIcon)
```

**Architecture pattern:** 
- `entities/` = domain-driven slices (character, npc, item) with model + UI
- `features/` = cross-cutting functionality used across multiple entities
- `view/` = Foundry sheet adapters that wire entities/features together

**Import pattern example:**
```typescript
// In view/BaseCharacter/ui/RootCharacterShell.svelte
import { CharacterHeader, AttributeStats } from '../../../entities/character';
import { TabNavigation } from '../../../features/navigation';
import { RollPanel } from '../../../features/roll';
```

This keeps domain logic (entities) separate from presentation wiring (view) and shared features.

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
});

Hooks.on('preCreateToken', (tokenDocument, tokenData) => {
  // Character tokens auto-link to actor (shared token)
  const actor = game.actors.get(tokenData.actorId);
  if (actor?.type === 'character') {
    tokenDocument.updateSource({ actorLink: true });
  }
});

Hooks.on('preCreateItem', (item, data) => {
  // Auto-migrate legacy consumable data + handle stacking logic
  if (needsMigration(data)) {
    const migrated = migrateConsumableData(data);
    item.updateSource({ system: migrated.system });
  }
  
  // Stack management for items added to actors
  if (item.parent && item.parent instanceof ShwActor) {
    const result = handleAddItem(item.parent, {
      type: item.type, name: item.name, system: item.system
    });
    // Prevent creation if item was stacked or blocked
    if (result === 'stacked' || result === 'blocked') return false;
  }
});
```

### Data Model (`template.json`)

Minimal schema - actual structure defined in TypeScript types (`src/documents/*/types/`). Only declares actor/item types, not full data structure.

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

## Debugging Tips

- **Svelte DevTools:** Install browser extension for Svelte 5
- **Foundry Console:** Access via `game.actors`, `game.items`, `CONFIG`
- **Type errors:** Check `@ts-expect-error` comments for Foundry API mismatches
- **Hot reload:** Only works for lang files; code changes require page refresh in dev mode
- **Vite dev server issues:** Ensure Foundry is running on `:30000` before starting `:30001`
- **Sheet not rendering:** Check browser console for Svelte mount errors in `.svelte-sheet-body`

## External Dependencies

- **Foundry VTT Types:** `@league-of-foundry-developers/foundry-vtt-types`
- **Svelte 5:** Latest runes API (not Svelte 4 stores)
- **Tailwind v4:** Uses new `@tailwindcss/vite` plugin (not PostCSS)
- **Biome:** Replaces ESLint/Prettier for linting and formatting

## Localization

- Files: `lang/en.json`
- Access in code: `game.i18n.localize('SHW.KeyName')`
- Hot reload enabled in dev mode

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
- **Biome checks:** Run `pnpm biome check` before commits
- **Build validation:** Ensure `pnpm build` succeeds without errors
- **Manual testing workflow:**
  1. Start Foundry on `:30000`
  2. Run `pnpm dev` for `:30001` dev server
  3. Create test actors/items in Foundry
  4. Verify sheet rendering and data updates
  5. Check browser console for errors
