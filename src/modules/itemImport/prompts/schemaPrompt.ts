import type { ShwItemType } from '../model';
import { getJsonSchemaForTypes } from '../model/schemas';
import { EXAMPLES_BY_TYPE, RULES_BY_TYPE } from './constants';

/**
 * Генерирует промпт со схемами для ИИ.
 * Включает только выбранные типы предметов.
 * Схемы должны быть загружены через getSchemas() до вызова.
 */
export function generateSchemaPrompt(types: Set<ShwItemType>): string {
  const schemas = getJsonSchemaForTypes(types as Set<string>);
  const schemaBlocks = Object.entries(schemas)
    .map(([type, schema]) => `### ${type}\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\``)
    .join('\n\n');

  const typesList = [...types].map((t) => `"${t}"`).join(', ');

  // Собираем правила для выбранных типов
  const typeSpecificRules = [...types]
    .map((t) => RULES_BY_TYPE[t])
    .filter(Boolean)
    .join('\n');

  // Собираем примеры для выбранных типов
  const examplesBlock = [...types].map((t) => EXAMPLES_BY_TYPE[t]).join('\n\n');

  return `# Shattered Worlds Item Import Schema

Создай JSON массив предметов для импорта в систему Shattered Worlds (Foundry VTT).

---

## СТРОГИЕ ПРАВИЛА (нарушение = невалидный результат)

1. **НЕ УКАЗЫВАЙ опциональные поля** если пользователь не задал конкретное значение. Система автоматически подставит значения по умолчанию (поля с "default" в схеме).
2. **quantity** — ЗАПРЕЩЕНО указывать. Это поле управляется инвентарём, не предметом.
3. **Указывай ТОЛЬКО**: обязательные поля (listed in "required" в JSON Schema) + поля, которые пользователь явно попросил задать.
4. **description** — ОБЯЗАТЕЛЬНО заполняй развёрнутым лорным описанием (2-4 предложения). Описание должно раскрывать суть предмета, его историю или применение в мире.
5. **baseId** — формат: \`{type}-{subtype}-{name}\`, например \`potion-heal-greater\`, \`bomb-fire-cluster\`. Только латиница, kebab-case.
6. **name** — на русском языке, лорное название.
7. **Числовые значения** (damage, amount, dc, radius и т.д.) — указывай ТОЛЬКО если пользователь задал или описал силу предмета. Иначе используй минимальные разумные значения из примеров.
8. **rarity** — указывай ТОЛЬКО если пользователь явно попросил определённую редкость.
9. **img** — НЕ указывай. Иконки подбираются отдельным шагом.
10. **Формат ответа** — ТОЛЬКО валидный JSON массив без markdown, комментариев, пояснений.

---

## JSON Schema (сгенерирована из Zod, является единственным источником истины)

${schemaBlocks}

---

## Примеры

${examplesBlock}

---

## Иконки

**НЕ УКАЗЫВАЙ поле \`img\`.** Иконки подбираются отдельным шагом после генерации.

---

## Требования к ответу

1. **baseId** — уникальный, kebab-case, латиница
2. **type** — обязательно: ${typesList}
${typeSpecificRules ? typeSpecificRules + '\n' : ''}3. **name** — на русском, лорное название
4. **description** — ОБЯЗАТЕЛЬНО, развёрнутое лорное описание (2-4 предложения)
5. **Опциональные поля** — НЕ ВКЛЮЧАЙ если пользователь не задал конкретные значения

## ВАЖНО - Формат ответа:
- Верни ТОЛЬКО JSON массив, без markdown-разметки и комментариев
- JSON должен быть готов к копированию целиком`;
}
