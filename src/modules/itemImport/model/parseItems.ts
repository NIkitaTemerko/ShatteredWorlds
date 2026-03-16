import { getSchemas } from './schemas';
import type { ItemCore } from './types';

/** Форматирует путь ошибки Zod */
function formatPath(path: readonly (string | number)[]): string {
  if (!path.length) return 'корень';
  return path.map((p, i) => (typeof p === 'number' ? `[${p}]` : i === 0 ? p : `.${p}`)).join('');
}

/** Парсит и валидирует JSON через Zod */
export async function parseItemCores(jsonText: string): Promise<ItemCore[]> {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) throw new Error('JSON должен быть массивом');

  const { ItemCoresArraySchema } = await getSchemas();
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
