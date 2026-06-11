---
applyTo: "src/documents/**,src/index.ts,src/sheets/**"
---

# Foundry VTT Integration

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

### Data Model (`template.json`)

Minimal schema - actual structure defined in TypeScript types (`src/documents/*/types/`). Only declares actor/item types (`character`, `npc`, `consumable`, `ability`, `spell`), not full data structure.

## Hooks Usage

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

**Hook timing rule:** Respect hook order: `init` → `setup` → `ready`. Register document classes in `init`, sheets in `setup`.

## Item Synchronization System

Owned items (on actors) maintain a two-way sync with their global source items:

- **Origin tracking:** `flags.shw.originItemId` links owned items to their global source
- **Origin discovery:** By explicit ID → by `baseId` → by name+type (drag-drop fallback)
- **Owned → Global:** Editing an owned item syncs changes to the global source
- **Global → Owned:** Editing a global item propagates to all owned copies across all actors
- **Recursion prevention:** `skipSync` option flag prevents infinite update loops

## Type Guards for Actor Types

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

## Type-Safe Actor Updates

Always use type-safe paths with discriminated unions:
```typescript
if (actor.isCharacter()) {
  // TypeScript knows system is ShwActorSystem here
  actor.update({ 'system.health.value': newValue });
}
```

## Hybrid Handlebars + Svelte Rendering

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

## System Manifest (`system.json`)

- **ID:** `shattered-worlds`
- **Compatibility:** Foundry v12+
- **Entry point:** `dist/shattered-worlds.js` (built from `src/index.ts`)
- **Hot reload:** Enabled for `lang/*.json` files
- **Download URL:** Auto-updated by `scripts/update-system-version.js` to match package version

## Nav Bar Buttons

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
