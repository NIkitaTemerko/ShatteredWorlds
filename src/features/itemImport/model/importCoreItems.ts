import type { ShwItem } from '../../../documents/Item/ShwItem';
import { ItemCoresArraySchema } from './schemas';
import type { ImportReport, ImportResult, ItemCore, ValidationReport } from './types';

/** Форматирует путь ошибки Zod */
function formatPath(path: readonly (string | number)[]): string {
  if (!path.length) return 'корень';
  return path.map((p, i) => (typeof p === 'number' ? `[${p}]` : i === 0 ? p : `.${p}`)).join('');
}

/** Парсит и валидирует JSON через Zod */
export function parseItemCores(jsonText: string): ItemCore[] {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) throw new Error('JSON должен быть массивом');

  const result = ItemCoresArraySchema.safeParse(parsed);
  if (result.success) return result.data as ItemCore[];

  // Группируем ошибки по элементу
  const byItem = new Map<number, string[]>();
  for (const issue of result.error.issues) {
    const idx = typeof issue.path[0] === 'number' ? issue.path[0] : -1;
    const path = issue.path.slice(1).filter((p): p is string | number => typeof p !== 'symbol');
    const msg = `  • ${formatPath(path)}: ${issue.message}`;
    byItem.set(idx, [...(byItem.get(idx) || []), msg]);
  }

  const lines = ['Ошибки валидации:'];
  for (const [idx, errs] of byItem) {
    const name = idx >= 0 && parsed[idx]?.name ? `"${parsed[idx].name}"` : `#${idx}`;
    lines.push(`\n[${idx}] ${name}:`, ...errs);
  }
  throw new Error(lines.join('\n'));
}

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

/** Импортирует items в Foundry */
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
  const ItemClass = (globalThis as unknown as { Item: typeof Item }).Item;

  for (const item of items) {
    try {
      const existing = gameItems.find((i) => i.system?.baseId === item.baseId);
      const result: ImportResult = { itemId: '', baseId: item.baseId, status: 'created' };

      // Собираем данные
      const data: Record<string, unknown> = {
        name: item.name,
        type: item.type,
        system: { ...item.system, baseId: item.baseId },
      };
      if (item.img && !opts.skipImages) data.img = item.img;
      if (item.effects) data.effects = item.effects;

      // Флаги с pendingLinks
      if (item.flags || item.pendingLinks) {
        const flags = { ...(existing?.flags || {}), ...item.flags } as Record<string, unknown>;
        if (item.pendingLinks) {
          flags.shw = { ...((flags.shw as object) || {}), pendingLinks: item.pendingLinks };
        }
        data.flags = flags;
      }

      if (existing) {
        result.status = 'updated';
        result.itemId = existing.id || '';
        if (!opts.dryRun) await existing.update(data);
        report.updated++;
      } else {
        if (!opts.dryRun) {
          const created = (await ItemClass.create(
            data as Parameters<typeof ItemClass.create>[0],
          )) as unknown as ShwItem | null;
          if (!created) throw new Error('Item.create вернул null');
          result.itemId = created.id || '';
        }
        report.created++;
      }

      report.results.push(result);
    } catch (e) {
      report.errors++;
      report.results.push({
        itemId: '',
        baseId: item.baseId,
        status: 'skipped',
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return report;
}
