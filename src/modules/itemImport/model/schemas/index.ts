import { z } from 'zod';
import { loadFoundryIcons } from '../../../../shared/data/foundryIconsLoader';
import { createItemCoreSchemas } from './itemCore';

export type { ValidatedItemCore } from './itemCore';

// Ленивая инициализация — кешируем после первой загрузки
let _schemas: ReturnType<typeof createItemCoreSchemas> | null = null;

export async function getSchemas() {
  if (_schemas) return _schemas;
  const icons = await loadFoundryIcons();
  _schemas = createItemCoreSchemas(new Set(icons));
  return _schemas;
}

const typeSchemaKey = {
  consumable: 'ConsumableItemSchema',
  ability: 'AbilityItemSchema',
  spell: 'SpellItemSchema',
  equipment: 'EquipmentItemSchema',
} as const;

/**
 * Возвращает JSON Schema только для указанных типов предметов.
 * Схемы должны быть уже загружены через getSchemas().
 */
export function getJsonSchemaForTypes(types: Set<string>): Record<string, object> {
  if (!_schemas) throw new Error('Схемы ещё не загружены. Сначала вызови getSchemas().');
  const result: Record<string, object> = {};
  for (const type of types) {
    const key = typeSchemaKey[type as keyof typeof typeSchemaKey];
    if (key) {
      result[type] = z.toJSONSchema(_schemas[key], { unrepresentable: 'any' });
    }
  }
  return result;
}
