# Shattered Worlds - AI Coding Agent Instructions

## Project Overview

**Foundry VTT game system** for "Shattered Worlds" — a techno-fantasy RPG with roguelike elements.
Stack: **Svelte 5**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Biome**.

## FSD Architecture

The project follows an **adapted FSD methodology** — strict layered architecture with defined import rules.

### Layers (bottom → top)

| Layer | Path | Responsibility | Can import from |
|---|---|---|---|
| **shared** | `src/shared/` | Reusable UI, utilities, types, constants. No business logic. | Only itself |
| **entities** | `src/entities/` | Domain models + entity-specific UI | `shared` |
| **features** | `src/features/` | Cross-cutting user-facing functionality | `shared`, `entities` |
| **modules** | `src/modules/` | Standalone application windows | `shared`, `entities`, `features` |
| **view** | `src/view/` | Foundry sheet adapters — wires entities + features into sheets | All layers above |

Non-FSD layers alongside:
- **documents** (`src/documents/`) — Foundry document classes (`ShwActor`, `ShwItem`, `ShwTokenDocument`)
- **helpers** (`src/shared/helpers/`) — Pure data preparation functions (`prepareBaseData`, `StackManager`)

### Import Direction Rule

**Imports go strictly downward.** A lower layer NEVER imports from a higher layer:

```
shared ← entities ← features ← modules ← view
                                              ↑
                                     documents + helpers (used by all)
```

❌ `shared/ui/tree/TreeNodeView.svelte` importing from `entities/inventory/`
✅ `entities/inventory/ui/InventoryTree.svelte` importing from `shared/ui/tree/`

### Slice Structure

Each slice follows `model/` + `ui/` convention with `index.ts` barrel exports:

```
entities/ability/
  index.ts        # Barrel: public API of the slice
  model/          # types, constants, mappers, state, business logic
    index.ts
  ui/             # Svelte components specific to this entity
    index.ts
```

**FSD principle:** `shared` knows shapes, entities fill them with domain meaning. Generic components in `shared/` must NOT contain domain-specific logic.

## File Organization

```
src/
  documents/          # [NON-FSD] Foundry document classes
    Actor/            # ShwActor<K> with type guards + prepare hooks
    Item/             # ShwItem, ItemFactory, discriminated type definitions
    ShwTokenDocument.ts
  shared/helpers/     # [NON-FSD] Pure data preparation functions
    Character/        # prepareCharacterBaseData, prepareDerivedData, characterRoll
    Item/             # StackManager (stacking + dedup), migrateConsumableData
    Npc/              # prepareNpcBaseData, prepareNpcDerivedData
  sheets/             # [NON-FSD] Base Foundry sheet adapters (SvelteActorSheet, SveltItemSheet)
  shared/             # [FSD: shared] Reusable components, utilities, i18n, tree system, PopupMenu
  entities/           # [FSD: entities] character, ability, spell, consumable, inventory
  features/           # [FSD: features] navigation, roll, activation, uses, statBonuses
  modules/            # [FSD: modules] shop (ShopManagerApp), itemImport (ImportItemsApp)
  view/               # [FSD: view] BaseCharacter, NpcCharacter, ConsumableItem, AbilityItem, SpellItem
templates/            # Handlebars shells (minimal mount points for Svelte)
lang/                 # en.json, ru.json — hot reload enabled in dev
```

## Language Rules

- **Code comments and docstrings:** Russian (Cyrillic)
- **Variable/function names:** English
- **Commit messages:** English
- **Branch names:** English

## Biome Formatting

- **Line width:** 100 chars
- **Quotes:** Single quotes for JS/TS
- **Indentation:** 2 spaces
- **Import types:** Use `import type` for type-only imports (enforced)
- **Svelte overrides:** `useConst`, `useImportType`, `noUnusedVariables`, `noUnusedImports` disabled for `*.svelte`

## Build Commands

```bash
pnpm dev          # Vite dev server on :30001, proxies to Foundry on :30000
pnpm build        # Production build to dist/
pnpm build:dev    # Development build (unminified)
pnpm watch        # Build + watch mode
pnpm lint         # Biome check (linting + formatting)
pnpm pack         # Build + create shattered-worlds.zip
pnpm bump:patch   # Bump patch version across package.json, system.json, README.md
pnpm bump:minor
pnpm bump:major
```

**Dev requirements:** Foundry must run on `localhost:30000` before starting Vite on `localhost:30001`.

## Path-Specific Instructions

Detailed rules for specific areas are in `.github/instructions/`:

| File | Applies to | Content |
|---|---|---|
| `svelte.instructions.md` | `**/*.svelte` | Svelte 5 runes, props, events, CSS vars |
| `foundry.instructions.md` | `src/documents/**`, `src/index.ts`, `src/sheets/**` | Document model, hooks, item sync, HBS+Svelte rendering |
| `fsd-entities.instructions.md` | `src/entities/**`, `src/features/**` | Tree system, PopupMenu, i18n, tree state management |
| `view-sheets.instructions.md` | `src/view/**` | Sheet classes, ReactiveDocumentWrapper, safe item updates |
| `item-system.instructions.md` | `src/shared/helpers/Item/**`, `src/documents/Item/**` | StackManager, item types, data loss prevention |
| `modules.instructions.md` | `src/modules/**` | Item import pipeline, Shop manager |

## Debugging Tips

- **Svelte DevTools:** Install browser extension for Svelte 5
- **Foundry Console:** Access via `game.actors`, `game.items`, `CONFIG`
- **Type errors:** Check `@ts-expect-error` comments for Foundry API mismatches
- **Hot reload:** Only works for `lang/*.json`; code changes require browser refresh
- **Sheet not rendering:** Check browser console for Svelte mount errors in `.svelte-sheet-body`

## External Dependencies

- `@league-of-foundry-developers/foundry-vtt-types` (v13)
- `svelte` v5 — runes API (not stores)
- `@tailwindcss/vite` — Tailwind v4 (not PostCSS)
- `biome` — replaces ESLint/Prettier
- `zod` — schema validation in item import
- `clsx` + `tailwind-merge` — via `cn()` in `src/shared/lib/cn.ts`
