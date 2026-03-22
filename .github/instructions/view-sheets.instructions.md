---
applyTo: "src/view/**"
---

# View Layer Patterns

## Sheet Class Structure

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

## Rendering Flow

1. Handlebars template renders minimal shell: `<form><section class="svelte-sheet-body"></section></form>`
2. `SvelteActorSheet._renderSvelte()` mounts Svelte component into `.svelte-sheet-body`
3. Component receives `getActor` function prop for reactivity
4. `ReactiveDocumentWrapper` subscribes to Foundry hooks for auto-updates

**Key Implementation Details:**
- `mountSvelte()` helper wraps Svelte 5's `mount()`/`unmount()` API
- Base class tracks `_mountedActorId` to prevent unnecessary remounts
- `close()` method properly unmounts Svelte to prevent memory leaks
- Actor changes trigger remount, but render calls without changes just bring sheet to top

## ReactiveDocumentWrapper

Subscribes to Foundry hooks for auto-updates:

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

## Sheet Remounting Strategy

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

## Safe Item Updates: getUpdateConsumable()

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
<input onchange={(e) => updateConsumable('field', e.currentTarget.value)} />
```

**Critical:** This pattern prevents data loss by preserving the entire `system` object while updating specific nested paths. Without this, partial updates can overwrite sibling fields.

### Data Loss Pitfall
❌ **Wrong:** `item.update({ 'system': { name: newName } })`
✅ **Right:** Use `getUpdateConsumable()` utility pattern or dotted path syntax

## Conditional Rendering by Item Type

Use discriminated unions for items:
```svelte
{#if item.system.consumableType === 'bomb'}
  <BombStats {item} />
{:else if item.system.consumableType === 'potion'}
  <PotionsAndFood {item} />
{/if}
```

## Import Pattern

```typescript
// In view/BaseCharacter/ui/RootCharacterShell.svelte (view layer)
import { CharacterHeader, AttributeStats } from '../../../entities/character';  // entities
import { TabNavigation } from '../../../features/navigation';                   // features
import { RollPanel } from '../../../features/roll';                             // features
```

This keeps domain logic (entities) separate from presentation wiring (view) and shared features.
