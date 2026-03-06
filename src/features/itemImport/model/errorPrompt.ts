import { getIconsForType } from './iconCategories';

/**
 * Генерирует промпт с ошибками для исправления ИИ
 */
export function generateErrorPrompt(errorMessage: string, jsonText: string): string {
  // Определяем нужны ли иконки для исправления
  const needsIcons =
    errorMessage.toLowerCase().includes('иконк') ||
    errorMessage.toLowerCase().includes('icon') ||
    errorMessage.toLowerCase().includes('img');

  let iconSection = '';
  if (needsIcons) {
    // Парсим JSON чтобы понять какие типы предметов
    try {
      const items = JSON.parse(jsonText);
      const types = new Set<string>();
      for (const item of items) {
        if (item.system?.consumableType) {
          types.add(item.system.consumableType);
        } else if (item.type) {
          types.add(item.type);
        }
      }

      // Собираем релевантные иконки
      const relevantIcons: string[] = [];
      for (const type of types) {
        relevantIcons.push(...getIconsForType(type, type));
      }

      if (relevantIcons.length > 0) {
        iconSection = `

## Доступные иконки для этих типов предметов:
\`\`\`json
${JSON.stringify(relevantIcons.slice(0, 200), null, 2)}
\`\`\`
${relevantIcons.length > 200 ? `\n(показано 200 из ${relevantIcons.length})` : ''}
`;
      }
    } catch {
      // Если не удалось распарсить - не добавляем иконки
    }
  }

  return `# Исправь ошибки в JSON

## Ошибки валидации:
\`\`\`
${errorMessage}
\`\`\`

## Исходный JSON:
\`\`\`json
${jsonText}
\`\`\`
${iconSection}
## Требования:
1. Исправь все указанные ошибки
2. Сохрани ВСЕ поля и данные каждого объекта

## ВАЖНО - Формат ответа:
- Верни ПОЛНЫЙ JSON массив со ВСЕМИ объектами и ВСЕМИ их полями
- Не сокращай, не пропускай поля
- JSON должен быть готов к копированию целиком
`;
}
