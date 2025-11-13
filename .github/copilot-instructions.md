# Shattered Worlds - AI Coding Agent Instructions

## Project Overview

This is a **Foundry VTT game system** for "Shattered Worlds" - a techno-fantasy RPG with roguelike elements. The system uses a modern stack with **Svelte 5**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

## Architecture: Hybrid Handlebars + Svelte

The system uses a **two-layer rendering approach**:

1. **Handlebars templates** (`templates/`) render the outer shell with Foundry-managed form inputs
2. **Svelte 5 components** (`src/view/*/ui/`) mount into `.svelte-sheet-body` containers for reactive UI

### Key Pattern: SvelteActorSheet

All actor/item sheets extend `SvelteActorSheet` (or `SvelteItemSheet`):

```typescript
// src/view/BaseCharacter/CharacterApp.ts
export class CharacterApp extends SvelteActorSheet {
  static Shell = CharacterShell; // Svelte 5 component
  get template() {
    return 'systems/shattered-worlds/templates/actor/ShwCharacterSheet.hbs';
  }
}
```

- Handlebars template defines header/form structure
- Svelte component mounts in `<section class="svelte-sheet-body"></section>`
- Use `mountSvelte()` helper for Svelte 5's `mount()`/`unmount()` API

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

### Item Types: `consumable`

Items use factory pattern (`ItemFactory.createConsumable()`) with discriminated unions:

```typescript
// src/documents/Item/types/ConsumableDataTypes.ts
type ConsumableData = BombData | PotionData | ScrollData | PoisonData | FoodData;
```

Each type has specific fields (e.g., `bomb.radius`, `potion.effects[]`).

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
- Component props: `export let item: ShwItem;`
- Event handlers: `on:change={(e) => updateConsumable('field', e.currentTarget.value)}`

### File Organization

```
src/
  documents/        # Foundry document classes (Actor, Item, Token)
  helpers/          # Pure functions for data preparation
  lib/              # Base classes (SvelteActorSheet, SvelteItemSheet)
  view/             # Sheet applications + Svelte UI
    */ui/           # Svelte components
    */store/        # Svelte stores (legacy, prefer runes)
  shared/ui/        # Reusable Svelte components
```

## Foundry VTT Integration

### System Manifest (`system.json`)

- **ID:** `shattered-worlds`
- **Compatibility:** Foundry v12+
- **Entry point:** `dist/shattered-worlds.js` (built from `src/index.ts`)
- **Hot reload:** Enabled for `lang/*.json` files

### Hooks Usage

```typescript
// src/index.ts
Hooks.once('init', () => {
  CONFIG.Actor.documentClass = ShwActor;
  CONFIG.Item.documentClass = ShwItem;
});

Hooks.once('setup', () => {
  Actors.registerSheet('shw', CharacterApp, { types: ['character'], makeDefault: true });
});
```

### Data Model (`template.json`)

Minimal schema - actual structure defined in TypeScript types (`src/documents/*/types/`).

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

## Debugging Tips

- **Svelte DevTools:** Install browser extension for Svelte 5
- **Foundry Console:** Access via `game.actors`, `game.items`, `CONFIG`
- **Type errors:** Check `@ts-expect-error` comments for Foundry API mismatches
- **Hot reload:** Only works for lang files; code changes require page refresh in dev mode

## External Dependencies

- **Foundry VTT Types:** `@league-of-foundry-developers/foundry-vtt-types`
- **Svelte 5:** Latest runes API (not Svelte 4 stores)
- **Tailwind v4:** Uses new `@tailwindcss/vite` plugin (not PostCSS)
- **Biome:** Replaces ESLint/Prettier for linting and formatting

## Localization

- Files: `lang/en.json`
- Access in code: `game.i18n.localize('SHW.KeyName')`
- Hot reload enabled in dev mode

## Testing & Quality

- **No automated tests** currently - manual testing in Foundry required
- **Biome checks:** Run `pnpm biome check` before commits
- **Build validation:** Ensure `pnpm build` succeeds without errors
