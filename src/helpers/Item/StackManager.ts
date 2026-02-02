import { ShwActor } from '../../documents/Actor/ShwActor';
import type { ShwItem } from '../../documents/Item/ShwItem';
import { localize } from '../../shared/i18n';

/**
 * Centralized item stacking and duplicate prevention logic
 */

interface ItemDataLike {
  type: string;
  name: string;
  system?: Record<string, unknown> & {
    baseId?: string;
    quantity?: number;
  };
}

/**
 * Check if item type is stackable (consumables)
 */
export function isStackable(itemData: ItemDataLike): boolean {
  return itemData.type === 'consumable';
}

/**
 * Check if item type is ability (non-stackable, unique)
 */
export function isAbility(itemData: ItemDataLike): boolean {
  return itemData.type === 'ability';
}

/**
 * Generate identity key for item comparison
 * Uses baseId if available, otherwise falls back to type + name
 */
export function getIdentityKey(itemData: ItemDataLike): string {
  if (itemData.system?.baseId) {
    return itemData.system.baseId;
  }
  // Fallback: type + normalized name
  return `${itemData.type}:${itemData.name?.toLowerCase().trim()}`;
}

/**
 * Find existing item in actor's inventory matching the identity
 * Prioritizes non-full stacks (with available space)
 */
export function findExistingStack(actor: ShwActor, itemData: ItemDataLike): ShwItem | null {
  const identityKey = getIdentityKey(itemData);
  let firstMatch: ShwItem | null = null;

  for (const item of actor.items) {
    const existingKey = getIdentityKey({
      type: item.type,
      name: item.name,
      system: item.system as unknown as ItemDataLike['system'],
    });

    if (existingKey === identityKey) {
      // For stackable items, prioritize non-full stacks
      if (item.isConsumable()) {
        const currentQty = item.system.quantity || 0;
        const stackLimit = item.system.stackLimit || Number.POSITIVE_INFINITY;

        // Found a non-full stack - return immediately
        if (currentQty < stackLimit) {
          return item;
        }

        // Remember first match (even if full) as fallback
        if (!firstMatch) {
          firstMatch = item;
        }
      } else {
        // For non-stackable items, return first match
        return item;
      }
    }
  }

  // Return first match (might be full stack, but incrementStack will handle overflow)
  return firstMatch;
}

// Global flag to prevent recursion during overflow stack creation
let isCreatingOverflowStacks = false;

/**
 * Check if we're currently in overflow stack creation (to prevent recursion)
 */
export function isInOverflowCreation(): boolean {
  return isCreatingOverflowStacks;
}

/**
 * Increment stack quantity for existing item
 * If quantity exceeds stackLimit, fills current stack and creates overflow stacks
 * Fires updates asynchronously but returns immediately
 */
export function incrementStack(existingItem: ShwItem, incomingData: ItemDataLike): void {
  if (!existingItem.isConsumable()) return;

  const currentQuantity = existingItem.system.quantity || 0;
  const incomingQuantity = incomingData.system?.quantity || 1;
  const stackLimit = existingItem.system.stackLimit || Number.POSITIVE_INFINITY;
  const totalQuantity = currentQuantity + incomingQuantity;

  // Case 1: Total fits in current stack
  if (totalQuantity <= stackLimit) {
    existingItem
      .update({
        'system.quantity': totalQuantity,
      })
      .then(() => {
        ui.notifications?.info(
          localize('stack.increased', {
            name: existingItem.name,
            from: String(currentQuantity),
            to: String(totalQuantity),
          }),
        );
      });
    return;
  }

  // Case 2: Overflow - fill current stack to limit and create new stacks
  const overflow = totalQuantity - stackLimit;

  // Fill current stack to max
  existingItem
    .update({
      'system.quantity': stackLimit,
    })
    .then(() => {
      ui.notifications?.info(
        localize('stack.filledToMax', {
          name: existingItem.name,
          from: String(currentQuantity),
          to: String(stackLimit),
        }),
      );
    });

  // Create additional stacks for overflow
  const parent = existingItem.parent;
  if (parent && parent instanceof ShwActor) {
    const fullStacks = Math.floor(overflow / stackLimit);
    const partialStack = overflow % stackLimit;

    const newStacks: Array<{
      name: string;
      type: string;
      img: string;
      system: Record<string, unknown>;
    }> = [];

    // Create full stacks
    for (let i = 0; i < fullStacks; i++) {
      newStacks.push({
        name: existingItem.name,
        type: existingItem.type,
        img: existingItem.img,
        system: {
          ...(existingItem.system as unknown as Record<string, unknown>),
          quantity: stackLimit,
        },
      });
    }

    // Create partial stack if needed
    if (partialStack > 0) {
      newStacks.push({
        name: existingItem.name,
        type: existingItem.type,
        img: existingItem.img,
        system: {
          ...(existingItem.system as unknown as Record<string, unknown>),
          quantity: partialStack,
        },
      });
    }

    if (newStacks.length > 0) {
      // Set global flag to prevent recursion
      isCreatingOverflowStacks = true;

      parent.createEmbeddedDocuments('Item', newStacks as never).then(() => {
        // Clear flag after creation completes
        isCreatingOverflowStacks = false;
        ui.notifications?.info(
          localize('stack.additionalCreated', {
            name: existingItem.name,
            count: String(newStacks.length),
          }),
        );
      });
    }
  }
}

/**
 * Handle item addition to actor with stacking logic
 * Synchronous check, returns immediately whether to allow creation
 * Returns:
 * - 'allow': Allow normal creation
 * - 'stacked': Item was stacked, prevent creation
 * - 'blocked': Duplicate ability, prevent creation
 */
export function handleAddItem(
  actor: ShwActor,
  itemData: ItemDataLike,
): 'allow' | 'stacked' | 'blocked' {
  // Skip stacking logic during overflow stack creation (prevent infinite loop)
  if (isInOverflowCreation()) {
    return 'allow';
  }

  const existing = findExistingStack(actor, itemData);

  // No existing item - allow creation
  if (!existing) {
    return 'allow';
  }

  // Ability duplicate - block creation
  if (isAbility(itemData)) {
    ui.notifications?.warn(localize('stack.abilityExists', { name: itemData.name }));
    return 'blocked';
  }

  // Stackable item - increment and block creation
  if (isStackable(itemData)) {
    incrementStack(existing, itemData);
    return 'stacked';
  }

  // Default: allow creation for other types
  return 'allow';
}
