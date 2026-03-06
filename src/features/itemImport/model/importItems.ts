import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { ImportReport, ImportResult, ItemCore } from './types';

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
