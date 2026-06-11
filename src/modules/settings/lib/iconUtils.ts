/** Парсит вставленный HTML тег <i class="fa-solid fa-star"></i> → "fa-solid fa-star" */
export function parseIconInput(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(/<i\s+class="([^"]+)"/);
  if (match) return match[1].trim();
  return trimmed;
}

/** Для отображения: если нет стиля-префикса, добавляем fas */
export function resolveIconClass(icon: string): string {
  if (!icon) return 'fas fa-question';
  if (/^(fas?|far?|fab?)\s/.test(icon) || /^fa-(solid|regular|brands)\s/.test(icon)) return icon;
  return `fas ${icon}`;
}
