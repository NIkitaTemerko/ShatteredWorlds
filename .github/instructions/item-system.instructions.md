---
applyTo: "src/shared/helpers/Item/**,src/documents/Item/**"
---

# Item System

## Item Stacking & Duplicate Prevention

The `StackManager.ts` handles automatic stacking of consumables and prevents duplicate abilities.

### Key Functions

```typescript
// src/helpers/Item/StackManager.ts

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

### Behavior

- **Consumables** (`stackable`): Auto-stack if identity matches, respects `stackLimit`
- **Abilities** (`unique`): Blocks duplicates, shows notification
- **Overflow handling**: When adding to full stack, fills current to limit and creates additional stacks
- **Recursion prevention**: Uses `isCreatingOverflowStacks` flag during overflow stack creation

### Hook Integration

```typescript
// src/index.ts
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

### Stack Operations Performance

Stack updates use async fire-and-forget pattern:

```typescript
// Updates fire asynchronously but function returns immediately
existingItem.update({ 'system.quantity': totalQuantity }).then(() => {
  ui.notifications?.info(`Stack increased`);
});
// Function returns here, doesn't wait for update to complete
```

UI remains responsive during bulk item operations. Foundry's document system queues updates automatically.

## Item Data Types

### Consumable Types

```typescript
// src/documents/Item/types/ConsumableDataTypes.ts
type ConsumableData = BombData | PotionData | ScrollData | PoisonData | FoodData;
```

Each type has specific fields (e.g., `bomb.damage.amount`, `potion.effects[]`).

### Ability Types

```typescript
// src/documents/Item/types/AbilityDataTypes.ts
type AbilityData = ActiveAbilityData | PassiveAbilityData;
```

Active abilities have cooldowns and costs; passive abilities are always-on effects.

### Spell Types

```typescript
// src/documents/Item/types/SpellDataTypes.ts
type SpellCategory = 'code' | 'elemental' | 'dark' | 'holy' | 'arcane';
type SpellKind = 'attack' | 'heal' | 'support' | 'debuff' | 'control' | 'movement' | 'summon' | 'utility';
```

Spells have `spellKind`, `category`, `actionType`, `castTime`, `range`, `targeting`, `effects[]`, `savingThrow[]`, `rank`, cooldowns, and resource costs.

## Item Factory Pattern

Items use factory pattern for creation:

```typescript
ItemFactory.createConsumable()  // Creates typed consumable
ItemFactory.createAbility()     // Creates typed ability
```

## Data Loss Prevention

❌ **Wrong:** `item.update({ 'system': { name: newName } })`
✅ **Right:** Use `getUpdateConsumable()` utility pattern or dotted path syntax

Without the pattern, partial updates overwrite entire nested objects. The `getUpdateConsumable` pattern preserves all `system` fields while updating specific paths using `system.${path}` syntax.
