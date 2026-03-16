import { getJsonSchemaForTypes } from './schemas';

const ALL_TYPES = new Set(['consumable', 'ability', 'spell']);

/**
 * Генерирует промпт со схемами для ИИ (без иконок — они опциональны).
 * Схемы должны быть загружены через getSchemas() до вызова.
 */
export function generateSchemaPrompt(): string {
  const schemas = getJsonSchemaForTypes(ALL_TYPES);
  const schemaBlocks = Object.entries(schemas)
    .map(([type, schema]) => `### ${type}\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\``)
    .join('\n\n');

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

### Consumable — Potion
\`\`\`json
{
  "baseId": "potion-heal-greater",
  "type": "consumable",
  "name": "Большое зелье лечения",
  "system": {
    "consumableType": "potion",
    "description": "Густая алая жидкость, мерцающая в свете факелов. Варится алхимиками Красной Гильдии из корня мандрагоры и крови феникса. Мгновенно затягивает раны и восстанавливает силы.",
    "effects": [{ "type": "heal", "amount": 50, "duration": 0 }]
  }
}
\`\`\`

### Consumable — Bomb
\`\`\`json
{
  "baseId": "bomb-fire-standard",
  "type": "consumable",
  "name": "Огненная бомба",
  "system": {
    "consumableType": "bomb",
    "description": "Глиняная сфера, начинённая алхимическим огнём. При ударе о поверхность воспламеняется, разбрызгивая горящую смесь в радиусе нескольких метров. Излюбленное оружие горных разбойников.",
    "damage": { "amount": 50, "type": "fire" },
    "radius": 3,
    "save": { "type": "perception", "dc": 14 }
  }
}
\`\`\`

### Consumable — Scroll
\`\`\`json
{
  "baseId": "scroll-fireball",
  "type": "consumable",
  "name": "Свиток огненного шара",
  "system": {
    "consumableType": "scroll",
    "description": "Пергамент из драконьей кожи, испещрённый пылающими рунами. При активации руны вырываются с поверхности и формируют разрушительную сферу пламени. Одноразовый — после прочтения рассыпается в пепел.",
    "spell": { "name": "Fireball", "level": 3, "school": "evocation" },
    "requirements": { "ability": "perception", "dc": 13 }
  }
}
\`\`\`

### Consumable — Food
\`\`\`json
{
  "baseId": "food-dragon-steak",
  "type": "consumable",
  "name": "Стейк дракона",
  "system": {
    "consumableType": "food",
    "description": "Щедрый кусок мяса огненного дракона, прожаренный на его же пламени. Волокна пронизаны остаточной магией, дающей едоку временную устойчивость к огню. Деликатес, доступный лишь сильнейшим охотникам.",
    "nutrition": { "value": 8, "duration": 24 },
    "effects": [{ "type": "fire_resistance", "duration": 8, "value": 50 }]
  }
}
\`\`\`

### Consumable — Poison
\`\`\`json
{
  "baseId": "poison-sleep",
  "type": "consumable",
  "name": "Сонный яд",
  "system": {
    "consumableType": "poison",
    "description": "Бесцветная маслянистая жидкость, добываемая из шипов лунного цветка. Парализует нервную систему жертвы, погружая в глубокий неестественный сон. Ассасины Южного Берега щедро сдабривают ею клинки.",
    "damage": { "initial": "1d4", "recurring": "1d4", "duration": 3 },
    "save": { "type": "force", "dc": 14 },
    "application": "injury"
  }
}
\`\`\`

### Ability — Active
\`\`\`json
{
  "baseId": "ability-backstab",
  "type": "ability",
  "name": "Удар в спину",
  "system": {
    "category": "active",
    "activeKind": "attack",
    "description": "Стремительный выпад из тени, направленный в уязвимое место противника. Мастера этой техники обучаются годами в гильдиях воров, оттачивая точность до совершенства. Наносит утроенный урон скрытому врагу.",
    "range": { "kind": "melee" },
    "targeting": { "targetType": "enemy" }
  }
}
\`\`\`

### Ability — Passive
\`\`\`json
{
  "baseId": "ability-danger-sense",
  "type": "ability",
  "name": "Чувство опасности",
  "system": {
    "category": "passive",
    "passiveKind": "triggered",
    "description": "Обострённое шестое чувство, выработанное выживанием в подземельях. За мгновение до удара тело инстинктивно уклоняется, предчувствуя угрозу. Даёт преимущество на спасброски от ловушек и засад."
  }
}
\`\`\`

### Spell
\`\`\`json
{
  "baseId": "spell-fireball",
  "type": "spell",
  "name": "Огненный шар",
  "system": {
    "category": "elemental",
    "spellKind": "attack",
    "description": "Сгусток чистой огненной маны, сжатый до предела и выпущенный в цель. При столкновении взрывается, испепеляя всё в радиусе шести метров. Одно из первых боевых заклинаний, которым обучают в Академии Элементов.",
    "range": { "kind": "ranged", "distance": 30 },
    "targeting": { "targetType": "enemy", "maxTargets": "all" }
  }
}
\`\`\`

---

## Иконки

**НЕ УКАЗЫВАЙ поле \`img\`.** Иконки подбираются отдельным шагом после генерации.

---

## Требования к ответу

1. **baseId** — уникальный, kebab-case, латиница
2. **type** — обязательно: "consumable", "ability" или "spell"
3. **consumableType** — ОБЯЗАТЕЛЬНО для консьюмаблов
4. **name** — на русском, лорное название
5. **description** — ОБЯЗАТЕЛЬНО, развёрнутое лорное описание (2-4 предложения)
6. **Опциональные поля** — НЕ ВКЛЮЧАЙ если пользователь не задал конкретные значения

## ВАЖНО - Формат ответа:
- Верни ТОЛЬКО JSON массив, без markdown-разметки и комментариев
- JSON должен быть готов к копированию целиком`;
}
