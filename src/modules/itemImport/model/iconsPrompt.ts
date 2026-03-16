import { getIconsForType } from './iconCategories';

/**
 * Генерирует промпт для подбора иконок к предметам
 */
export function generateIconsPrompt(jsonText: string): string {
  let items: Array<Record<string, unknown>> = [];
  try {
    items = JSON.parse(jsonText);
  } catch {
    return 'Ошибка: невалидный JSON';
  }

  // Собираем уникальные типы
  const types = new Set<string>();
  for (const item of items) {
    const system = item.system as { consumableType?: string } | undefined;
    const type = system?.consumableType || (item.type as string) || 'unknown';
    types.add(type);
  }

  // Собираем все релевантные иконки
  const allIcons: string[] = [];
  for (const type of types) {
    allIcons.push(...getIconsForType(type, type));
  }
  const uniqueIcons = [...new Set(allIcons)];

  return `# Подбери иконки для предметов Shattered Worlds

## Исходные предметы:
\`\`\`json
${jsonText}
\`\`\`

## Доступные иконки (выбирай ТОЛЬКО из этого списка):
\`\`\`json
${JSON.stringify(uniqueIcons, null, 2)}
\`\`\`

## Задача:
1. Для КАЖДОГО предмета добавь или замени поле "img" на подходящую иконку
2. Выбирай иконку по смыслу: potions для зелий, bomb для бомб, scrolls для свитков, food для еды, skills для способностей, magic для заклинаний`;
}
