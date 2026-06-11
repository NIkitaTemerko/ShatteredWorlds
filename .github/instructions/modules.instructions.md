---
applyTo: "src/modules/**"
---

# Standalone Modules

Modules are encapsulated FSD slices that expose only their Application class.

## Item Import

The `modules/itemImport/` slice provides bulk JSON import of items with validation.

### Pipeline

Parse JSON → Zod validate → dry-run report → import with dedup

### Model Files (split by responsibility)

- `parseItems.ts` — `parseItemCores()`: JSON parsing, path formatting
- `validateItems.ts` — `validateItemCores()`: Zod schema validation, duplicate detection
- `importItems.ts` — `importItemCores()`: Foundry item creation/update via `baseId` matching
- `schemas/` — Zod schemas for consumable, ability, spell item structures (split by entity)
- `schemaPrompt.ts` — Generates schema description for AI-assisted item creation
- `errorPrompt.ts` — Formats validation errors for AI correction
- `iconsPrompt.ts` — Generates icon assignment prompt
- `iconCategories.ts` — Icon catalog organized by item type
- `types.ts` — `ItemCore`, `ValidationReport`, `ImportReport`, `ImportResult`

### Key Types

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

### UI

`ImportItemsDialog.svelte` — single dialog component handling the full import workflow with step-by-step feedback.

## Shop Manager

The `modules/shop/` slice provides a merchant/location tree for managing shops.

### Structure

- `ShopManagerApp.ts` — Foundry Application class (the only public export)
- `model/` — types, constants, mappers, storage (localStorage), shopTreeState
- `ui/` — ShopManagerShell, ShopTree, NodeEditorDialog, MerchantItemEditorDialog

### Encapsulation

Only `ShopManagerApp` is exported from the module barrel — all internal state, types, and UI components are implementation details.
