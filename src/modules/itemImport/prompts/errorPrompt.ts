import { getIconsForType } from '../lib';
import { getJsonSchemaForTypes } from '../model/schemas';

/**
 * Генерирует промпт с ошибками для исправления ИИ.
 * К моменту вызова схемы уже загружены (валидация прошла).
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

  // Определяем типы предметов из JSON для фильтрации схем
  const itemTypes = new Set<string>();
  try {
    const items = JSON.parse(jsonText);
    for (const item of items) {
      if (item.type) itemTypes.add(item.type);
    }
  } catch {
    // Если не удалось распарсить — покажем все типы
    itemTypes.add('consumable');
    itemTypes.add('ability');
    itemTypes.add('spell');
  }

  const schemas = getJsonSchemaForTypes(itemTypes);
  const schemaBlocks = Object.entries(schemas)
    .map(([type, schema]) => `### ${type}\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\``)
    .join('\n\n');

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
## JSON Schema (сгенерирована из Zod, используй как справку по допустимым значениям):

${schemaBlocks}

## Требования:
1. Исправь все указанные ошибки, используя JSON Schema выше как справку
2. Сохрани ВСЕ поля и данные каждого объекта

## ВАЖНО - Формат ответа:
- Верни ПОЛНЫЙ JSON массив со ВСЕМИ объектами и ВСЕМИ их полями
- Не сокращай, не пропускай поля
- JSON должен быть готов к копированию целиком
`;
}
