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
  consumableType?: unknown;
}

interface MigratableItemData {
  type?: string;
  system?: LegacyItemSystem;
  [key: string]: unknown;
}

interface UpdatableItemLike extends MigratableItemData {
  update?: (
    data: { system: ConsumableData },
    operation?: { diff?: boolean; recursive?: boolean },
  ) => Promise<unknown>;
}

interface MigratedItemData extends Omit<MigratableItemData, 'system'> {
  system?: ConsumableData;
}

/**
 * Checks if item data needs migration (has nested .consumable object)
 */
export function needsMigration(itemData: unknown): itemData is MigratableItemData {
  if (typeof itemData !== 'object' || itemData === null) return false;
  const data = itemData as MigratableItemData;

  return (
    data.type === 'consumable' &&
    data.system?.consumable !== undefined &&
    data.system?.consumableType === undefined
  );
}

/**
 * Migrates item data from nested to flat structure
 *
 * @param itemData - Item data with potentially nested consumable
 * @returns Migrated item data with flattened system
 */
export function migrateConsumableData<T>(itemData: T): T {
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
  } as T;
}

/**
 * Batch migration for multiple items
 */
export function migrateConsumableItems<T>(items: T[]): T[] {
  return items.map(migrateConsumableData);
}

/**
 * In-place migration for Foundry Item documents
 * Call this in a Foundry hook (e.g., 'preCreateItem' or during world migration)
 */
export async function migrateItemDocument(item: unknown): Promise<void> {
  if (!needsMigration(item)) {
    return;
  }

  const migratableItem = item as UpdatableItemLike;
  if (typeof migratableItem.update !== 'function') {
    return;
  }

  const migratedData = migrateConsumableData(item);
  const migratedSystem = (migratedData as MigratedItemData).system;

  if (!migratedSystem) {
    return;
  }

  await migratableItem.update(
    {
      system: migratedSystem,
    },
    { diff: false, recursive: false },
  );
}
