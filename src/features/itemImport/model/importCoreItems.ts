import type { ShwItem } from '../../../documents/Item/ShwItem';
import { ItemCoresArraySchema } from './schemas';
import type {
  ImportReport,
  ImportResult,
  ItemCore,
  ValidationError,
  ValidationReport,
} from './types';

/**
 * Форматирует путь ошибки Zod в понятный вид
 */
function formatErrorPath(path: readonly (string | number)[]): string {
  if (path.length === 0) return 'корень';
  return path
    .map((p, i) => {
      if (typeof p === 'number') {
        return `[${p}]`;
      }
      return i === 0 ? p : `.${p}`;
    })
    .join('');
}

/**
 * Парсит JSON текст в массив ItemCore с валидацией через Zod
 */
export function parseItemCores(jsonText: string): ItemCore[] {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) {
    throw new Error('JSON должен быть массивом объектов');
  }

  // Валидация через Zod - применит defaults автоматически
  const result = ItemCoresArraySchema.safeParse(parsed);
  if (!result.success) {
    // Группируем ошибки по индексу элемента
    const errorsByItem = new Map<number, string[]>();

    for (const issue of result.error.issues) {
      const itemIndex = typeof issue.path[0] === 'number' ? issue.path[0] : -1;
      const restPath = issue.path
        .slice(1)
        .filter((p): p is string | number => typeof p === 'string' || typeof p === 'number');
      const fieldPath = formatErrorPath(restPath);
      const errorMsg = `  • ${fieldPath}: ${issue.message}`;

      if (!errorsByItem.has(itemIndex)) {
        errorsByItem.set(itemIndex, []);
      }
      errorsByItem.get(itemIndex)!.push(errorMsg);
    }

    // Формируем понятное сообщение
    const messages: string[] = ['Ошибки валидации:'];
    for (const [index, errors] of errorsByItem) {
      const itemName =
        index >= 0 && parsed[index]?.name ? `"${parsed[index].name}"` : `элемент ${index}`;
      messages.push(`\nЭлемент [${index}] ${itemName}:`);
      messages.push(...errors);
    }

    throw new Error(messages.join('\n'));
  }

  return result.data as ItemCore[];
}

/**
 * Валидирует массив ItemCore (упрощенная, т.к. Zod уже провалидировал в parseItemCores)
 */
export function validateItemCores(items: ItemCore[]): ValidationReport {
  const errors: ValidationError[] = [];
  const seenBaseIds = new Set<string>();
  const duplicates: string[] = [];

  items.forEach((item, index) => {
    // Проверяем только дубликаты baseId (остальное уже проверил Zod)
    if (seenBaseIds.has(item.baseId)) {
      if (!duplicates.includes(item.baseId)) {
        duplicates.push(item.baseId);
      }
      errors.push({
        index,
        baseId: item.baseId,
        message: 'Дублирующийся baseId в пакете импорта',
      });
      return;
    }
    seenBaseIds.add(item.baseId);
  });

  return { valid: errors.length === 0, errors, duplicates };
}

/**
 * Импортирует ItemCore в Foundry
 */
export async function importItemCores(
  items: ItemCore[],
  opts: { dryRun?: boolean; skipImages?: boolean } = {},
): Promise<ImportReport> {
  const report: ImportReport = {
    dryRun: opts.dryRun ?? false,
    total: items.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    results: [],
  };

  const gameItems = (game as unknown as { items: Collection<ShwItem> }).items;

  for (const itemData of items) {
    try {
      const existing = gameItems.find((item: ShwItem) => item.system?.baseId === itemData.baseId);
      const result: ImportResult = { itemId: '', baseId: itemData.baseId, status: 'created' };

      if (existing) {
        // UPDATE
        result.status = 'updated';
        result.itemId = existing.id || '';

        if (!opts.dryRun) {
          const updateData: Record<string, unknown> = {
            name: itemData.name,
            system: {
              ...itemData.system,
              baseId: itemData.baseId,
            },
          };

          if (itemData.img && !opts.skipImages) updateData.img = itemData.img;
          if (itemData.effects) updateData.effects = itemData.effects;
          if (itemData.flags) updateData.flags = { ...existing.flags, ...itemData.flags };
          if (itemData.pendingLinks) {
            updateData.flags = updateData.flags || {};
            const flags = updateData.flags as Record<string, unknown>;
            flags.shw = {
              ...((flags.shw as Record<string, unknown>) || {}),
              pendingLinks: itemData.pendingLinks,
            };
          }

          await existing.update(updateData);
        }

        report.updated++;
      } else {
        // CREATE
        result.status = 'created';

        if (!opts.dryRun) {
          const createData: Record<string, unknown> = {
            name: itemData.name,
            type: itemData.type,
            system: { ...itemData.system, baseId: itemData.baseId },
          };

          if (itemData.img && !opts.skipImages) createData.img = itemData.img;
          if (itemData.effects) createData.effects = itemData.effects;
          if (itemData.flags) createData.flags = itemData.flags;
          if (itemData.pendingLinks) {
            createData.flags = createData.flags || {};
            const flags = createData.flags as Record<string, unknown>;
            flags.shw = {
              ...((flags.shw as Record<string, unknown>) || {}),
              pendingLinks: itemData.pendingLinks,
            };
          }

          const created = await (
            globalThis as unknown as typeof globalThis & {
              Item: { create(data: Record<string, unknown>): Promise<ShwItem> };
            }
          ).Item.create(createData);
          if (!created) throw new Error('Ошибка создания item');

          result.itemId = created.id || '';
        }

        report.created++;
      }

      report.results.push(result);
    } catch (error) {
      report.errors++;
      report.results.push({
        itemId: '',
        baseId: itemData.baseId,
        status: 'skipped',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return report;
}
