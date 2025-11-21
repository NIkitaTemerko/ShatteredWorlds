/**
 * Migration utility for flattening consumable data structure
 *
 * Transforms old nested format:
 *   { system: { consumable: { consumableType: 'bomb', ... } } }
 *
 * To new flat format:
 *   { system: { consumableType: 'bomb', ... } }
 */

import type { ConsumableData } from '../../documents/Item/types/ConsumableDataTypes';

interface LegacyItemSystem {
  consumable?: ConsumableData;
}

/**
 * Checks if item data needs migration (has nested .consumable object)
 */
export function needsMigration(itemData: any): boolean {
  return (
    itemData?.type === 'consumable' &&
    itemData?.system?.consumable !== undefined &&
    itemData?.system?.consumableType === undefined
  );
}

/**
 * Migrates item data from nested to flat structure
 *
 * @param itemData - Item data with potentially nested consumable
 * @returns Migrated item data with flattened system
 */
export function migrateConsumableData(itemData: any): any {
  if (!needsMigration(itemData)) {
    return itemData;
  }

  const legacySystem = itemData.system as LegacyItemSystem;
  const consumableData = legacySystem.consumable;

  if (!consumableData) {
    return itemData;
  }

  // Flatten: move all consumable fields directly to system
  return {
    ...itemData,
    system: consumableData,
  };
}

/**
 * Batch migration for multiple items
 */
export function migrateConsumableItems(items: any[]): any[] {
  return items.map(migrateConsumableData);
}

/**
 * In-place migration for Foundry Item documents
 * Call this in a Foundry hook (e.g., 'preCreateItem' or during world migration)
 */
export async function migrateItemDocument(item: any): Promise<void> {
  if (!needsMigration(item)) {
    return;
  }

  const migratedData = migrateConsumableData(item);

  await item.update(
    {
      system: migratedData.system,
    },
    { diff: false, recursive: false },
  );
}
