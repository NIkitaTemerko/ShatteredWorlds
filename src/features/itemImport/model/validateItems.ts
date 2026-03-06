import type { ItemCore, ValidationReport } from './types';

/** Проверяет дубликаты baseId */
export function validateItemCores(items: ItemCore[]): ValidationReport {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  const errors = items
    .map((item, index) => {
      if (seen.has(item.baseId)) {
        if (!duplicates.includes(item.baseId)) duplicates.push(item.baseId);
        return { index, baseId: item.baseId, message: 'Дублирующийся baseId' };
      }
      seen.add(item.baseId);
      return null;
    })
    .filter(Boolean) as { index: number; baseId: string; message: string }[];

  return { valid: !errors.length, errors, duplicates };
}
